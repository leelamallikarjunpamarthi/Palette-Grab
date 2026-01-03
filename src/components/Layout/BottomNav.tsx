import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, Palette, History, User } from 'lucide-react';
import clsx from 'clsx';

const BottomNav: React.FC = () => {
    const navItems = [
        { to: '/', icon: Camera, label: 'Camera' },
        { to: '/palettes', icon: Palette, label: 'Palettes' },
        { to: '/history', icon: History, label: 'History' },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-border pb-safe pt-1 z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            clsx(
                                "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
                                isActive ? "text-accent" : "text-muted hover:text-primary"
                            )
                        }
                    >
                        <Icon className="w-6 h-6 mb-1" />
                        <span className="text-xs">{label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
