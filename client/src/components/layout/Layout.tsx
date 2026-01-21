import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import './Layout.css';

export function Layout() {
    const location = useLocation();

    // Hide navbar on solve/editor pages
    const showNavbar = !location.pathname.startsWith('/solve');

    return (
        <div className="app-layout">
            {showNavbar && <Navbar />}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
