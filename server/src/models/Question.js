import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Question title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Question description is required']
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    category: {
        type: String,
        default: 'Other'
    },
    requirements: [{
        type: String
    }],
    hints: [{
        type: String
    }],
    evaluationCriteria: [{
        name: String,
        description: String,
        weight: Number // percentage weight for scoring
    }],
    sampleSolution: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'problems' // Use the existing 'problems' collection
});

export default mongoose.model('Question', questionSchema);
