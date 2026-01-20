import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, User, BookOpen, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

export function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    <div className="brand-icon">
                        <LayoutDashboard size={24} />
                    </div>
                    <span className="brand-text">
                        <span className="gradient-text">System Design</span>
                        <span className="brand-subtitle">Practice LMS</span>
                    </span>
                </Link>

                <div className="navbar-menu">
                    <Link to="/dashboard" className="nav-link">
                        <BookOpen size={18} />
                        <span>Questions</span>
                    </Link>
                    <Link to="/my-solutions" className="nav-link">
                        <LayoutDashboard size={18} />
                        <span>My Solutions</span>
                    </Link>
                </div>

                <div className="navbar-user">
                    <div className="user-info">
                        <div className="user-avatar">
                            <User size={18} />
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-role">{user?.role}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn-logout" title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
