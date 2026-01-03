// Analytics helper functions
import { analytics } from '../config/firebase';
import { logEvent } from 'firebase/analytics';

export const trackColorCapture = (hex: string) => {
    logEvent(analytics, 'color_captured', {
        color_hex: hex,
        timestamp: new Date().toISOString()
    });
};

export const trackPaletteCreated = (paletteName: string) => {
    logEvent(analytics, 'palette_created', {
        palette_name: paletteName,
        timestamp: new Date().toISOString()
    });
};

export const trackPaletteDeleted = (paletteId: string) => {
    logEvent(analytics, 'palette_deleted', {
        palette_id: paletteId,
        timestamp: new Date().toISOString()
    });
};

export const trackColorAddedToPalette = (paletteId: string, colorHex: string) => {
    logEvent(analytics, 'color_added_to_palette', {
        palette_id: paletteId,
        color_hex: colorHex,
        timestamp: new Date().toISOString()
    });
};

export const trackPageView = (pageName: string) => {
    logEvent(analytics, 'page_view', {
        page_name: pageName,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString()
    });
};

export const trackFeatureUsed = (featureName: string) => {
    logEvent(analytics, 'feature_used', {
        feature_name: featureName,
        timestamp: new Date().toISOString()
    });
};
