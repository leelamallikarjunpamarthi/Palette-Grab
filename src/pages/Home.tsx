import React, { useState } from 'react';
import CameraView from '../components/Camera/CameraView';
import { Menu, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { trackColorCapture, trackColorAddedToPalette, trackPaletteCreated } from '../utils/analytics';

const Home: React.FC = () => {
    const [lastCapturedColor, setLastCapturedColor] = useState<string | null>(null);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [capturedColorToSave, setCapturedColorToSave] = useState<string | null>(null);

    const [lastCapturedImage, setLastCapturedImage] = useState<string | null>(null);

    const addColorToHistory = useStore((state) => state.addColorToHistory);
    const palettes = useStore((state) => state.palettes);
    const createPalette = useStore((state) => state.createPalette);
    const addColorToPalette = useStore(state => state.addColorToPalette);

    const handleCapture = (color: string, imageUrl?: string) => {
        setLastCapturedColor(color);
        if (imageUrl) {
            setLastCapturedImage(imageUrl);
        }

        // Add to history immediately with both color and image
        addColorToHistory(color, imageUrl);
        trackColorCapture(color);

        // Show for feedback then open save modal
        setTimeout(() => {
            setLastCapturedColor(null);
            setCapturedColorToSave(color);
            setShowSaveModal(true);
        }, 1500);
    };

    const handleSaveToPalette = (paletteId: string) => {
        if (capturedColorToSave) {
            // eslint-disable-next-line react-hooks/purity
            const newColorId = crypto.randomUUID();

            addColorToPalette(paletteId, {
                id: newColorId,
                hex: capturedColorToSave,
                timestamp: Date.now(),
            });
            trackColorAddedToPalette(paletteId, capturedColorToSave); // Track analytics
            setShowSaveModal(false);
            setCapturedColorToSave(null);
        }
    };

    const handleCreateAndSave = () => {
        const paletteName = prompt('Enter palette name:');
        if (paletteName?.trim()) {
            // Note: createPalette doesn't return ID, so we need to improve store
            // For now, create then find
            createPalette(paletteName.trim());
            trackPaletteCreated(paletteName.trim()); // Track analytics
            // Find the newly created palette (it'll be last)
            setTimeout(() => {
                const allPalettes = useStore.getState().palettes;
                const newPalette = allPalettes[allPalettes.length - 1];
                if (newPalette && capturedColorToSave) {
                    handleSaveToPalette(newPalette.id);
                }
            }, 100);
        }
    };

    return (
        <div className="h-full w-full relative bg-secondary">
            <CameraView
                onCapture={handleCapture}
            />

            {/* Top Bar Overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-white/80 to-transparent pointer-events-none">
                <button className="p-2 text-primary/80 hover:text-primary pointer-events-auto">
                    <Menu />
                </button>
                <span className="text-lg font-bold tracking-wider">PALETTE GRAB</span>
                <div className="w-10"></div>
            </div>

            {/* Temporary Feedback Overlay */}
            <AnimatePresence>
                {lastCapturedColor && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20"
                    >
                        <div className="bg-surface/95 backdrop-blur-md px-6 py-3 rounded-full border border-border shadow-xl flex items-center gap-3">
                            <div
                                className="w-6 h-6 rounded-full border border-black/10"
                                style={{ backgroundColor: lastCapturedColor }}
                            />
                            <span className="font-mono font-medium">Saved {lastCapturedColor}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Save to Palette Modal */}
            <AnimatePresence>
                {showSaveModal && capturedColorToSave && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center z-30 p-4"
                        onClick={() => setShowSaveModal(false)}
                    >
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-surface border border-border rounded-t-2xl md:rounded-2xl p-6 w-full max-w-md max-h-[70vh] overflow-y-auto"
                        >
                            <h2 className="text-xl font-bold mb-4">Save to Palette</h2>

                            {/* Color & Image Preview */}
                            <div className="flex items-center gap-4 mb-6 p-4 bg-secondary rounded-xl">
                                {lastCapturedImage ? (
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                                        <img src={lastCapturedImage} alt="Captured" className="w-full h-full object-cover" />
                                        <div
                                            className="absolute bottom-0 left-0 right-0 h-2"
                                            style={{ backgroundColor: capturedColorToSave }}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="w-12 h-12 rounded-lg"
                                        style={{ backgroundColor: capturedColorToSave }}
                                    />
                                )}
                                <span className="font-mono font-bold text-lg">{capturedColorToSave.toUpperCase()}</span>
                            </div>

                            {/* Palette List */}
                            <div className="space-y-2 mb-4">
                                {palettes.length === 0 ? (
                                    <p className="text-muted text-center py-4 font-medium uppercase text-[10px] tracking-widest">No palettes yet</p>
                                ) : (
                                    palettes.map((palette) => (
                                        <button
                                            key={palette.id}
                                            onClick={() => handleSaveToPalette(palette.id)}
                                            className="w-full p-3 bg-secondary hover:bg-gray-100 border border-border rounded-xl text-left transition-all flex items-center justify-between group"
                                        >
                                            <div>
                                                <div className="font-medium">{palette.name}</div>
                                                <div className="text-xs text-muted font-bold uppercase tracking-widest mt-0.5">
                                                    {palette.colors.length} {palette.colors.length === 1 ? 'color' : 'colors'}
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {palette.colors.slice(0, 4).map((c) => (
                                                    <div
                                                        key={c.id}
                                                        className="w-6 h-6 rounded border border-black/5"
                                                        style={{ backgroundColor: c.hex }}
                                                    />
                                                ))}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>

                            {/* Create New Palette */}
                            <button
                                onClick={handleCreateAndSave}
                                className="w-full p-4 bg-accent/5 border-2 border-dashed border-accent/20 rounded-2xl hover:bg-accent/10 hover:border-accent/40 text-accent transition-all flex items-center justify-center gap-3 mb-6 active:scale-[0.98]"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="font-bold">Create New Palette</span>
                            </button>

                            {/* Skip/Close */}
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="w-full p-3 bg-secondary rounded-xl hover:bg-gray-100 transition-colors font-medium border border-border"
                            >
                                Skip
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
