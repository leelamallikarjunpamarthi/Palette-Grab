import React from 'react';
import { motion } from 'framer-motion';
import { getTints, getShades } from '../../utils/colorUtils';

interface TintShadeGeneratorProps {
    hex: string;
    onColorSelect?: (color: string) => void;
}

const TintShadeGenerator: React.FC<TintShadeGeneratorProps> = ({ hex, onColorSelect }) => {
    const tints = getTints(hex, 5);
    const shades = getShades(hex, 5);

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-2 px-1">Tints & Shades</h3>

            {/* Tints (Lighter) */}
            <div>
                <p className="text-[10px] uppercase font-bold text-muted mb-2 tracking-widest">Tints (Lighter)</p>
                <div className="flex gap-2">
                    {tints.map((color, index) => (
                        <motion.button
                            key={`tint-${index}`}
                            onClick={() => onColorSelect?.(color)}
                            className="flex-1 aspect-square rounded-xl border border-border shadow-sm hover:border-accent/40 transition-all active:scale-[0.98]"
                            style={{ backgroundColor: color }}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        />
                    ))}
                </div>
            </div>

            {/* Original Color */}
            <div>
                <p className="text-[10px] uppercase font-bold text-muted mb-2 tracking-widest">Original</p>
                <div
                    className="h-16 rounded-xl border-2 border-accent shadow-md"
                    style={{ backgroundColor: hex }}
                />
            </div>

            {/* Shades (Darker) */}
            <div>
                <p className="text-[10px] uppercase font-bold text-muted mb-2 tracking-widest">Shades (Darker)</p>
                <div className="flex gap-2">
                    {shades.map((color, index) => (
                        <motion.button
                            key={`shade-${index}`}
                            onClick={() => onColorSelect?.(color)}
                            className="flex-1 aspect-square rounded-xl border border-border shadow-sm hover:border-accent/40 transition-all active:scale-[0.98]"
                            style={{ backgroundColor: color }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TintShadeGenerator;
