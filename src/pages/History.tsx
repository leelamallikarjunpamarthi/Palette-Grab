import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Trash2 } from 'lucide-react';

const History: React.FC = () => {
    const history = useStore((state) => state.history);
    const clearHistory = useStore((state) => state.clearHistory);

    // Group by date
    const groupedHistory = useMemo(() => {
        const groups: { [date: string]: typeof history } = {};

        history.forEach((color) => {
            const date = new Date(color.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(color);
        });

        return groups;
    }, [history]);

    const handleClearHistory = () => {
        if (confirm('Clear all color history? This cannot be undone.')) {
            clearHistory();
        }
    };

    return (
        <div className="min-h-full p-4 pb-24 bg-secondary">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Color History</h1>
                    <p className="text-muted">{history.length} colors captured</p>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={handleClearHistory}
                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* History List */}
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Clock className="w-16 h-16 text-muted/30 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-primary">No history yet</h3>
                    <p className="text-muted mb-6">Colors you capture will appear here</p>
                    <Link
                        to="/"
                        className="px-6 py-3 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
                    >
                        Start Capturing
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedHistory).map(([date, colors]) => (
                        <div key={date}>
                            <h2 className="text-sm font-bold text-muted uppercase tracking-wider mb-4 px-1">{date}</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {colors.map((color, index) => (
                                    <motion.div
                                        key={color.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="aspect-square bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent hover:shadow-lg transition-all group cursor-pointer"
                                    >
                                        <Link to={`/color/${color.id}`} className="block h-full">
                                            <div
                                                className="h-3/4 relative"
                                                style={{ backgroundColor: color.hex }}
                                            >
                                                {color.imageUrl && (
                                                    <img
                                                        src={color.imageUrl}
                                                        alt="Captured"
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                            </div>
                                            <div className="h-1/4 p-2 flex flex-col justify-center">
                                                <span className="text-xs font-mono font-bold truncate text-primary">
                                                    {color.hex.toUpperCase()}
                                                </span>
                                                <span className="text-[10px] text-muted font-medium">
                                                    {new Date(color.timestamp).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
