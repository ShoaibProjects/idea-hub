import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { toggleMenu } from './Redux-slices/hamSlice/hamSlice';
import Navbar from './components/navbar/navbar';
import LeftAside from './components/left-aside/leftAside';
import Menu from './components/navbar/menu/menu';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const sharedState = useSelector((state: RootState) => state.ham.sharedState);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (sharedState) {
            const timer = setTimeout(() => {
                dispatch(toggleMenu());
            }, 1);
            return () => clearTimeout(timer);
        }
    }, []);

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
