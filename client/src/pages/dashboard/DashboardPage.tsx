import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { questionAPI } from '../../lib/api';
import type { Question } from '../../types';
import {
    Search,
    Filter,
    BookOpen,
    ArrowRight,
    Server,
    Database,
    Cloud,
    Zap,
    MessageSquare,
    Globe,
    Layers,
    Shield,
    TrendingUp,
    Clock,
    Target,
    X
} from 'lucide-react';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import AuroraBackground from '../../components/AuroraBackground/AuroraBackground';
import { useAuthStore } from '../../store/authStore';
import './Dashboard.css';

const categoryIcons: Record<string, React.ReactNode> = {
    'Scalability': <Server size={20} />,
    'Database Design': <Database size={20} />,
    'Caching': <Zap size={20} />,
    'Load Balancing': <Layers size={20} />,
    'Microservices': <Cloud size={20} />,
    'API Design': <Shield size={20} />,
    'Message Queues': <MessageSquare size={20} />,
    'CDN': <Globe size={20} />,
    'Search Systems': <Search size={20} />,
    'Real-time Systems': <Zap size={20} />,
    'Other': <BookOpen size={20} />
};

const difficultyColors = {
    'Easy': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Hard': 'bg-red-500/20 text-red-400 border-red-500/30'
};

export function DashboardPage() {
    const { user } = useAuthStore();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            const response = await questionAPI.getAll();
            setQuestions(response.data);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // CRITICAL: Dynamically extract categories from actual data
    const categories = useMemo(() => {
        const uniqueCategories = new Set(questions.map(q => q.category));
        return ['All', ...Array.from(uniqueCategories).sort()];
    }, [questions]);

    const difficulties = useMemo(() => {
        const uniqueDifficulties = new Set(questions.map(q => q.difficulty));
        return ['All', ...Array.from(uniqueDifficulties)];
    }, [questions]);

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
            const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;

            return matchesSearch && matchesCategory && matchesDifficulty;
        });
    }, [questions, searchQuery, selectedCategory, selectedDifficulty]);

    const stats = useMemo(() => ({
        total: filteredQuestions.length,
        easy: filteredQuestions.filter(q => q.difficulty === 'Easy').length,
        medium: filteredQuestions.filter(q => q.difficulty === 'Medium').length,
        hard: filteredQuestions.filter(q => q.difficulty === 'Hard').length
    }), [filteredQuestions]);

    const clearFilters = () => {
        setSelectedCategory('All');
        setSelectedDifficulty('All');
        setSearchQuery('');
    };

    const hasActiveFilters = selectedCategory !== 'All' || selectedDifficulty !== 'All' || searchQuery !== '';

    return (
        <div className="min-h-screen bg-[#020617] relative overflow-hidden pt-24">
            {/* Aurora Background */}
            <AuroraBackground />

            {/* Animated Grid Background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section with BlurText Effect */}
                <div className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-2">
                        <span className="inline-block animate-[blur-in_0.8s_ease-out]">
                            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
                                Welcome back, {user?.name || 'Engineer'}
                            </span>
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400">Master system design through deliberate practice</p>
                </div>

                {/* Stats Overview - Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <SpotlightCard className="p-6">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <Target className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-3xl font-bold text-white">{stats.total}</span>
                            </div>
                            <p className="text-sm text-slate-400 font-medium">Total Problems</p>
                        </div>
                    </SpotlightCard>

                    <SpotlightCard className="p-6">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-3xl font-bold text-emerald-400">{stats.easy}</span>
                            </div>
                            <p className="text-sm text-slate-400 font-medium">Easy</p>
                        </div>
                    </SpotlightCard>

                    <SpotlightCard className="p-6">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-yellow-500/10 rounded-lg">
                                    <Clock className="w-5 h-5 text-yellow-400" />
                                </div>
                                <span className="text-3xl font-bold text-yellow-400">{stats.medium}</span>
                            </div>
                            <p className="text-sm text-slate-400 font-medium">Medium</p>
                        </div>
                    </SpotlightCard>

                    <SpotlightCard className="p-6">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <Zap className="w-5 h-5 text-red-400" />
                                </div>
                                <span className="text-3xl font-bold text-red-400">{stats.hard}</span>
                            </div>
                            <p className="text-sm text-slate-400 font-medium">Hard</p>
                        </div>
                    </SpotlightCard>
                </div>

                {/* Dynamic Category Filter Bar */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat
                                    ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-white/5 hover:border-white/10'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search and Advanced Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                placeholder="Search problems..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <button
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white hover:border-emerald-500/50 transition-all"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={18} />
                            Difficulty
                            {selectedDifficulty !== 'All' && (
                                <span className="px-2 py-0.5 bg-emerald-500 text-black text-xs rounded-full font-semibold">
                                    1
                                </span>
                            )}
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/20 transition-all"
                            >
                                <X size={18} />
                                Clear
                            </button>
                        )}
                    </div>

                    {showFilters && (
                        <SpotlightCard className="p-6 mt-4 animate-slideDown">
                            <div>
                                <label className="block text-sm font-semibold text-white mb-3">Difficulty Level</label>
                                <div className="flex flex-wrap gap-2">
                                    {difficulties.map(diff => (
                                        <button
                                            key={diff}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDifficulty === diff
                                                ? diff === 'Easy' ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]' :
                                                    diff === 'Medium' ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)]' :
                                                        diff === 'Hard' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' :
                                                            'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                                : 'bg-slate-800/50 text-slate-400 hover:text-white border border-white/5 hover:border-white/10'
                                                }`}
                                            onClick={() => setSelectedDifficulty(diff)}
                                        >
                                            {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </SpotlightCard>
                    )}
                </div>

                {/* Problems Grid - Bento Layout */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 animate-pulse">
                                <div className="h-4 bg-slate-800 rounded w-3/4 mb-4"></div>
                                <div className="h-3 bg-slate-800 rounded w-full mb-2"></div>
                                <div className="h-3 bg-slate-800 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredQuestions.length === 0 ? (
                    <div className="text-center py-16">
                        <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Problems Found</h3>
                        <p className="text-slate-400 mb-4">Try adjusting your filters or search query</p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black rounded-xl font-semibold hover:bg-emerald-400 transition-all"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredQuestions.map((question, index) => (
                            <Link
                                to={`/solve/${question._id}`}
                                key={question._id}
                                className={`block group ${index < 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <SpotlightCard className="p-6 h-full hover:-translate-y-1 transition-transform duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                                            {categoryIcons[question.category] || <BookOpen size={24} />}
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${difficultyColors[question.difficulty as keyof typeof difficultyColors]}`}>
                                            {question.difficulty}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2 tracking-tight">
                                        {question.title}
                                    </h3>

                                    <p className="text-sm text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                                        {question.description.length > 150
                                            ? question.description.substring(0, 150) + '...'
                                            : question.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-800/50 text-slate-300 rounded-lg">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                            {question.category}
                                        </span>
                                        <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 group-hover:gap-3 transition-all">
                                            Solve
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </SpotlightCard>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes blur-in {
                    0% {
                        filter: blur(10px);
                        opacity: 0;
                    }
                    100% {
                        filter: blur(0);
                        opacity: 1;
                    }
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
