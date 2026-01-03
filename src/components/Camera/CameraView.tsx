import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, AlertCircle, RotateCcw } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';

interface CameraViewProps {
    onCapture: (color: string, imageUrl?: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
    const { videoRef, error, stream, permissionDenied, retryCamera } = useCamera();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentColor, setCurrentColor] = useState<string>('#000000');
    const animationFrameRef = useRef<number | null>(null);

    // Sample color from center of video
    const sampleColor = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || !stream) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
            animationFrameRef.current = requestAnimationFrame(sampleColor);
            return;
        }

        // We only need the center pixel
        const size = 1;
        const x = (video.videoWidth - size) / 2;
        const y = (video.videoHeight - size) / 2;

        canvas.width = size;
        canvas.height = size;

        ctx.drawImage(video, x, y, size, size, 0, 0, size, size);
        const pixel = ctx.getImageData(0, 0, 1, 1).data;

        // Convert to Hex
        const r = pixel[0];
        const g = pixel[1];
        const b = pixel[2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

        setCurrentColor(hex);

        animationFrameRef.current = requestAnimationFrame(sampleColor);
    }, [stream, videoRef]);

    // Start sampling loop
    useEffect(() => {
        if (stream && videoRef.current) {
            animationFrameRef.current = requestAnimationFrame(sampleColor);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [stream, sampleColor, videoRef]);

    const handleCapture = () => {
        let imageUrl: string | undefined;

        // Capture full image
        if (videoRef.current) {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                try {
                    imageUrl = canvas.toDataURL('image/png');
                } catch (e) {
                    console.error('Failed to capture image:', e);
                }
            }
        }

        onCapture(currentColor, imageUrl);
    };

    return (
        <div className="relative w-full h-full">
            {/* Video Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
            />

            {/* Hidden Canvas for color sampling */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/90 backdrop-blur-md p-8 text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-primary">Camera Access Required</h3>
                    <p className="text-muted mb-6 font-medium leading-relaxed">{error}</p>

                    {permissionDenied && (
                        <button
                            onClick={retryCamera}
                            className="flex items-center gap-2 px-6 py-3 bg-primary rounded-lg hover:bg-primary/80 transition-colors"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Retry Camera Access
                        </button>
                    )}

                    <div className="mt-8 text-[10px] text-muted space-y-2 max-w-xs font-bold uppercase tracking-widest text-left border-l-2 border-accent/20 pl-4">
                        <p>• Grant camera permissions</p>
                        <p>• Enable camera in settings</p>
                        <p>• Refresh page after fix</p>
                    </div>
                </div>
            )}

            {/* Crosshair Overlay */}
            {stream && !error && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Crosshair */}
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-2 border-white rounded-full opacity-50" />
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-white opacity-50" />
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white opacity-50" />

                        {/* Center dot with color preview */}
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
                            style={{ backgroundColor: currentColor }}
                        />
                    </div>

                    {/* Color Info Display */}
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-border shadow-xl">
                        <div className="text-center">
                            <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-0.5">Current</div>
                            <div className="font-mono font-bold text-lg tracking-wider text-primary">
                                {currentColor.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Capture Button */}
            {stream && !error && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
                    <button
                        onClick={handleCapture}
                        className="w-20 h-20 rounded-full bg-white/20 border-4 border-white backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-2xl"
                    >
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                            <Camera className="w-8 h-8 text-primary" />
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CameraView;
