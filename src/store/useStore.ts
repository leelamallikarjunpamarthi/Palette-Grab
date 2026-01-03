import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, ColorRecord } from '../types';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            palettes: [],
            history: [],
            settings: {
                defaultFormat: 'hex',
                theme: 'dark',
            },

            addColorToHistory: async (hex: string, imageUrl?: string) => {
                const newColor: ColorRecord = {
                    id: generateId(),
                    hex,
                    timestamp: Date.now(),
                    imageUrl
                };

                // Add to local state immediately
                set((state) => ({ history: [newColor, ...state.history] }));
            },

            createPalette: async (name) => {
                const newPalette = {
                    id: generateId(),
                    name,
                    colors: [],
                    createdAt: Date.now()
                };

                // Add to local state immediately
                set((state) => ({ palettes: [...state.palettes, newPalette] }));
            },

            deletePalette: async (id) => {
                // Remove from local state immediately
                set((state) => ({
                    palettes: state.palettes.filter(p => p.id !== id)
                }));
            },

            duplicatePalette: async (id) => {
                set((state) => {
                    const original = state.palettes.find(p => p.id === id);
                    if (!original) return state;

                    const duplicate = {
                        ...original,
                        id: generateId(),
                        name: `${original.name} (Copy)`,
                        createdAt: Date.now()
                    };

                    return { palettes: [...state.palettes, duplicate] };
                });
            },

            addColorToPalette: async (paletteId, color) => {
                // Update local state immediately
                set((state) => ({
                    palettes: state.palettes.map(p => {
                        if (p.id === paletteId) {
                            return { ...p, colors: [...p.colors, color] };
                        }
                        return p;
                    })
                }));
            },

            removeColorFromPalette: async (paletteId, colorId) => {
                // Update local state immediately
                set((state) => ({
                    palettes: state.palettes.map(p => {
                        if (p.id === paletteId) {
                            return { ...p, colors: p.colors.filter(c => c.id !== colorId) };
                        }
                        return p;
                    })
                }));
            },

            clearHistory: async () => {
                // Clear local state immediately
                set({ history: [] });
            },
        }),
        {
            name: 'palette-grab-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

