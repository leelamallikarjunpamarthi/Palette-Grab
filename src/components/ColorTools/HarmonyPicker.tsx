import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllHarmonies } from '../../utils/colorUtils';
import { ArrowRight, Share2, Save } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface HarmonyPickerProps {
    hex: string;
    onColorSelect?: (color: string) => void;
}

const HarmonyPicker: React.FC<HarmonyPickerProps> = ({ hex, onColorSelect }) => {
    const [selectedHarmony, setSelectedHarmony] = useState(0);
    const harmonies = getAllHarmonies(hex);
    const createPalette = useStore(state => state.createPalette);
    const addColorToPalette = useStore(state => state.addColorToPalette);

    const handleSaveAsPalette = () => {
        const harmony = harmonies[selectedHarmony];
        const name = `${harmony.name} (${hex})`;

        // In this store, createPalette doesn't return ID immediately
        // but we can deduce it or wait. For simplicity, we'll use a safer approach if possible.
        // The store currently adds to state. 
        createPalette(name);

        // This is a bit hacky due to the store design, but works for the prototype
        setTimeout(() => {
            const state = useStore.getState();
            const newPalette = state.palettes[state.palettes.length - 1];
            if (newPalette) {
                harmony.colors.forEach((colorHex, idx) => {
                    addColorToPalette(newPalette.id, {
                        id: `harmony-${idx}-${Date.now()}`,
                        hex: colorHex,
                        timestamp: Date.now()
                    });
                });
                alert(`Saved as palette: ${name}`);
            }
        }, 100);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-muted uppercase tracking-wider px-1">Harmony Lab</h3>
                <button
                    onClick={handleSaveAsPalette}
                    className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-full text-[10px] font-bold border border-accent/20 transition-all active:scale-95 shadow-sm"
                >
                    <Save className="w-3.5 h-3.5" />
                    Save as Palette
                </button>
            </div>

            {/* Harmony Type Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
                {harmonies.map((harmony, index) => (
                    <motion.button
                        key={harmony.name}
                        onClick={() => setSelectedHarmony(index)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all border ${selectedHarmony === index
                            ? 'bg-accent border-accent text-white shadow-lg shadow-accent/30 scale-105'
                            : 'bg-secondary border-border text-muted hover:bg-gray-100 hover:text-primary'
                            }`}
                        whileTap={{ scale: 0.95 }}
                    >
                        {harmony.name}
                    </motion.button>
                ))}
            </div>

            {/* Color Swatches */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedHarmony}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                >
                    {harmonies[selectedHarmony].colors.map((color, index) => (
                        <motion.div
                            key={`${color}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group"
                        >
                            <button
                                onClick={() => onColorSelect?.(color)}
                                className="w-full aspect-square rounded-2xl overflow-hidden border border-border shadow-md relative group transition-all"
                                style={{ backgroundColor: color }}
                            >
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center scale-75 group-hover:scale-100">
                                        <ArrowRight className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </button>
                            <div className="mt-2 flex flex-col items-center">
                                <span className="text-[10px] font-mono font-bold text-muted select-all group-hover:text-primary transition-colors">
                                    {color.toUpperCase()}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Harmony Insight */}
            <div className="p-4 bg-secondary rounded-2xl border border-border flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Share2 className="w-5 h-5 text-accent" />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Design Insight</h4>
                    <p className="text-[10px] text-muted leading-relaxed font-medium">
                        The {harmonies[selectedHarmony].name} harmony creates a {
                            selectedHarmony === 0 ? 'perfect balance of cool and warm tones' :
                                selectedHarmony === 1 ? 'soft, serene look that is easy on the eyes' :
                                    'vibrant, high-energy palette ideal for interactive elements'
                        }.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HarmonyPicker;
