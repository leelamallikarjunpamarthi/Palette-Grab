import { useEffect, useRef, useState } from 'react';

interface UseCameraReturn {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    stream: MediaStream | null;
    error: string | null;
    permissionDenied: boolean;
    retryCamera: () => void;
}

export const useCamera = (): UseCameraReturn => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const isMounted = useRef(true);
    const maxRetries = 5;

    const requestCameraAccess = async (retryAttempt = 0) => {
        try {
            if (!isMounted.current) return null;

            setError(null);
            setPermissionDenied(false);

            // Check if permissions API is available
            if (navigator.permissions) {
                try {
                    const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
                    if (!isMounted.current) return null;

                    if (permission.state === 'denied') {
                        setPermissionDenied(true);
                        setError('Camera access denied. Please enable camera permissions in your device settings.');
                        return null;
                    }
                } catch (e) {
                    console.log('Permissions API not available, proceeding with getUserMedia');
                }
            }

            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode: 'environment', // Use back camera on mobile
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            if (!isMounted.current) {
                mediaStream.getTracks().forEach(track => track.stop());
                return null;
            }

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                try {
                    // Use play().catch to avoid "interrupted by a new load request" crash
                    await videoRef.current.play();
                } catch (playError) {
                    if (playError instanceof Error && playError.name !== 'AbortError') {
                        console.error('Video play error:', playError);
                    }
                }
            }

            setStream(mediaStream);
            setRetryCount(0); // Reset retry count on success
            return mediaStream;
        } catch (err) {
            if (!isMounted.current) return null;
            console.error('Camera access error:', err);

            if (err instanceof Error) {
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    setPermissionDenied(true);

                    if (retryAttempt < maxRetries) {
                        setError(`Camera access required. Attempt ${retryAttempt + 1}/${maxRetries}. Please tap "Allow" when prompted.`);

                        // ONLY trigger retry via state update, don't call recursively
                        setTimeout(() => {
                            if (isMounted.current) {
                                setRetryCount(prev => prev + 1);
                            }
                        }, 3000);
                    } else {
                        setError('Camera access denied multiple times. Please enable camera permissions in your device settings.');
                    }
                } else if (err.name === 'NotFoundError') {
                    setError('No camera found on this device.');
                } else if (err.name === 'NotReadableError') {
                    setError('Camera is already in use by another application.');
                } else {
                    setError(`Camera error: ${err.message}`);
                }
            }
            return null;
        }
    };

    useEffect(() => {
        isMounted.current = true;

        const initCamera = async () => {
            await requestCameraAccess(retryCount);
        };

        initCamera();

        return () => {
            isMounted.current = false;
            if (stream) {
                stream.getTracks().forEach(track => {
                    track.stop();
                    console.log('Camera track stopped');
                });
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, [retryCount]);

    const retryCamera = () => {
        setRetryCount(0);
        setPermissionDenied(false);
    };

    return { videoRef, error, stream, permissionDenied, retryCamera };
};
