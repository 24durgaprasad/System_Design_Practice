import express from 'express';
import Question from '../models/Question.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   GET /api/questions
// @desc    Get all questions
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { category, difficulty, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const questions = await Question.find(query)
            .sort({ createdAt: -1 })
            .select('-sampleSolution');

        res.json(questions);
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ message: 'Error fetching questions' });
    }
});

// @route   GET /api/questions/:id
// @desc    Get single question
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json(question);
    } catch (error) {
        console.error('Get question error:', error);
        res.status(500).json({ message: 'Error fetching question' });
    }
});

// @route   POST /api/questions
// @desc    Create a new question
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const question = await Question.create({
            ...req.body,
            createdBy: req.user._id
        });

        res.status(201).json(question);
    } catch (error) {
        console.error('Create question error:', error);
        res.status(500).json({ message: 'Error creating question' });
    }
});

// @route   PUT /api/questions/:id
// @desc    Update a question
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json(question);
    } catch (error) {
        console.error('Update question error:', error);
        res.status(500).json({ message: 'Error updating question' });
    }
});

// @route   DELETE /api/questions/:id
// @desc    Delete a question
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Delete question error:', error);
        res.status(500).json({ message: 'Error deleting question' });
    }
});

// @route   POST /api/questions/seed
// @desc    Seed sample questions
// @access  Private/Admin
router.post('/seed', protect, adminOnly, async (req, res) => {
    try {
        const sampleQuestions = [
            {
                title: 'Design a URL Shortener',
                description: 'Design a URL shortening service like bit.ly. The service should be able to create short URLs, redirect users to the original URL, and track click statistics.',
                difficulty: 'Medium',
                category: 'Scalability',
                requirements: [
                    'Generate unique short URLs',
                    'Redirect users to original URLs efficiently',
                    'Handle high read traffic (more reads than writes)',
                    'Track click analytics',
                    'URLs should expire after a configurable time'
                ],
                hints: [
                    'Consider using base62 encoding for short URLs',
                    'Think about caching strategies for hot URLs',
                    'Consider database sharding for scalability'
                ],
                evaluationCriteria: [
                    { name: 'Scalability', description: 'Can handle millions of URLs and requests', weight: 25 },
                    { name: 'Data Model', description: 'Efficient database schema design', weight: 20 },
                    { name: 'API Design', description: 'RESTful API with proper endpoints', weight: 15 },
                    { name: 'Caching Strategy', description: 'Appropriate caching for performance', weight: 20 },
                    { name: 'Reliability', description: 'Handles failures gracefully', weight: 20 }
                ],
                createdBy: req.user._id
            },
            {
                title: 'Design Twitter/X Feed',
                description: 'Design the home timeline feature of Twitter. Users should see tweets from people they follow in reverse chronological order with support for likes, retweets, and replies.',
                difficulty: 'Hard',
                category: 'Real-time Systems',
                requirements: [
                    'Display tweets from followed users',
                    'Support for likes, retweets, and replies',
                    'Handle celebrity users with millions of followers',
                    'Near real-time feed updates',
                    'Support pagination'
                ],
                hints: [
                    'Consider fan-out on write vs fan-out on read',
                    'Think about hybrid approaches for celebrities',
                    'Message queues for async processing'
                ],
                evaluationCriteria: [
                    { name: 'Feed Generation', description: 'Efficient feed generation strategy', weight: 30 },
                    { name: 'Scalability', description: 'Handles millions of users', weight: 25 },
                    { name: 'Data Storage', description: 'Appropriate database choices', weight: 20 },
                    { name: 'Caching', description: 'Smart caching for hot data', weight: 15 },
                    { name: 'Real-time Updates', description: 'Near real-time feed updates', weight: 10 }
                ],
                createdBy: req.user._id
            },
            {
                title: 'Design a Rate Limiter',
                description: 'Design a rate limiting service that can be used to protect APIs from abuse. It should support different rate limiting strategies and be distributed.',
                difficulty: 'Medium',
                category: 'API Design',
                requirements: [
                    'Support multiple rate limiting algorithms (Token Bucket, Sliding Window, etc.)',
                    'Work in a distributed environment',
                    'Handle different rate limits per user/API',
                    'Return appropriate headers and status codes',
                    'Minimal latency impact'
                ],
                hints: [
                    'Consider Redis for distributed state',
                    'Think about race conditions in distributed systems',
                    'HTTP 429 for rate limited requests'
                ],
                evaluationCriteria: [
                    { name: 'Algorithm Choice', description: 'Appropriate rate limiting algorithm', weight: 25 },
                    { name: 'Distributed Design', description: 'Works across multiple servers', weight: 25 },
                    { name: 'Performance', description: 'Minimal latency overhead', weight: 20 },
                    { name: 'Flexibility', description: 'Supports different configurations', weight: 15 },
                    { name: 'Edge Cases', description: 'Handles edge cases properly', weight: 15 }
                ],
                createdBy: req.user._id
            },
            {
                title: 'Design a Chat Application',
                description: 'Design a real-time chat application like WhatsApp or Slack that supports one-on-one and group messaging.',
                difficulty: 'Hard',
                category: 'Real-time Systems',
                requirements: [
                    'One-on-one messaging',
                    'Group chats up to 1000 members',
                    'Message delivery status (sent, delivered, read)',
                    'Online/offline presence',
                    'Message history and search'
                ],
                hints: [
                    'Consider WebSocket for real-time communication',
                    'Think about message ordering guarantees',
                    'Consider how to handle offline users'
                ],
                evaluationCriteria: [
                    { name: 'Real-time Messaging', description: 'Efficient real-time message delivery', weight: 25 },
                    { name: 'Data Model', description: 'Efficient storage for messages', weight: 20 },
                    { name: 'Presence System', description: 'Accurate online/offline tracking', weight: 15 },
                    { name: 'Scalability', description: 'Handles millions of concurrent users', weight: 25 },
                    { name: 'Reliability', description: 'Message delivery guarantees', weight: 15 }
                ],
                createdBy: req.user._id
            },
            {
                title: 'Design a CDN',
                description: 'Design a Content Delivery Network that can efficiently serve static content to users worldwide with low latency.',
                difficulty: 'Hard',
                category: 'CDN',
                requirements: [
                    'Serve static content (images, videos, JS, CSS)',
                    'Global distribution of content',
                    'Cache invalidation strategy',
                    'Handle cache misses efficiently',
                    'SSL/TLS termination'
                ],
                hints: [
                    'Consider DNS-based load balancing',
                    'Think about cache hierarchy (L1, L2 caches)',
                    'Consider consistent hashing for cache distribution'
                ],
                evaluationCriteria: [
                    { name: 'Architecture', description: 'Well-designed CDN architecture', weight: 25 },
                    { name: 'Caching Strategy', description: 'Efficient multi-tier caching', weight: 25 },
                    { name: 'Global Distribution', description: 'Smart edge server placement', weight: 20 },
                    { name: 'Performance', description: 'Low latency content delivery', weight: 20 },
                    { name: 'Cache Invalidation', description: 'Proper cache invalidation strategy', weight: 10 }
                ],
                createdBy: req.user._id
            },
            {
                title: 'Design a Notification Service',
                description: 'Design a notification service that can send notifications via multiple channels (push, email, SMS) with high reliability and at scale.',
                difficulty: 'Medium',
                category: 'Message Queues',
                requirements: [
                    'Support multiple notification channels',
                    'User notification preferences',
                    'Rate limiting per user',
                    'Retry mechanism for failed deliveries',
                    'Template management'
                ],
                hints: [
                    'Consider message queues for async processing',
                    'Think about priority queues for urgent notifications',
                    'Consider DLQ for failed messages'
                ],
                evaluationCriteria: [
                    { name: 'Architecture', description: 'Clean service architecture', weight: 20 },
                    { name: 'Message Queue Design', description: 'Proper use of queues', weight: 25 },
                    { name: 'Reliability', description: 'High delivery success rate', weight: 25 },
                    { name: 'Scalability', description: 'Handles millions of notifications', weight: 20 },
                    { name: 'Extensibility', description: 'Easy to add new channels', weight: 10 }
                ],
                createdBy: req.user._id
            }
        ];

        // Clear existing questions and insert new ones
        await Question.deleteMany({});
        const questions = await Question.insertMany(sampleQuestions);

        res.status(201).json({
            message: `Successfully seeded ${questions.length} questions`,
            questions
        });
    } catch (error) {
        console.error('Seed questions error:', error);
        res.status(500).json({ message: 'Error seeding questions' });
    }
});

export default router;
