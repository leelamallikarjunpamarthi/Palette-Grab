export interface ColorRecord {
    id: string;
    hex: string;
    timestamp: number;
    imageUrl?: string;
    note?: string;
}

export interface Palette {
    id: string;
    name: string;
    colors: ColorRecord[]; // Or just IDs if normalized, but nesting is easier for local
    createdAt: number;
}

export interface UserSettings {
    defaultFormat: 'hex' | 'rgb' | 'hsl';
    theme: 'dark' | 'light';
}

export interface AppState {
    palettes: Palette[];
    history: ColorRecord[];
    settings: UserSettings;

    // Actions
    addColorToHistory: (hex: string, imageUrl?: string) => void;
    createPalette: (name: string) => void;
    deletePalette: (id: string) => void;
    duplicatePalette: (id: string) => void;
    addColorToPalette: (paletteId: string, color: ColorRecord) => void;
    removeColorFromPalette: (paletteId: string, colorId: string) => void;
    clearHistory: () => void;
}
