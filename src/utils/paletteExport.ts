// Palette export utilities

import type { Palette } from '../types';

// Export palette as CSS variables
export const exportAsCSS = (palette: Palette): string => {
    const cssVars = palette.colors.map((color, index) => {
        const varName = `--color-${index + 1}`;
        return `  ${varName}: ${color.hex};`;
    }).join('\n');

    return `:root {\n${cssVars}\n}`;
};

// Export palette as SCSS variables
export const exportAsSCSS = (palette: Palette): string => {
    return palette.colors.map((color, index) => {
        return `$color-${index + 1}: ${color.hex};`;
    }).join('\n');
};

// Export palette as JSON
export const exportAsJSON = (palette: Palette): string => {
    const data = {
        name: palette.name,
        colors: palette.colors.map(c => c.hex),
        createdAt: new Date(palette.createdAt).toISOString()
    };
    return JSON.stringify(data, null, 2);
};

// Export palette as Tailwind config
export const exportAsTailwind = (palette: Palette): string => {
    const colors = palette.colors.reduce((acc, color, index) => {
        acc[`brand-${index + 1}`] = color.hex;
        return acc;
    }, {} as Record<string, string>);

    return `module.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(colors, null, 8)}\n    }\n  }\n}`;
};

// Download file helper
export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Export palette in various formats
export const exportPalette = (palette: Palette, format: 'css' | 'scss' | 'json' | 'tailwind') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
        case 'css':
            content = exportAsCSS(palette);
            filename = `${palette.name.toLowerCase().replace(/\s+/g, '-')}.css`;
            mimeType = 'text/css';
            break;
        case 'scss':
            content = exportAsSCSS(palette);
            filename = `${palette.name.toLowerCase().replace(/\s+/g, '-')}.scss`;
            mimeType = 'text/plain';
            break;
        case 'json':
            content = exportAsJSON(palette);
            filename = `${palette.name.toLowerCase().replace(/\s+/g, '-')}.json`;
            mimeType = 'application/json';
            break;
        case 'tailwind':
            content = exportAsTailwind(palette);
            filename = `tailwind.config.js`;
            mimeType = 'text/javascript';
            break;
    }

    downloadFile(content, filename, mimeType);
};
