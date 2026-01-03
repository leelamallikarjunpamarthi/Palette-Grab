// Comprehensive color utilities - merged from multiple files

// ============= TYPE DEFINITIONS =============

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface HSL {
    h: number;
    s: number;
    l: number;
}

export interface CMYK {
    c: number;
    m: number;
    y: number;
    k: number;
}

export interface ColorHarmony {
    name: string;
    colors: string[];
}

export interface ContrastResult {
    ratio: number;
    AA: boolean;
    AAA: boolean;
    AALarge: boolean;
    AAALarge: boolean;
}

// ============= COLOR CONVERSION =============

export const hexToRgb = (hex: string): RGB | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const rgbToHsl = (r: number, g: number, b: number): HSL => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
};

export const hslToRgb = (h: number, s: number, l: number): RGB => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

export const rgbToCmyk = (r: number, g: number, b: number): CMYK => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);

    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

    c = ((c - k) / (1 - k)) * 100;
    m = ((m - k) / (1 - k)) * 100;
    y = ((y - k) / (1 - k)) * 100;
    k = k * 100;

    return {
        c: Math.round(c),
        m: Math.round(m),
        y: Math.round(y),
        k: Math.round(k)
    };
};

export const cmykToRgb = (c: number, m: number, y: number, k: number): RGB => {
    c = c / 100;
    m = m / 100;
    y = y / 100;
    k = k / 100;

    return {
        r: Math.round(255 * (1 - c) * (1 - k)),
        g: Math.round(255 * (1 - m) * (1 - k)),
        b: Math.round(255 * (1 - y) * (1 - k))
    };
};

export const hexToHsl = (hex: string): HSL | null => {
    const rgb = hexToRgb(hex);
    return rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
};

export const hslToHex = (h: number, s: number, l: number): string => {
    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
};

export const hexToCmyk = (hex: string): CMYK | null => {
    const rgb = hexToRgb(hex);
    return rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;
};

export const formatRgb = (rgb: RGB): string => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
export const formatHsl = (hsl: HSL): string => `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
export const formatCmyk = (cmyk: CMYK): string => `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

// ============= COLOR HARMONIES =============

const normalizeHue = (hue: number): number => {
    while (hue < 0) hue += 360;
    while (hue >= 360) hue -= 360;
    return hue;
};

export const getComplementary = (hex: string): ColorHarmony => {
    const hsl = hexToHsl(hex);
    if (!hsl) return { name: 'Complementary', colors: [hex] };

    const complementaryHue = normalizeHue(hsl.h + 180);
    return {
        name: 'Complementary',
        colors: [hex, hslToHex(complementaryHue, hsl.s, hsl.l)]
    };
};

export const getTriadic = (hex: string): ColorHarmony => {
    const hsl = hexToHsl(hex);
    if (!hsl) return { name: 'Triadic', colors: [hex] };

    return {
        name: 'Triadic',
        colors: [
            hex,
            hslToHex(normalizeHue(hsl.h + 120), hsl.s, hsl.l),
            hslToHex(normalizeHue(hsl.h + 240), hsl.s, hsl.l)
        ]
    };
};

export const getAnalogous = (hex: string): ColorHarmony => {
    const hsl = hexToHsl(hex);
    if (!hsl) return { name: 'Analogous', colors: [hex] };

    return {
        name: 'Analogous',
        colors: [
            hslToHex(normalizeHue(hsl.h - 30), hsl.s, hsl.l),
            hex,
            hslToHex(normalizeHue(hsl.h + 30), hsl.s, hsl.l)
        ]
    };
};

export const getSplitComplementary = (hex: string): ColorHarmony => {
    const hsl = hexToHsl(hex);
    if (!hsl) return { name: 'Split-Complementary', colors: [hex] };

    return {
        name: 'Split-Complementary',
        colors: [
            hex,
            hslToHex(normalizeHue(hsl.h + 150), hsl.s, hsl.l),
            hslToHex(normalizeHue(hsl.h + 210), hsl.s, hsl.l)
        ]
    };
};

export const getTetradic = (hex: string): ColorHarmony => {
    const hsl = hexToHsl(hex);
    if (!hsl) return { name: 'Tetradic', colors: [hex] };

    return {
        name: 'Tetradic',
        colors: [
            hex,
            hslToHex(normalizeHue(hsl.h + 90), hsl.s, hsl.l),
            hslToHex(normalizeHue(hsl.h + 180), hsl.s, hsl.l),
            hslToHex(normalizeHue(hsl.h + 270), hsl.s, hsl.l)
        ]
    };
};

export const getSquareHarmony = (hex: string): ColorHarmony => {
    const hsl = hexToHsl(hex);
    if (!hsl) return { name: 'Square', colors: [hex] };

    return {
        name: 'Square',
        colors: [
            hex,
            hslToHex(normalizeHue(hsl.h + 90), hsl.s, hsl.l),
            hslToHex(normalizeHue(hsl.h + 180), hsl.s, hsl.l),
            hslToHex(normalizeHue(hsl.h + 270), hsl.s, hsl.l)
        ]
    };
};

export const getMonochromatic = (hex: string, count: number = 5): ColorHarmony => {
    const hsl = hexToHsl(hex);
    if (!hsl) return { name: 'Monochromatic', colors: [hex] };

    const colors: string[] = [];
    const step = 80 / (count - 1);

    for (let i = 0; i < count; i++) {
        const lightness = 10 + (step * i);
        colors.push(hslToHex(hsl.h, hsl.s, Math.round(lightness)));
    }

    return { name: 'Monochromatic', colors };
};

export const getTints = (hex: string, count: number = 5): string[] => {
    const hsl = hexToHsl(hex);
    if (!hsl) return [hex];

    const tints: string[] = [];
    const step = (95 - hsl.l) / count;

    for (let i = 1; i <= count; i++) {
        const lightness = Math.min(95, hsl.l + (step * i));
        tints.push(hslToHex(hsl.h, hsl.s, Math.round(lightness)));
    }

    return tints;
};

export const getShades = (hex: string, count: number = 5): string[] => {
    const hsl = hexToHsl(hex);
    if (!hsl) return [hex];

    const shades: string[] = [];
    const step = hsl.l / count;

    for (let i = 1; i <= count; i++) {
        const lightness = Math.max(5, hsl.l - (step * i));
        shades.push(hslToHex(hsl.h, hsl.s, Math.round(lightness)));
    }

    return shades;
};

export const getAllHarmonies = (hex: string): ColorHarmony[] => {
    return [
        getComplementary(hex),
        getAnalogous(hex),
        getTriadic(hex),
        getSplitComplementary(hex),
        getTetradic(hex),
        getSquareHarmony(hex),
        getMonochromatic(hex)
    ];
};

// ============= COLOR CONTRAST =============

const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

export const getContrastRatio = (hex1: string, hex2: string): number => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    if (!rgb1 || !rgb2) return 1;

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
};

export const checkContrast = (foreground: string, background: string): ContrastResult => {
    const ratio = getContrastRatio(foreground, background);

    return {
        ratio: Math.round(ratio * 100) / 100,
        AA: ratio >= 4.5,
        AAA: ratio >= 7,
        AALarge: ratio >= 3,
        AAALarge: ratio >= 4.5
    };
};

export const getSuggestedTextColor = (backgroundHex: string): string => {
    const whiteContrast = getContrastRatio(backgroundHex, '#FFFFFF');
    const blackContrast = getContrastRatio(backgroundHex, '#000000');
    return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
};

export const formatContrastRatio = (ratio: number): string => `${ratio.toFixed(2)}:1`;

/**
 * Adjusts foreground color lightness to meet a target contrast ratio against background
 */
export const getContrastFixedColor = (
    foreground: string,
    background: string,
    targetRatio: number = 4.5
): string => {
    const currentResult = checkContrast(foreground, background);
    if (currentResult.ratio >= targetRatio) return foreground;

    const hsl = hexToHsl(foreground);
    const bgHsl = hexToHsl(background);
    if (!hsl || !bgHsl) return foreground;

    // Determine direction (lighter or darker)
    const isBgLight = bgHsl.l > 50;

    // Binary search for optimal lightness
    let low = isBgLight ? 0 : hsl.l;
    let high = isBgLight ? hsl.l : 100;

    // If background is light, we need a darker foreground
    // If background is dark, we need a lighter foreground
    if (isBgLight) {
        low = 0;
        high = hsl.l;
    } else {
        low = hsl.l;
        high = 100;
    }

    let bestHex = foreground;
    let iterations = 0;

    while (iterations < 10) {
        const mid = (low + high) / 2;
        const testHex = hslToHex(hsl.h, hsl.s, mid);
        const result = checkContrast(testHex, background);

        if (result.ratio >= targetRatio) {
            bestHex = testHex;
            // If we're searching for a darker color, try even darker
            if (isBgLight) {
                low = mid;
            } else {
                high = mid;
            }
        } else {
            // Need more contrast
            if (isBgLight) {
                high = mid;
            } else {
                low = mid;
            }
        }
        iterations++;
    }

    // Final check - if we couldn't find a good one within the range, force extremes
    const finalResult = checkContrast(bestHex, background);
    if (finalResult.ratio < targetRatio) {
        return isBgLight ? '#000000' : '#FFFFFF';
    }

    return bestHex;
};

// ============= COLOR NAMING =============

interface NamedColor {
    name: string;
    hex: string;
}

const COLOR_NAMES: NamedColor[] = [
    { name: 'Red', hex: '#FF0000' }, { name: 'Crimson', hex: '#DC143C' },
    { name: 'Coral', hex: '#FF7F50' }, { name: 'Salmon', hex: '#FA8072' },
    { name: 'Pink', hex: '#FFC0CB' }, { name: 'Rose', hex: '#FF007F' },
    { name: 'Maroon', hex: '#800000' }, { name: 'Orange', hex: '#FFA500' },
    { name: 'Tangerine', hex: '#F28500' }, { name: 'Peach', hex: '#FFE5B4' },
    { name: 'Yellow', hex: '#FFFF00' }, { name: 'Gold', hex: '#FFD700' },
    { name: 'Lemon', hex: '#FFF44F' }, { name: 'Cream', hex: '#FFFDD0' },
    { name: 'Green', hex: '#008000' }, { name: 'Lime', hex: '#00FF00' },
    { name: 'Mint', hex: '#98FF98' }, { name: 'Emerald', hex: '#50C878' },
    { name: 'Teal', hex: '#008080' }, { name: 'Olive', hex: '#808000' },
    { name: 'Forest', hex: '#228B22' }, { name: 'Blue', hex: '#0000FF' },
    { name: 'Sky Blue', hex: '#87CEEB' }, { name: 'Navy', hex: '#000080' },
    { name: 'Turquoise', hex: '#40E0D0' }, { name: 'Cyan', hex: '#00FFFF' },
    { name: 'Azure', hex: '#007FFF' }, { name: 'Purple', hex: '#800080' },
    { name: 'Violet', hex: '#8F00FF' }, { name: 'Lavender', hex: '#E6E6FA' },
    { name: 'Magenta', hex: '#FF00FF' }, { name: 'Plum', hex: '#DDA0DD' },
    { name: 'Brown', hex: '#A52A2A' }, { name: 'Tan', hex: '#D2B48C' },
    { name: 'Beige', hex: '#F5F5DC' }, { name: 'Chocolate', hex: '#D2691E' },
    { name: 'Black', hex: '#000000' }, { name: 'Gray', hex: '#808080' },
    { name: 'Silver', hex: '#C0C0C0' }, { name: 'White', hex: '#FFFFFF' },
];

const colorDistance = (hex1: string, hex2: string): number => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    if (!rgb1 || !rgb2) return Infinity;

    const rDiff = rgb1.r - rgb2.r;
    const gDiff = rgb1.g - rgb2.g;
    const bDiff = rgb1.b - rgb2.b;

    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
};

export const getColorName = (hex: string): string => {
    let closestColor = COLOR_NAMES[0];
    let minDistance = Infinity;

    for (const namedColor of COLOR_NAMES) {
        const distance = colorDistance(hex, namedColor.hex);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = namedColor;
        }
    }

    const hsl = hexToHsl(hex);
    if (hsl) {
        if (hsl.l > 90) return `Very Light ${closestColor.name}`;
        if (hsl.l > 70) return `Light ${closestColor.name}`;
        if (hsl.l < 20) return `Very Dark ${closestColor.name}`;
        if (hsl.l < 40) return `Dark ${closestColor.name}`;
    }

    return closestColor.name;
};

export const getColorFamily = (hex: string): string => {
    const hsl = hexToHsl(hex);
    if (!hsl) return 'Unknown';

    if (hsl.s < 10) {
        if (hsl.l > 90) return 'White';
        if (hsl.l < 10) return 'Black';
        return 'Gray';
    }

    const h = hsl.h;
    if (h < 15 || h >= 345) return 'Red';
    if (h < 45) return 'Orange';
    if (h < 70) return 'Yellow';
    if (h < 150) return 'Green';
    if (h < 200) return 'Cyan';
    if (h < 260) return 'Blue';
    if (h < 290) return 'Purple';
    if (h < 345) return 'Pink';

    return 'Unknown';
};

// ============= SIMILAR COLOR FINDER =============

export const findSimilarColors = (
    targetColor: string,
    colorList: { hex: string; id: string }[],
    maxDistance: number = 50
): { hex: string; id: string; distance: number }[] => {
    return colorList
        .map(color => ({
            ...color,
            distance: colorDistance(targetColor, color.hex)
        }))
        .filter(color => color.distance <= maxDistance && color.hex !== targetColor)
        .sort((a, b) => a.distance - b.distance);
};
