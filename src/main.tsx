import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// Initialize Firebase and sync data
// const initializeApp = async () => {
//   try {
//     // Initialize anonymous authentication
//     // await initializeAuth();

//     // Sync data from Firestore
//     // await syncFromFirestore();

//     console.log('App initialized (Local Mode)');
//   } catch (error) {
//     console.error('Failed to initialize app:', error);
//   }
// };

// Start initialization
// initializeApp();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
