import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { solutionAPI } from '../../lib/api';
import type { Solution, Question } from '../../types';
import {
    FileCode,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2,
    ArrowRight,
    Trash2,
    RotateCcw,
    Search,
    Filter,
    X,
    Target,
    TrendingUp,
    Zap
} from 'lucide-react';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import AuroraBackground from '../../components/AuroraBackground/AuroraBackground';
import './MySolutions.css';

export function MySolutionsPage() {
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchSolutions();
    }, []);

    const fetchSolutions = async () => {
        try {
            setIsLoading(true);
            const response = await solutionAPI.getAll();
            setSolutions(response.data);
        } catch (error) {
            console.error('Failed to fetch solutions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (solutionId: string) => {
        if (!confirm('Are you sure you want to delete this solution? This action cannot be undone.')) return;

        try {
            await solutionAPI.delete(solutionId);
            setSolutions(prev => prev.filter(s => s._id !== solutionId));
        } catch (error: any) {
            console.error('Failed to delete solution:', error);
            alert(`Failed to delete solution: ${error.response?.data?.message || error.message}`);
        }
    };

    const filteredSolutions = solutions.filter(solution => {
        const question = solution.question as Question;
        if (!question) return false;

        const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            question.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || solution.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'evaluated':
                return <CheckCircle size={16} className="text-emerald-400" />;
            case 'evaluating':
                return <Loader2 size={16} className="text-blue-400 animate-spin" />;
            case 'error':
                return <AlertCircle size={16} className="text-red-400" />;
            default:
                return <Clock size={16} className="text-slate-400" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'evaluated':
                return 'Evaluated';
            case 'evaluating':
                return 'Evaluating...';
            case 'error':
                return 'Error';
            default:
                return 'Pending';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const stats = {
        total: solutions.length,
        evaluated: solutions.filter(s => s.status === 'evaluated').length,
        passed: solutions.filter(s => s.status === 'evaluated' && s.evaluation?.score && s.evaluation.score >= 70).length
    };

    return (
        <div className="min-h-screen bg-[#020617] relative overflow-hidden pt-24">
            {/* Aurora Background */}
            <AuroraBackground />

            {/* Animated Grid Background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                {/* Header Section with BlurText */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 animate-[blur-in_0.8s_ease-out]">
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
                            My Solutions
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400">Review your submitted architectures and AI evaluations</p>
                </div>

                {/* Stats Row - Spotlight Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <SpotlightCard className="p-6">
                        <div className="flex flex-col items-center justify-center h-24">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <Target className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-4xl font-bold text-white">{stats.total}</span>
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Submissions</span>
                        </div>
                    </SpotlightCard>

                    <SpotlightCard className="p-6">
                        <div className="flex flex-col items-center justify-center h-24">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-blue-400" />
                                </div>
                                <span className="text-4xl font-bold text-white">{stats.evaluated}</span>
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Evaluated</span>
                        </div>
                    </SpotlightCard>

                    <SpotlightCard className="p-6">
                        <div className="flex flex-col items-center justify-center h-24">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <Zap className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-4xl font-bold text-emerald-400">{stats.passed}</span>
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Passed</span>
                        </div>
                    </SpotlightCard>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by title or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-10 text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 backdrop-blur-sm"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:border-emerald-500/30 transition-all backdrop-blur-sm">
                        <Filter className="w-4 h-4" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer"
                        >
                            <option value="all" className="bg-slate-900">All Status</option>
                            <option value="pending" className="bg-slate-900">Pending</option>
                            <option value="evaluating" className="bg-slate-900">Evaluating</option>
                            <option value="evaluated" className="bg-slate-900">Evaluated</option>
                            <option value="error" className="bg-slate-900">Error</option>
                        </select>
                    </button>
                </div>

                {/* Content Area */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                        <p className="text-slate-400">Loading your solutions...</p>
                    </div>
                ) : filteredSolutions.length === 0 ? (
                    /* Empty State - Glass Panel */
                    <div className="w-full min-h-96 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 relative overflow-hidden group">
                        {/* Subtle glow behind the icon */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-500/20 transition-all duration-700"></div>

                        <div className="relative bg-slate-800/50 p-6 rounded-2xl border border-white/5 mb-6 group-hover:scale-105 transition-transform duration-500">
                            <FileCode className="w-12 h-12 text-slate-500 group-hover:text-emerald-400 transition-colors duration-300" />
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-2">
                            {solutions.length === 0 ? "No Solutions Yet" : "No matching solutions found"}
                        </h3>
                        <p className="text-slate-400 max-w-sm mb-8">
                            {solutions.length === 0
                                ? "You haven't submitted any system designs. Start a practice session to see your AI feedback here."
                                : "Try adjusting your search or filters"}
                        </p>

                        {/* THE MINT ACTION BUTTON */}
                        {solutions.length === 0 ? (
                            <Link
                                to="/dashboard"
                                className="group flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5"
                            >
                                <span>Browse Problems</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ) : (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                }}
                                className="group flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    /* Solutions List */
                    <div className="space-y-4">
                        {filteredSolutions.map((solution, index) => {
                            const question = solution.question as Question;
                            if (!question) return null;

                            return (
                                <SpotlightCard
                                    key={solution._id}
                                    className="p-6 animate-fadeIn hover:-translate-y-0.5 transition-transform duration-300"
                                    style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{question.title}</h3>
                                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${question.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                                    question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                                        'bg-red-500/20 text-red-400 border-red-500/30'
                                                    }`}>
                                                    {question.difficulty}
                                                </span>
                                                <span className="text-slate-600">•</span>
                                                <span>{question.category}</span>
                                                <span className="text-slate-600">•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {formatDate(solution.submittedAt)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${solution.status === 'evaluated' ? 'bg-emerald-500/10 border-emerald-500/30' :
                                                solution.status === 'evaluating' ? 'bg-blue-500/10 border-blue-500/30' :
                                                    solution.status === 'error' ? 'bg-red-500/10 border-red-500/30' :
                                                        'bg-slate-800/50 border-white/10'
                                                }`}>
                                                {getStatusIcon(solution.status)}
                                                <span className="text-sm font-medium text-white">{getStatusLabel(solution.status)}</span>
                                            </div>

                                            {solution.status === 'evaluated' && solution.evaluation && (
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-3xl font-bold ${getScoreColor(solution.evaluation.score)}`}>
                                                        {solution.evaluation.score}
                                                    </span>
                                                    <span className="text-slate-500 text-sm">/ 100</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {solution.status === 'evaluated' && solution.evaluation && (
                                        <div className="mb-4 p-4 bg-slate-800/30 rounded-lg border border-white/5">
                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                {solution.evaluation.feedback?.substring(0, 200)}
                                                {(solution.evaluation.feedback?.length || 0) > 200 ? '...' : ''}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                        <Link
                                            to={`/solve/${typeof question === 'string' ? question : question._id}`}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-lg transition-all border border-white/10 hover:border-emerald-500/50"
                                        >
                                            <RotateCcw size={16} />
                                            Continue
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(solution._id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/30 hover:border-red-500/50"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </SpotlightCard>
                            );
                        })}
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
            `}</style>
        </div>
    );
}
