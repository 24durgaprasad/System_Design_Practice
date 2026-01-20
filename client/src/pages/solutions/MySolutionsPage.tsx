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
    X
} from 'lucide-react';
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
                return <CheckCircle size={16} className="status-icon success" />;
            case 'evaluating':
                return <Loader2 size={16} className="status-icon loading animate-spin" />;
            case 'error':
                return <AlertCircle size={16} className="status-icon error" />;
            default:
                return <Clock size={16} className="status-icon pending" />;
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
        if (score >= 80) return 'score-excellent';
        if (score >= 60) return 'score-good';
        if (score >= 40) return 'score-average';
        return 'score-poor';
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

    return (
        <div className="my-solutions-page">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">
                        <span className="gradient-text">My Solutions</span>
                    </h1>
                    <p className="page-subtitle">
                        Review your submitted solutions and AI evaluations
                    </p>
                </div>

                <div className="header-stats">
                    <div className="stat-card">
                        <span className="stat-value">{solutions.length}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">
                            {solutions.filter(s => s.status === 'evaluated').length}
                        </span>
                        <span className="stat-label">Evaluated</span>
                    </div>
                    <div className="stat-card leading-card">
                        <span className="stat-value">
                            {solutions.filter(s => s.status === 'evaluated' && s.evaluation?.score && s.evaluation.score >= 70).length}
                        </span>
                        <span className="stat-label">Passed</span>
                    </div>
                </div>
            </div>

            <div className="solutions-filter-bar">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button
                            className="clear-search-btn"
                            onClick={() => setSearchTerm('')}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="filter-group">
                    <Filter size={20} className="filter-icon" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="status-filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="evaluating">Evaluating</option>
                        <option value="evaluated">Evaluated</option>
                        <option value="error">Error</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="solutions-loading">
                    <div className="spinner spinner-lg"></div>
                    <p>Loading your solutions...</p>
                </div>
            ) : filteredSolutions.length === 0 ? (
                <div className="empty-state">
                    <FileCode size={64} className="empty-icon" />
                    <h3>
                        {solutions.length === 0
                            ? "No Solutions Yet"
                            : "No matching solutions found"}
                    </h3>
                    <p>
                        {solutions.length === 0
                            ? "Start solving system design problems to see your solutions here"
                            : "Try adjusting your search or filters"}
                    </p>
                    {solutions.length === 0 && (
                        <Link to="/dashboard" className="btn btn-primary">
                            Browse Problems
                            <ArrowRight size={18} />
                        </Link>
                    )}
                    {solutions.length > 0 && (
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                            }}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="solutions-list">
                    {filteredSolutions.map((solution, index) => {
                        const question = solution.question as Question;
                        if (!question) return null;

                        return (
                            <div
                                key={solution._id}
                                className="solution-card animate-fadeIn"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="solution-main">
                                    <div className="solution-info">
                                        <h3 className="solution-title">{question.title}</h3>
                                        <div className="solution-meta">
                                            <span className={`badge badge-${question.difficulty?.toLowerCase() || 'medium'}`}>
                                                {question.difficulty || 'Medium'}
                                            </span>
                                            <span className="meta-divider">•</span>
                                            <span className="meta-category">{question.category}</span>
                                            <span className="meta-divider">•</span>
                                            <span className="meta-date">
                                                <Clock size={14} />
                                                {formatDate(solution.submittedAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="solution-status-wrapper">
                                        <div className={`solution-status status-${solution.status}`}>
                                            {getStatusIcon(solution.status)}
                                            <span>{getStatusLabel(solution.status)}</span>
                                        </div>

                                        {solution.status === 'evaluated' && solution.evaluation && (
                                            <div className={`solution-score ${getScoreColor(solution.evaluation.score)}`}>
                                                <span className="score-value">{solution.evaluation.score}</span>
                                                <span className="score-label">/ 100</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {solution.status === 'evaluated' && solution.evaluation && (
                                    <div className="solution-feedback">
                                        <p className="feedback-text">
                                            {solution.evaluation.feedback?.substring(0, 200)}
                                            {(solution.evaluation.feedback?.length || 0) > 200 ? '...' : ''}
                                        </p>
                                    </div>
                                )}

                                <div className="solution-actions">
                                    <Link
                                        to={`/solve/${typeof question === 'string' ? question : question._id}`}
                                        className="btn btn-secondary"
                                    >
                                        <RotateCcw size={16} />
                                        Continue
                                    </Link>
                                    <button
                                        className="btn btn-ghost btn-danger-hover"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent accidental navigation if nested
                                            handleDelete(solution._id);
                                        }}
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
