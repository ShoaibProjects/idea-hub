import React from 'react';
import Navbar from './components/navbar/navbar';
import LeftAside from './components/left-aside/leftAside';
import Menu from './components/navbar/menu/menu';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <div>
                <Navbar />
                <main>
                    <LeftAside />
                    <Menu />
                    {children}
                </main>
            </div>
        </>
    );
};

export default MainLayout;
