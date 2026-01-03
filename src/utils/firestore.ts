// Firestore helper functions for data persistence
import { db, auth } from '../config/firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import type { Palette, ColorRecord } from '../types';

// Collection references
const PALETTES_COLLECTION = 'palettes';
const COLORS_COLLECTION = 'colors';

// Get current user ID (anonymous or authenticated)
const getUserId = (): string => {
    return auth.currentUser?.uid || 'anonymous';
};

// ===== PALETTE OPERATIONS =====

export const savePaletteToFirestore = async (palette: Omit<Palette, 'id'>): Promise<string> => {
    try {
        const userId = getUserId();
        const docRef = await addDoc(collection(db, PALETTES_COLLECTION), {
            ...palette,
            userId,
            createdAt: Timestamp.fromMillis(palette.createdAt),
            updatedAt: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error saving palette to Firestore:', error);
        throw error;
    }
};

export const loadPalettesFromFirestore = async (): Promise<Palette[]> => {
    try {
        const userId = getUserId();
        const q = query(
            collection(db, PALETTES_COLLECTION),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                colors: data.colors || [],
                createdAt: data.createdAt?.toMillis() || Date.now()
            };
        });
    } catch (error) {
        console.error('Error loading palettes from Firestore:', error);
        return [];
    }
};

export const updatePaletteInFirestore = async (paletteId: string, updates: Partial<Palette>): Promise<void> => {
    try {
        const paletteRef = doc(db, PALETTES_COLLECTION, paletteId);
        await updateDoc(paletteRef, {
            ...updates,
            updatedAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Error updating palette in Firestore:', error);
        throw error;
    }
};

export const deletePaletteFromFirestore = async (paletteId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, PALETTES_COLLECTION, paletteId));
    } catch (error) {
        console.error('Error deleting palette from Firestore:', error);
        throw error;
    }
};

// ===== COLOR HISTORY OPERATIONS =====

export const saveColorToFirestore = async (color: Omit<ColorRecord, 'id'>): Promise<string> => {
    try {
        const userId = getUserId();
        const docRef = await addDoc(collection(db, COLORS_COLLECTION), {
            ...color,
            userId,
            timestamp: Timestamp.fromMillis(color.timestamp)
        });
        return docRef.id;
    } catch (error) {
        console.error('Error saving color to Firestore:', error);
        throw error;
    }
};

export const loadColorsFromFirestore = async (): Promise<ColorRecord[]> => {
    try {
        const userId = getUserId();
        const q = query(
            collection(db, COLORS_COLLECTION),
            where('userId', '==', userId),
            orderBy('timestamp', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                hex: data.hex,
                timestamp: data.timestamp?.toMillis() || Date.now(),
                note: data.note
            };
        });
    } catch (error) {
        console.error('Error loading colors from Firestore:', error);
        return [];
    }
};

export const clearColorsInFirestore = async (): Promise<void> => {
    try {
        const userId = getUserId();
        const q = query(
            collection(db, COLORS_COLLECTION),
            where('userId', '==', userId)
        );

        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error('Error clearing colors in Firestore:', error);
        throw error;
    }
};
