import React, { useState } from 'react';
import { User, Settings as SettingsIcon, HelpCircle, LogOut, Download, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useStore } from '../store/useStore';

const Profile: React.FC = () => {
    const [showSettings, setShowSettings] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [profileEmail, setProfileEmail] = useState('');


    const settings = useStore((state) => state.settings);
    const palettes = useStore((state) => state.palettes);
    const history = useStore((state) => state.history);
    const clearHistory = useStore((state) => state.clearHistory);

    // Load profile data
    React.useEffect(() => {
        const savedName = localStorage.getItem('profileName') || '';
        const savedEmail = localStorage.getItem('profileEmail') || '';
        setProfileName(savedName);
        setProfileEmail(savedEmail);
    }, []);

    const handleSaveProfile = () => {
        localStorage.setItem('profileName', profileName);
        localStorage.setItem('profileEmail', profileEmail);
        setShowEditProfile(false);
    };

    const handleSignOut = async () => {
        if (confirm('Sign out? Your data will remain saved in the cloud.')) {
            try {
                await signOut(auth);
                // Clear local storage
                localStorage.clear();
                // Reload app
                window.location.reload();
            } catch (error) {
                console.error('Sign out error:', error);
                alert('Failed to sign out. Please try again.');
            }
        }
    };

    const handleExportData = () => {
        const data = {
            palettes,
            history,
            settings,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `palette-grab-export-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleClearAllData = async () => {
        if (confirm('Delete ALL data? This cannot be undone!\n\nThis will delete:\n- All palettes\n- All color history\n- All settings')) {
            try {
                await clearHistory();
                // Also clear palettes
                const deletePalette = useStore.getState().deletePalette;
                for (const palette of palettes) {
                    await deletePalette(palette.id);
                }
                alert('All data cleared successfully');
            } catch (error) {
                console.error('Clear data error:', error);
                alert('Failed to clear some data. Please try again.');
            }
        }
    };

    const menuItems = [
        {
            icon: SettingsIcon,
            label: 'Settings',
            action: () => setShowSettings(true)
        },
        {
            icon: HelpCircle,
            label: 'Help & Support',
            action: () => setShowHelp(true)
        },
        {
            icon: Download,
            label: 'Export Data',
            action: handleExportData
        },
        {
            icon: Trash2,
            label: 'Clear All Data',
            action: handleClearAllData,
            danger: true
        },
        {
            icon: LogOut,
            label: 'Sign Out',
            action: handleSignOut,
            danger: true
        },
    ];

    return (
        <div className="min-h-full p-4 pb-24 bg-secondary">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Profile</h1>
                <p className="text-muted">Manage your account and preferences</p>
            </div>

            {/* Profile Card */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-xl mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20">
                        <User className="w-10 h-10 text-accent" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-primary">
                            {profileName || auth.currentUser?.email || 'Guest User'}
                        </h2>
                        <p className="text-sm text-muted font-medium">
                            {profileEmail || (auth.currentUser?.isAnonymous ? 'Anonymous Account' : auth.currentUser?.email || 'guest@palettegrab.app')}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowEditProfile(true)}
                        className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl hover:opacity-90 transition-all font-bold shadow-md active:scale-[0.98]"
                    >
                        Edit Profile
                    </button>

                    {auth.currentUser?.isAnonymous && (
                        <button
                            onClick={() => alert('Email authentication coming soon!\n\nFor now, your data is saved locally and synced anonymously.')}
                            className="flex-1 px-4 py-2.5 bg-accent text-white rounded-xl hover:opacity-90 transition-all font-bold shadow-md active:scale-[0.98]"
                        >
                            Upgrade Account
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface border border-border rounded-2xl p-5 text-center shadow-sm">
                    <div className="text-2xl font-bold text-accent">{palettes.length}</div>
                    <div className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Palettes</div>
                </div>
                <div className="bg-surface border border-border rounded-2xl p-5 text-center shadow-sm">
                    <div className="text-2xl font-bold text-accent">{history.length}</div>
                    <div className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Colors</div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.label}
                            onClick={item.action}
                            className={`w-full flex items-center justify-between p-4 bg-surface border border-border rounded-2xl hover:bg-secondary transition-all shadow-sm group active:scale-[0.99] ${item.danger ? 'text-red-500' : 'text-primary'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${item.danger ? 'bg-red-50' : 'bg-secondary'}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="font-bold">{item.label}</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    );
                })}
            </div>

            {/* App Info */}
            <div className="mt-8 text-center text-sm text-muted font-medium">
                <p>Palette Grab v1.0.0</p>
                <p className="mt-1">Made with ❤️ for designers</p>
            </div>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowSettings(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-surface border border-border rounded-3xl p-8 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold mb-6">Settings</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">Default Color Format</label>
                                    <select className="w-full bg-secondary border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium">
                                        <option value="hex">HEX (#RRGGBB)</option>
                                        <option value="rgb">RGB (r, g, b)</option>
                                        <option value="hsl">HSL (h, s%, l%)</option>
                                        <option value="cmyk">CMYK (c%, m%, y%, k%)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">Theme</label>
                                    <select className="w-full bg-secondary border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium">
                                        <option value="light">Light</option>
                                        <option value="dark">Dark (Coming Soon)</option>
                                    </select>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="w-full px-4 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition-all font-bold shadow-md shadow-primary/20"
                                    >
                                        Save Settings
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Help Modal */}
            <AnimatePresence>
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowHelp(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-surface border border-border rounded-3xl p-8 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold mb-6">Help & Support</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold mb-2">How to Use</h3>
                                    <ul className="text-sm text-muted font-medium space-y-3">
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                            Point your camera at any color
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                            Tap the capture button to save
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                            Organize colors into palettes
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                            View color details and harmonies
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold mb-2">Camera Not Working?</h3>
                                    <p className="text-sm text-muted font-medium">
                                        Make sure you've granted camera permissions in your browser settings.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold mb-2">Data Sync</h3>
                                    <p className="text-sm text-muted font-medium">
                                        Your data is automatically saved to Firebase and synced across sessions.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold mb-2">Contact Support</h3>
                                    <p className="text-sm text-muted font-medium">
                                        For issues or feedback, please contact:<br />
                                        <a href="mailto:support@palettegrab.app" className="text-accent hover:underline font-bold">
                                            support@palettegrab.app
                                        </a>
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={() => setShowHelp(false)}
                                        className="w-full px-4 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition-all font-bold shadow-md shadow-primary/20"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {showEditProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowEditProfile(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-surface border border-border rounded-3xl p-8 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Display Name</label>
                                    <input
                                        type="text"
                                        value={profileName}
                                        onChange={(e) => setProfileName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full bg-secondary border border-border rounded-xl p-3 focus:outline-none focus:border-accent transition-colors font-medium shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileEmail}
                                        onChange={(e) => setProfileEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full bg-secondary border border-border rounded-xl p-3 focus:outline-none focus:border-accent transition-colors font-medium shadow-sm"
                                    />
                                    <p className="text-[10px] text-muted font-bold mt-2 uppercase tracking-wide">
                                        This is for display only. Use Upgrade Account for cloud sync.
                                    </p>
                                </div>

                                <div className="flex gap-2 pt-6">
                                    <button
                                        onClick={() => setShowEditProfile(false)}
                                        className="flex-1 px-4 py-3 bg-secondary border border-border rounded-xl hover:bg-gray-100 transition-all font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition-all font-bold shadow-md shadow-primary/20"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
