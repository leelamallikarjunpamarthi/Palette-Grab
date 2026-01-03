// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQtS0PPelfriNdm-AwsvoaSo-Qw_AwaPU",
    authDomain: "palette-grab.firebaseapp.com",
    projectId: "palette-grab",
    storageBucket: "palette-grab.firebasestorage.app",
    messagingSenderId: "120627733054",
    appId: "1:120627733054:web:e149e9311b22922508676f",
    measurementId: "G-MBYHTL2W4K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize anonymous authentication
let authInitialized = false;

export const initializeAuth = async (): Promise<void> => {
    if (authInitialized) return;

    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                // Sign in anonymously if no user
                try {
                    await signInAnonymously(auth);
                    console.log('Signed in anonymously');
                } catch (error) {
                    console.error('Anonymous auth failed:', error);
                }
            }
            authInitialized = true;
            resolve();
        });
    });
};

export { app, analytics, auth, db };
