import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Excalidraw, exportToBlob } from '@excalidraw/excalidraw';
import { questionAPI, solutionAPI } from '../../lib/api';
import type { Question, Solution } from '../../types';
import {
    ArrowLeft,
    Save,
    Play,
    Loader2,
    CheckCircle,
    AlertCircle,
    Lightbulb,
    Target,
    Info,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import './SolvePage.css';

const solvePageUIOptions = {
    canvasActions: {
        saveToActiveFile: false,
        loadScene: false,
    }
};

export function SolvePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [question, setQuestion] = useState<Question | null>(null);
    const [solution, setSolution] = useState<Solution | null>(null);
    const [initialExcalidrawData, setInitialExcalidrawData] = useState<any>(null);

    // Use Ref for frequently updating data to avoid re-renders
    const currentExcalidrawDataRef = useRef<any>(null);
    const [hasData, setHasData] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [showHints, setShowHints] = useState(false);
    const [showRequirements, setShowRequirements] = useState(true);
    const [showEvaluation, setShowEvaluation] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

    useEffect(() => {
        if (id) {
            fetchQuestion();
            fetchExistingSolution();
        }
    }, [id]);

    const fetchQuestion = async () => {
        try {
            const response = await questionAPI.getById(id!);
            setQuestion(response.data);
        } catch (error) {
            console.error('Failed to fetch question:', error);
            navigate('/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchExistingSolution = async () => {
        try {
            const response = await solutionAPI.getByQuestion(id!);
            if (response.data.length > 0) {
                const existingSolution = response.data[0];
                setSolution(existingSolution);
                setInitialExcalidrawData(existingSolution.excalidrawData);

                // Initialize ref and hasData state
                currentExcalidrawDataRef.current = existingSolution.excalidrawData;
                setHasData(true);

                if (existingSolution.status === 'evaluated') {
                    setShowEvaluation(true);
                }
            }
        } catch (error) {
            console.error('Failed to fetch existing solution:', error);
        }
    };

    const handleExcalidrawChange = useCallback((elements: any, appState: any, files: any) => {
        currentExcalidrawDataRef.current = { elements, appState, files };
        // Only trigger re-render if necessary (though React bails out efficiently)
        setHasData(true);
    }, []);

    const handleSave = async () => {
        if (!currentExcalidrawDataRef.current || !id) return;

        setIsSaving(true);
        setSaveMessage('');

        try {
            let imageData = '';
            if (excalidrawAPI) {
                try {
                    const blob = await exportToBlob({
                        elements: currentExcalidrawDataRef.current.elements,
                        appState: currentExcalidrawDataRef.current.appState,
                        files: currentExcalidrawDataRef.current.files,
                        mimeType: 'image/png',
                    });
                    imageData = await blobToBase64(blob);
                } catch (e) {
                    console.log('Could not export image:', e);
                }
            }

            if (solution) {
                const response = await solutionAPI.update(solution._id, {
                    excalidrawData: currentExcalidrawDataRef.current,
                    excalidrawImage: imageData
                });
                setSolution(response.data);
            } else {
                const response = await solutionAPI.create({
                    questionId: id,
                    excalidrawData: currentExcalidrawDataRef.current,
                    excalidrawImage: imageData
                });
                setSolution(response.data);
            }

            setSaveMessage('Saved successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error('Failed to save solution:', error);
            setSaveMessage('Failed to save');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEvaluate = async () => {
        if (!solution) {
            await handleSave();
        }

        const currentSolution = solution;
        if (!currentSolution) {
            setSaveMessage('Please save your solution first');
            return;
        }

        setIsEvaluating(true);

        try {
            const response = await solutionAPI.evaluate(currentSolution._id);
            setSolution(response.data);
            setShowEvaluation(true);
        } catch (error: any) {
            console.error('Failed to evaluate:', error);
            setSaveMessage(error.response?.data?.message || 'Evaluation failed');
        } finally {
            setIsEvaluating(false);
        }
    };

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'score-excellent';
        if (score >= 60) return 'score-good';
        if (score >= 40) return 'score-average';
        return 'score-poor';
    };

    if (isLoading) {
        return (
            <div className="solve-loading">
                <div className="spinner spinner-lg"></div>
                <p>Loading problem...</p>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="solve-error">
                <AlertCircle size={48} />
                <h2>Problem not found</h2>
                <Link to="/dashboard" className="btn btn-primary">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="solve-page">
            <div className="solve-header">
                <div className="header-left">
                    <Link to="/dashboard" className="back-btn">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="problem-info">
                        <h1 className="problem-title">{question.title}</h1>
                        <div className="problem-meta">
                            <span className={`badge badge-${question.difficulty.toLowerCase()}`}>
                                {question.difficulty}
                            </span>
                            <span className="category-label">{question.category}</span>
                        </div>
                    </div>
                </div>

                <div className="header-actions">
                    {saveMessage && (
                        <span className={`save-message ${saveMessage.includes('success') ? 'success' : 'error'}`}>
                            {saveMessage}
                        </span>
                    )}
                    <button
                        className="btn btn-secondary"
                        onClick={handleSave}
                        disabled={isSaving || !hasData}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save
                            </>
                        )}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleEvaluate}
                        disabled={isEvaluating || !hasData}
                    >
                        {isEvaluating ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Evaluating...
                            </>
                        ) : (
                            <>
                                <Play size={18} />
                                Evaluate with AI
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="solve-content">
                <aside className="solve-sidebar">
                    <div className="sidebar-section">
                        <div
                            className="section-header"
                            onClick={() => setShowRequirements(!showRequirements)}
                        >
                            <div className="section-title">
                                <Target size={18} />
                                <span>Requirements</span>
                            </div>
                            {showRequirements ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                        {showRequirements && (
                            <div className="section-content">
                                <p className="problem-description">{question.description}</p>
                                {question.requirements && question.requirements.length > 0 && (
                                    <ul className="requirements-list">
                                        {question.requirements.map((req, i) => (
                                            <li key={i}>
                                                <CheckCircle size={14} />
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    {question.hints && question.hints.length > 0 && (
                        <div className="sidebar-section">
                            <div
                                className="section-header"
                                onClick={() => setShowHints(!showHints)}
                            >
                                <div className="section-title">
                                    <Lightbulb size={18} />
                                    <span>Hints</span>
                                </div>
                                {showHints ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                            {showHints && (
                                <div className="section-content">
                                    <ul className="hints-list">
                                        {question.hints.map((hint, i) => (
                                            <li key={i}>
                                                <Info size={14} />
                                                <span>{hint}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {question.evaluationCriteria && question.evaluationCriteria.length > 0 && (
                        <div className="sidebar-section">
                            <div className="section-header">
                                <div className="section-title">
                                    <Target size={18} />
                                    <span>Evaluation Criteria</span>
                                </div>
                            </div>
                            <div className="section-content">
                                <div className="criteria-list">
                                    {question.evaluationCriteria.map((criteria, i) => (
                                        <div key={i} className="criteria-item">
                                            <div className="criteria-header">
                                                <span className="criteria-name">{criteria.name}</span>
                                                <span className="criteria-weight">{criteria.weight}%</span>
                                            </div>
                                            <p className="criteria-desc">{criteria.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </aside>

                <div className="canvas-container">
                    <Excalidraw
                        excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
                        initialData={initialExcalidrawData || undefined}
                        onChange={handleExcalidrawChange}
                        theme="dark"
                        UIOptions={solvePageUIOptions}
                    />
                </div>

                {showEvaluation && solution?.evaluation && (
                    <aside className="evaluation-panel animate-slideUp">
                        <div className="evaluation-header">
                            <h3>AI Evaluation Results</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowEvaluation(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="score-display">
                            <div className={`score-circle ${getScoreColor(solution.evaluation.score)}`}>
                                <span className="score-value">{solution.evaluation.score}</span>
                                <span className="score-label">/ 100</span>
                            </div>
                        </div>

                        <div className="evaluation-section">
                            <h4>Feedback</h4>
                            <p>{solution.evaluation.feedback}</p>
                        </div>

                        {solution.evaluation.strengths && solution.evaluation.strengths.length > 0 && (
                            <div className="evaluation-section">
                                <h4 className="success-title">
                                    <CheckCircle size={16} />
                                    Strengths
                                </h4>
                                <ul className="feedback-list success">
                                    {solution.evaluation.strengths.map((strength, i) => (
                                        <li key={i}>{strength}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {solution.evaluation.improvements && solution.evaluation.improvements.length > 0 && (
                            <div className="evaluation-section">
                                <h4 className="warning-title">
                                    <AlertCircle size={16} />
                                    Areas for Improvement
                                </h4>
                                <ul className="feedback-list warning">
                                    {solution.evaluation.improvements.map((improvement, i) => (
                                        <li key={i}>{improvement}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {solution.evaluation.criteriaScores && solution.evaluation.criteriaScores.length > 0 && (
                            <div className="evaluation-section">
                                <h4>Criteria Breakdown</h4>
                                <div className="criteria-scores">
                                    {solution.evaluation.criteriaScores.map((criteria, i) => (
                                        <div key={i} className="criteria-score-item">
                                            <div className="criteria-score-header">
                                                <span className="criteria-score-name">{criteria.name}</span>
                                                <span className={`criteria-score-value ${getScoreColor(criteria.score)}`}>
                                                    {criteria.score}/100
                                                </span>
                                            </div>
                                            <div className="criteria-score-bar">
                                                <div
                                                    className="criteria-score-fill"
                                                    style={{ width: `${criteria.score}%` }}
                                                ></div>
                                            </div>
                                            <p className="criteria-score-feedback">{criteria.feedback}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                )}
            </div>
        </div>
    );
}
