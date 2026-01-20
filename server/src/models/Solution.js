import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    excalidrawData: {
        type: Object, // Store the entire Excalidraw JSON
        required: true
    },
    excalidrawImage: {
        type: String, // Base64 encoded image for AI processing
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'evaluating', 'evaluated', 'error'],
        default: 'pending'
    },
    evaluation: {
        score: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        feedback: {
            type: String,
            default: ''
        },
        strengths: [{
            type: String
        }],
        improvements: [{
            type: String
        }],
        criteriaScores: [{
            name: String,
            score: Number,
            feedback: String
        }],
        evaluatedAt: {
            type: Date
        }
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Solution', solutionSchema);
