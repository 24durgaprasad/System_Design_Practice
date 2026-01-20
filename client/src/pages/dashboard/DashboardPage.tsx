import { useState, useEffect } from 'react';
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
    Shield
} from 'lucide-react';
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

const categories = [
    'All',
    'Scalability',
    'Database Design',
    'Caching',
    'Load Balancing',
    'Microservices',
    'API Design',
    'Message Queues',
    'CDN',
    'Real-time Systems'
];

const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

export function DashboardPage() {
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

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;

        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    const getDifficultyClass = (difficulty: string) => {
        return `badge badge-${difficulty.toLowerCase()}`;
    };

    const easyCount = filteredQuestions.filter(q => q.difficulty === 'Easy').length;
    const mediumCount = filteredQuestions.filter(q => q.difficulty === 'Medium').length;
    const hardCount = filteredQuestions.filter(q => q.difficulty === 'Hard').length;

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1 className="page-title">
                        <span className="gradient-text">System Design</span> Problems
                    </h1>
                    <p className="page-subtitle">
                        Practice solving real-world system design challenges with AI-powered feedback
                    </p>
                </div>

                <div className="header-stats">
                    <div className="stat-card">
                        <span className="stat-value">{filteredQuestions.length}</span>
                        <span className="stat-label">Problems Shown</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{easyCount}</span>
                        <span className="stat-label">Easy</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{mediumCount}</span>
                        <span className="stat-label">Medium</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{hardCount}</span>
                        <span className="stat-label">Hard</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-filters">
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search problems..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <button
                    className="btn btn-secondary filter-toggle"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter size={18} />
                    Filters
                    {(selectedCategory !== 'All' || selectedDifficulty !== 'All') && (
                        <span className="filter-badge">
                            {(selectedCategory !== 'All' ? 1 : 0) + (selectedDifficulty !== 'All' ? 1 : 0)}
                        </span>
                    )}
                </button>
            </div>

            {showFilters && (
                <div className="filters-panel animate-slideDown">
                    <div className="filter-group">
                        <label className="filter-label">Category</label>
                        <div className="filter-options">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Difficulty</label>
                        <div className="filter-options">
                            {difficulties.map(diff => (
                                <button
                                    key={diff}
                                    className={`filter-chip ${selectedDifficulty === diff ? 'active' : ''} ${diff !== 'All' ? `chip-${diff.toLowerCase()}` : ''}`}
                                    onClick={() => setSelectedDifficulty(diff)}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="questions-grid">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="question-card skeleton-card">
                            <div className="skeleton skeleton-title"></div>
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text short"></div>
                            <div className="skeleton skeleton-badge"></div>
                        </div>
                    ))}
                </div>
            ) : filteredQuestions.length === 0 ? (
                <div className="empty-state">
                    <BookOpen size={48} className="empty-icon" />
                    <h3>No Problems Found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="questions-grid">
                    {filteredQuestions.map((question, index) => (
                        <Link
                            to={`/solve/${question._id}`}
                            key={question._id}
                            className="question-card animate-fadeIn"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="card-header">
                                <div className="category-icon">
                                    {categoryIcons[question.category] || <BookOpen size={20} />}
                                </div>
                                <span className={getDifficultyClass(question.difficulty)}>
                                    {question.difficulty}
                                </span>
                            </div>

                            <h3 className="card-title">{question.title}</h3>

                            <p className="card-description">
                                {question.description.length > 150
                                    ? question.description.substring(0, 150) + '...'
                                    : question.description}
                            </p>

                            <div className="card-footer">
                                <span className="category-tag">{question.category}</span>
                                <span className="solve-cta">
                                    Solve Now <ArrowRight size={16} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
