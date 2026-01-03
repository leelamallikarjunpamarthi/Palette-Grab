import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    hexToRgb,
    hexToHsl,
    hexToCmyk,
    formatRgb,
    formatHsl,
    formatCmyk
} from '../../utils/colorUtils';

interface ColorConverterProps {
    hex: string;
}

const ColorConverter: React.FC<ColorConverterProps> = ({ hex }) => {
    const [copied, setCopied] = useState<string | null>(null);

    const rgb = hexToRgb(hex);
    const hsl = hexToHsl(hex);
    const cmyk = hexToCmyk(hex);

    const formats = [
        { label: 'HEX', value: hex.toUpperCase() },
        { label: 'RGB', value: rgb ? formatRgb(rgb) : 'N/A' },
        { label: 'HSL', value: hsl ? formatHsl(hsl) : 'N/A' },
        { label: 'CMYK', value: cmyk ? formatCmyk(cmyk) : 'N/A' },
    ];

    const handleCopy = (value: string, label: string) => {
        navigator.clipboard.writeText(value);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-2">
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-2 px-1">Color Formats</h3>
            <div className="grid gap-2">
                {formats.map((format, index) => (
                    <motion.button
                        key={format.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleCopy(format.value, format.label)}
                        className="flex items-center justify-between p-3 bg-secondary hover:bg-gray-100 border border-border rounded-xl transition-all group shadow-sm active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-primary w-12">{format.label}</span>
                            <span className="font-mono text-sm">{format.value}</span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            {copied === format.label ? (
                                <Check className="w-4 h-4 text-green-400" />
                            ) : (
                                <Copy className="w-4 h-4 text-muted" />
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default ColorConverter;
