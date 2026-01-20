export interface Question {
    _id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    requirements?: string[];
    hints?: string[];
    evaluationCriteria?: {
        name: string;
        description: string;
        weight: number;
    }[];
    sampleSolution?: string;
    createdAt: string;
}

export interface Solution {
    _id: string;
    user: string;
    question: Question | string;
    excalidrawData: any;
    excalidrawImage?: string;
    status: 'pending' | 'evaluating' | 'evaluated' | 'error';
    evaluation?: {
        score: number;
        feedback: string;
        strengths: string[];
        improvements: string[];
        criteriaScores: {
            name: string;
            score: number;
            feedback: string;
        }[];
        evaluatedAt: string;
    };
    submittedAt: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}
