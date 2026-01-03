import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout: React.FC = () => {
    return (
        <div className="flex flex-col h-screen text-primary overflow-hidden bg-secondary">
            <main className="flex-1 overflow-y-auto pb-20 relative">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
};

export default Layout;
