import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Palette as PaletteIcon, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackPaletteCreated } from '../utils/analytics';

const Palettes: React.FC = () => {
    const palettes = useStore((state) => state.palettes);
    const createPalette = useStore((state) => state.createPalette);
    const [isCreating, setIsCreating] = useState(false);
    const [newPaletteName, setNewPaletteName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter palettes based on search
    const filteredPalettes = useMemo(() => {
        if (!searchQuery.trim()) return palettes;
        const query = searchQuery.toLowerCase();
        return palettes.filter(p => p.name.toLowerCase().includes(query));
    }, [palettes, searchQuery]);

    const handleCreatePalette = () => {
        if (newPaletteName.trim()) {
            createPalette(newPaletteName.trim());
            trackPaletteCreated(newPaletteName.trim()); // Track analytics
            setNewPaletteName('');
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-full p-4 pb-24 bg-secondary">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">My Palettes</h1>
                <p className="text-muted">Organize your captured colors</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search palettes..."
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 shadow-sm"
                />
            </div>

            {/* Create New Palette */}
            <motion.button
                onClick={() => setIsCreating(true)}
                className="w-full p-4 mb-6 bg-accent/5 border-2 border-dashed border-accent/20 text-accent rounded-xl flex items-center justify-center gap-2 hover:bg-accent/10 transition-all font-bold"
                whileTap={{ scale: 0.98 }}
            >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Create New Palette</span>
            </motion.button>

            {/* Create Palette Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-surface border border-border rounded-2xl shadow-2xl p-6 w-full max-w-md"
                    >
                        <h2 className="text-xl font-bold mb-4">New Palette</h2>
                        <input
                            type="text"
                            value={newPaletteName}
                            onChange={(e) => setNewPaletteName(e.target.value)}
                            placeholder="Palette name..."
                            className="w-full px-4 py-3 bg-secondary border border-border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleCreatePalette()}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setIsCreating(false);
                                    setNewPaletteName('');
                                }}
                                className="flex-1 px-4 py-3 bg-secondary border border-border rounded-xl hover:bg-gray-100 transition-all font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePalette}
                                className="flex-1 px-4 py-3 bg-accent text-white rounded-xl hover:opacity-90 transition-all font-bold shadow-md shadow-accent/20"
                            >
                                Create
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Palettes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPalettes.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <PaletteIcon className="w-16 h-16 text-muted/20 mb-4" />
                        <h3 className="text-xl font-bold mb-2">
                            {searchQuery ? 'No palettes found' : 'No palettes yet'}
                        </h3>
                        <p className="text-muted">
                            {searchQuery ? 'Try a different search term' : 'Create your first palette to get started'}
                        </p>
                    </div>
                ) : (
                    filteredPalettes.map((palette, index) => (
                        <motion.div
                            key={palette.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link to={`/palettes/${palette.id}`}>
                                <motion.div className="bg-surface border border-border rounded-2xl p-5 hover:border-accent hover:shadow-xl transition-all"
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <h3 className="font-bold text-lg mb-3 truncate">{palette.name}</h3>

                                    {/* Color Preview */}
                                    <div className="flex gap-2 mb-4 h-14">
                                        {palette.colors.length === 0 ? (
                                            <div className="flex-1 bg-secondary rounded-xl flex items-center justify-center text-xs text-muted">
                                                Empty
                                            </div>
                                        ) : (
                                            palette.colors.slice(0, 5).map((color) => (
                                                <div
                                                    key={color.id}
                                                    className="flex-1 rounded-lg shadow-inner"
                                                    style={{ backgroundColor: color.hex }}
                                                />
                                            ))
                                        )}
                                        {palette.colors.length > 5 && (
                                            <div className="w-12 bg-secondary rounded-xl flex items-center justify-center text-xs font-bold text-muted border border-border">
                                                +{palette.colors.length - 5}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-xs font-bold text-muted uppercase tracking-wider">
                                        {palette.colors.length} {palette.colors.length === 1 ? 'color' : 'colors'}
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Palettes;
