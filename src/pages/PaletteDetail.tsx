import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, Trash2, Copy, Check, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportPalette } from '../utils/paletteExport';

const PaletteDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const palettes = useStore((state) => state.palettes);
    const deletePalette = useStore((state) => state.deletePalette);
    const removeColorFromPalette = useStore((state) => state.removeColorFromPalette);

    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showExportModal, setShowExportModal] = useState(false);

    const palette = palettes.find((p) => p.id === id);

    if (!palette) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4">
                <h2 className="text-xl font-bold mb-4">Palette not found</h2>
                <button
                    onClick={() => navigate('/palettes')}
                    className="px-4 py-2 bg-accent rounded-lg"
                >
                    Back to Palettes
                </button>
            </div>
        );
    }

    const handleDeletePalette = () => {
        if (confirm(`Delete "${palette.name}"? This cannot be undone.`)) {
            deletePalette(id!);
            navigate('/palettes');
        }
    };

    const handleCopyColor = (hex: string, colorId: string) => {
        navigator.clipboard.writeText(hex);
        setCopiedId(colorId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-full bg-secondary pb-24">
            {/* Header */}
            <div className="sticky top-0 bg-surface/90 backdrop-blur-md border-b border-border p-4 z-10">
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={() => navigate('/palettes')}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-primary" />
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowExportModal(true)}
                            className="p-2 hover:bg-accent/20 text-accent rounded-lg transition-colors"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleDeletePalette}
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-primary">{palette.name}</h1>
                <p className="text-sm text-muted mt-1 uppercase font-bold tracking-wider">
                    {palette.colors.length} {palette.colors.length === 1 ? 'color' : 'colors'}
                </p>
            </div>

            {/* Colors Grid */}
            <div className="p-4">
                {palette.colors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-24 h-24 bg-surface rounded-full mb-4 flex items-center justify-center border border-border shadow-inner">
                            <span className="text-4xl">🎨</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-primary">No colors yet</h3>
                        <p className="text-muted mb-4 font-medium">Capture colors from the camera to add them here</p>
                        <Link
                            to="/"
                            className="px-6 py-3 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
                        >
                            Go to Camera
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {palette.colors.map((color, index) => (
                            <motion.div
                                key={color.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent hover:shadow-lg transition-all"
                            >
                                <div className="flex">
                                    {/* Color Swatch */}
                                    <div
                                        className="w-24 h-24 flex-shrink-0"
                                        style={{ backgroundColor: color.hex }}
                                    />

                                    {/* Color Info */}
                                    <div className="flex-1 p-4 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-mono font-bold text-lg text-primary">{color.hex.toUpperCase()}</span>
                                                <button
                                                    onClick={() => handleCopyColor(color.hex, color.id)}
                                                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                                >
                                                    {copiedId === color.id ? (
                                                        <Check className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                            {color.note && (
                                                <p className="text-sm text-muted font-medium mb-2">{color.note}</p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                to={`/color/${color.id}`}
                                                className="text-sm text-accent hover:underline"
                                            >
                                                Details
                                            </Link>
                                            <button
                                                onClick={() => removeColorFromPalette(id!, color.id)}
                                                className="text-sm text-red-400 hover:underline ml-auto"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Export Modal */}
            <AnimatePresence>
                {showExportModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowExportModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-surface border border-border rounded-3xl p-8 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Export Palette</h2>
                                <button
                                    onClick={() => setShowExportModal(false)}
                                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { format: 'css' as const, label: 'CSS Variables', desc: 'Export as CSS custom properties' },
                                    { format: 'scss' as const, label: 'SCSS Variables', desc: 'Export as Sass/SCSS variables' },
                                    { format: 'json' as const, label: 'JSON', desc: 'Export as JSON data' },
                                    { format: 'tailwind' as const, label: 'Tailwind Config', desc: 'Export as Tailwind theme colors' },
                                ].map((option) => (
                                    <motion.button
                                        key={option.format}
                                        onClick={() => {
                                            exportPalette(palette, option.format);
                                            setShowExportModal(false);
                                        }}
                                        className="w-full p-4 bg-secondary hover:bg-gray-100 border border-border rounded-2xl text-left transition-all"
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="font-bold text-primary mb-1">{option.label}</div>
                                        <div className="text-xs text-muted font-medium">{option.desc}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PaletteDetail;
