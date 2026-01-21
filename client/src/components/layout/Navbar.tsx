import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, User, BookOpen, LayoutDashboard, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import './Navbar.css';

export function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { id: '/dashboard', label: 'Questions', icon: BookOpen },
        { id: '/my-solutions', label: 'My Solutions', icon: LayoutDashboard }
    ];

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
            <nav className="relative flex items-center justify-between px-2 py-2 rounded-full border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-black/50">

                {/* LEFT: BRAND */}
                <Link to="/" className="flex items-center gap-3 pl-4 pr-8 group">
                    {/* Emerald Circle + Black Sparkle */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all">
                        <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" strokeWidth={3} />
                    </div>
                    <span className="text-white font-bold tracking-tight text-lg">
                        SysDesign Hub
                    </span>
                </Link>

                {/* CENTER: NAVIGATION (Sliding Pill Effect) */}
                <div className="flex items-center bg-slate-950/50 rounded-full p-1 border border-white/5">
                    {navItems.map((item) => (
                        <Link
                            key={item.id}
                            to={item.id}
                            className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors z-10 flex items-center gap-2"
                        >
                            {/* The Sliding Background */}
                            {isActive(item.id) && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-slate-800 rounded-full border border-white/10 shadow-sm"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            {/* Icon & Text */}
                            <item.icon className={`w-4 h-4 relative z-20 transition-colors ${isActive(item.id) ? "text-emerald-400" : "text-slate-400"}`} />
                            <span className={`relative z-20 transition-colors ${isActive(item.id) ? "text-white" : "text-slate-400 hover:text-slate-200"}`}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* RIGHT: USER PROFILE */}
                <div className="flex items-center gap-4 pl-8 pr-2">

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-xs font-medium text-slate-400">Welcome back</div>
                            <div className="text-sm font-bold text-white leading-none">{user?.name || 'User'}</div>
                        </div>
                        {/* Avatar with Emerald Ring */}
                        <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            <User className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-6 w-px bg-white/10 mx-1"></div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-red-400 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>

            </nav>
        </div>
    );
}
