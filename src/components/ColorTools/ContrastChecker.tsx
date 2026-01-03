import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkContrast, formatContrastRatio, getContrastFixedColor } from '../../utils/colorUtils';
import { Check, ShieldAlert, Sparkles, Wand2 } from 'lucide-react';

interface ContrastCheckerProps {
    foreground: string;
    onColorUpdate?: (newColor: string) => void;
    background?: string;
}

const ContrastChecker: React.FC<ContrastCheckerProps> = ({
    foreground,
    onColorUpdate,
    background = '#FFFFFF'
}) => {
    const [bgColor, setBgColor] = useState(background);
    const [currentForeground, setCurrentForeground] = useState(foreground);

    useEffect(() => {
        setCurrentForeground(foreground);
    }, [foreground]);

    const result = checkContrast(currentForeground, bgColor);

    const complianceItems = [
        { label: 'Normal Text (AA)', passed: result.AA, required: '4.5:1' },
        { label: 'Normal Text (AAA)', passed: result.AAA, required: '7:1' },
        { label: 'Large Text (AA)', passed: result.AALarge, required: '3:1' },
        { label: 'Large Text (AAA)', passed: result.AAALarge, required: '4.5:1' },
    ];

    const getAccessibilityGrade = () => {
        if (result.AAA) return { label: 'AAA', color: 'text-green-400', bg: 'bg-green-400/10' };
        if (result.AA) return { label: 'AA', color: 'text-blue-400', bg: 'bg-blue-400/10' };
        if (result.AALarge) return { label: 'A', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
        return { label: 'Fail', color: 'text-red-400', bg: 'bg-red-400/10' };
    };

    const grade = getAccessibilityGrade();

    const handleFixContrast = (target: number) => {
        const fixed = getContrastFixedColor(currentForeground, bgColor, target);
        setCurrentForeground(fixed);
        onColorUpdate?.(fixed);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-muted uppercase tracking-wider">Accessibility Lab</h3>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${grade.color.replace('text', 'border')} ${grade.bg} ${grade.color}`}>
                    WCAG {grade.label}
                </div>
            </div>

            {/* Preview Card */}
            <motion.div
                className="relative rounded-2xl border border-border overflow-hidden shadow-xl"
                style={{ backgroundColor: bgColor }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                {/* Simulated UI components */}
                <div className="p-8 space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border border-black/5" style={{ backgroundColor: currentForeground + '15' }}>
                            <ShieldAlert className="w-5 h-5" style={{ color: currentForeground }} />
                        </div>
                        <div>
                            <div className="h-2 w-24 rounded-full bg-black/10 mb-2" />
                            <div className="h-2 w-16 rounded-full bg-black/5" />
                        </div>
                    </div>

                    <h4 className="text-3xl font-bold tracking-tight mb-2" style={{ color: currentForeground }}>
                        The quick brown fox
                    </h4>
                    <p className="text-sm opacity-80 leading-relaxed max-w-[280px]" style={{ color: currentForeground }}>
                        Design is not just what it looks like and feels like. Design is how it works.
                    </p>

                    <div className="pt-4 flex gap-2">
                        <button
                            className="px-4 py-2 rounded-lg text-xs font-bold transition-transform active:scale-95"
                            style={{ backgroundColor: currentForeground, color: bgColor }}
                        >
                            Primary Action
                        </button>
                        <button
                            className="px-4 py-2 rounded-lg text-xs font-bold border transition-transform active:scale-95"
                            style={{ borderColor: currentForeground + '40', color: currentForeground }}
                        >
                            Outline
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-secondary rounded-2xl border border-border flex flex-col items-center justify-center text-center shadow-sm">
                    <p className="text-[10px] text-muted uppercase font-bold tracking-widest mb-1">Contrast Ratio</p>
                    <p className="text-2xl font-mono font-bold text-primary">{formatContrastRatio(result.ratio)}</p>
                </div>

                <AnimatePresence mode="wait">
                    {!result.AA ? (
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onClick={() => handleFixContrast(4.5)}
                            className="p-4 bg-primary/20 hover:bg-primary/30 rounded-xl border border-primary/30 flex flex-col items-center justify-center text-center group transition-all"
                        >
                            <div className="flex items-center gap-2 text-primary mb-1">
                                <Wand2 className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Fix for AA</span>
                            </div>
                            <p className="text-xs text-primary font-bold">Auto-Adjust</p>
                        </motion.button>
                    ) : !result.AAA ? (
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onClick={() => handleFixContrast(7)}
                            className="p-4 bg-accent/20 hover:bg-accent/30 rounded-xl border border-accent/30 flex flex-col items-center justify-center text-center group transition-all"
                        >
                            <div className="flex items-center gap-2 text-accent mb-1">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Fix for AAA</span>
                            </div>
                            <p className="text-xs text-accent font-bold">Peak Contrast</p>
                        </motion.button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-green-500/10 rounded-xl border border-green-500/30 flex flex-col items-center justify-center text-center"
                        >
                            <div className="flex items-center gap-2 text-green-400 mb-1">
                                <Check className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Perfect</span>
                            </div>
                            <p className="text-xs text-green-600 font-bold">WCAG AAA met</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Compliance Checklist */}
            <div className="grid grid-cols-2 gap-2">
                {complianceItems.map((item) => (
                    <div
                        key={item.label}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg border text-[10px] font-bold ${item.passed
                            ? 'bg-green-500/5 border-green-500/20 text-green-400'
                            : 'bg-red-500/5 border-red-500/20 text-red-400'
                            }`}
                    >
                        <span>{item.label}</span>
                        <span>{item.passed ? 'PASS' : 'FAIL'}</span>
                    </div>
                ))}
            </div>

            {/* Background Tester */}
            <div>
                <label className="block text-[10px] text-muted font-bold uppercase tracking-widest mb-3 text-center">Test Against Surface</label>
                <div className="flex gap-2 p-2 bg-secondary rounded-2xl border border-border">
                    {['#FFFFFF', '#F8F9FA', '#E9ECEF', '#212529', '#000000'].map((color) => (
                        <button
                            key={color}
                            onClick={() => setBgColor(color)}
                            className={`flex-1 h-10 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 ${bgColor === color ? 'border-primary ring-4 ring-primary/20' : 'border-border'
                                }`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContrastChecker;
