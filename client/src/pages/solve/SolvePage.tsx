import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Excalidraw, exportToBlob } from '@excalidraw/excalidraw';
import { questionAPI, solutionAPI } from '../../lib/api';
import type { Question, Solution } from '../../types';
import {
    ArrowLeft,
    Save,
    Sparkles,
    Loader2,
    CheckCircle,
    AlertCircle,
    Lightbulb,
    Target,
    Info,
    ChevronDown,
    ChevronRight,
    User
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
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#020617]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading problem...</p>
                </div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617]">
                <AlertCircle size={48} className="text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-4">Problem not found</h2>
                <Link to="/dashboard" className="px-6 py-3 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-all">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#020617] text-white fixed inset-0">

            {/* UNIFIED GLASS HEADER */}
            <header className="flex-none h-16 flex items-center justify-between px-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-md z-50">

                {/* Left: Context */}
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    <div>
                        <h1 className="text-sm font-bold text-slate-200 flex items-center gap-3">
                            {question.title}
                            {/* Difficulty Badge */}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wider ${question.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                question.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}>
                                {question.difficulty.toUpperCase()}
                            </span>
                        </h1>
                        <span className="text-xs text-slate-500">{question.category} • System Design</span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
                        {saveMessage && (
                            <span className={`text-xs ${saveMessage.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>
                                {saveMessage}
                            </span>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !hasData}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Save
                        </button>
                    </div>

                    {/* THE MINT BUTTON */}
                    <button
                        onClick={handleEvaluate}
                        disabled={isEvaluating || !hasData}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {isEvaluating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Evaluating...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 fill-black" />
                                <span>Evaluate with AI</span>
                            </>
                        )}
                    </button>

                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 ml-2 flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </header>

            {/* MAIN WORKSPACE */}
            <div className="flex flex-1 relative overflow-hidden">

                {/* LEFT SIDEBAR (Glass) */}
                <aside className="w-80 flex flex-col border-r border-white/10 bg-slate-900/30 backdrop-blur-sm overflow-y-auto">

                    {/* Requirements Section */}
                    <div className="border-b border-white/5">
                        <button
                            onClick={() => setShowRequirements(!showRequirements)}
                            className="flex items-center justify-between w-full p-4 text-sm font-semibold text-emerald-400 hover:bg-white/5 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                {showRequirements ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                <Target className="w-4 h-4" />
                                Requirements
                            </span>
                        </button>
                        {showRequirements && (
                            <div className="px-4 pb-4 border-l-2 border-emerald-500 ml-4">
                                <p className="text-sm text-slate-400 leading-relaxed mb-3">
                                    {question.description}
                                </p>
                                {question.requirements && question.requirements.length > 0 && (
                                    <ul className="space-y-2">
                                        {question.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                                <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Hints Section */}
                    {question.hints && question.hints.length > 0 && (
                        <div className="border-b border-white/5">
                            <button
                                onClick={() => setShowHints(!showHints)}
                                className="flex items-center gap-2 w-full p-4 text-sm font-medium text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
                            >
                                {showHints ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                <Lightbulb className="w-4 h-4" />
                                Hints
                            </button>
                            {showHints && (
                                <div className="px-4 pb-4">
                                    <ul className="space-y-2">
                                        {question.hints.map((hint, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                                <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                                                <span>{hint}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Evaluation Criteria */}
                    {question.evaluationCriteria && question.evaluationCriteria.length > 0 && (
                        <div className="p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                                <Target className="w-4 h-4" />
                                Evaluation Criteria
                            </div>
                            <div className="space-y-3">
                                {question.evaluationCriteria.map((criteria, i) => (
                                    <div key={i} className="bg-slate-800/30 rounded-lg p-3 border border-white/5">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-semibold text-white">{criteria.name}</span>
                                            <span className="text-xs text-emerald-400">{criteria.weight}%</span>
                                        </div>
                                        <p className="text-xs text-slate-400">{criteria.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* CANVAS AREA */}
                <main className="flex-1 relative bg-[#020617] overflow-hidden">

                    {/* Dot Grid Pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.07] pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                            backgroundSize: '24px 24px'
                        }}
                    />

                    {/* Excalidraw Canvas */}
                    <div className="absolute inset-0">
                        <Excalidraw
                            excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
                            initialData={initialExcalidrawData || undefined}
                            onChange={handleExcalidrawChange}
                            theme="dark"
                            UIOptions={solvePageUIOptions}
                        />
                    </div>
                </main>

                {/* EVALUATION PANEL */}
                {showEvaluation && solution?.evaluation && (
                    <aside className="w-96 border-l border-white/10 bg-slate-900/30 backdrop-blur-sm overflow-y-auto animate-slideIn">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white">AI Evaluation</h3>
                                <button
                                    onClick={() => setShowEvaluation(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Score Display */}
                            <div className="flex items-center justify-center mb-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center">
                                        <div className="text-center">
                                            <span className={`text-4xl font-bold ${getScoreColor(solution.evaluation.score)}`}>
                                                {solution.evaluation.score}
                                            </span>
                                            <span className="text-slate-500 text-sm block">/ 100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-white mb-2">Feedback</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">{solution.evaluation.feedback}</p>
                            </div>

                            {/* Strengths */}
                            {solution.evaluation.strengths && solution.evaluation.strengths.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 mb-2">
                                        <CheckCircle size={16} />
                                        Strengths
                                    </h4>
                                    <ul className="space-y-2">
                                        {solution.evaluation.strengths.map((strength, i) => (
                                            <li key={i} className="text-sm text-slate-400 pl-4 border-l-2 border-emerald-500/30">
                                                {strength}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Improvements */}
                            {solution.evaluation.improvements && solution.evaluation.improvements.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-yellow-400 flex items-center gap-2 mb-2">
                                        <AlertCircle size={16} />
                                        Areas for Improvement
                                    </h4>
                                    <ul className="space-y-2">
                                        {solution.evaluation.improvements.map((improvement, i) => (
                                            <li key={i} className="text-sm text-slate-400 pl-4 border-l-2 border-yellow-500/30">
                                                {improvement}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Criteria Scores */}
                            {solution.evaluation.criteriaScores && solution.evaluation.criteriaScores.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-white mb-3">Criteria Breakdown</h4>
                                    <div className="space-y-4">
                                        {solution.evaluation.criteriaScores.map((criteria, i) => (
                                            <div key={i} className="bg-slate-800/30 rounded-lg p-3 border border-white/5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-semibold text-white">{criteria.name}</span>
                                                    <span className={`text-sm font-bold ${getScoreColor(criteria.score)}`}>
                                                        {criteria.score}/100
                                                    </span>
                                                </div>
                                                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-2">
                                                    <div
                                                        className="h-full bg-emerald-500 rounded-full transition-all"
                                                        style={{ width: `${criteria.score}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-400">{criteria.feedback}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
