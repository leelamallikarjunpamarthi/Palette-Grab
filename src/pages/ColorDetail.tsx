import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getColorName } from '../utils/colorUtils';
import ColorConverter from '../components/ColorTools/ColorConverter';
import HarmonyPicker from '../components/ColorTools/HarmonyPicker';
import TintShadeGenerator from '../components/ColorTools/TintShadeGenerator';
import ContrastChecker from '../components/ColorTools/ContrastChecker';

const ColorDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const history = useStore((state) => state.history);
    const addColorToHistory = useStore((state) => state.addColorToHistory);

    const color = history.find((c) => c.id === id);

    if (!color) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-4 bg-secondary">
                <h2 className="text-xl font-bold mb-4">Color not found</h2>
                <button
                    onClick={() => navigate('/history')}
                    className="px-4 py-2 bg-accent rounded-lg"
                >
                    Back to History
                </button>
            </div>
        );
    }

    const colorName = getColorName(color.hex);

    const handleColorSelect = (newColor: string) => {
        addColorToHistory(newColor);
        // Show feedback or just navigate to history to see the new entry
        // Since we don't have the new ID easily, we'll just alert or trust the user sees it in history
        // A better way would be to return the ID from addColorToHistory
    };

    const handleContrastUpdate = (newColor: string) => {
        addColorToHistory(newColor);
        alert(`New accessible color generated: ${newColor.toUpperCase()}`);
    };

    return (
        <div className="min-h-screen bg-secondary pb-24">
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 bg-surface/90 backdrop-blur-md border-b border-border p-4 z-10"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors mb-2"
                >
                    <ArrowLeft className="w-5 h-5 text-primary" />
                </button>
                <h1 className="text-2xl font-bold text-primary">Color Details</h1>
            </motion.div>

            <div className="p-4 space-y-6">
                {/* Large Color Swatch with Name */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="relative w-full h-64 rounded-xl shadow-2xl overflow-hidden"
                    style={{ backgroundColor: color.hex }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                            <span className="text-sm text-white/80">Color Name</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white">{colorName}</h2>
                        <p className="text-lg font-mono text-white/90 mt-1">{color.hex.toUpperCase()}</p>
                    </div>
                </motion.div>

                {/* Color Format Converter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-surface border border-border rounded-2xl p-6 shadow-sm"
                >
                    <ColorConverter hex={color.hex} />
                </motion.div>

                {/* Color Harmonies */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-surface border border-border rounded-2xl p-6 shadow-sm"
                >
                    <HarmonyPicker hex={color.hex} onColorSelect={handleColorSelect} />
                </motion.div>

                {/* Tints & Shades */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-surface border border-border rounded-2xl p-6 shadow-sm"
                >
                    <TintShadeGenerator hex={color.hex} onColorSelect={handleColorSelect} />
                </motion.div>

                {/* Contrast Checker */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-surface border border-border rounded-2xl p-6 shadow-sm"
                >
                    <ContrastChecker
                        foreground={color.hex}
                        onColorUpdate={handleContrastUpdate}
                    />
                </motion.div>

                {/* Timestamp */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-xs font-bold text-muted uppercase tracking-widest pb-8"
                >
                    Captured on {new Date(color.timestamp).toLocaleString()}
                </motion.div>
            </div>
        </div>
    );
};

export default ColorDetail;
