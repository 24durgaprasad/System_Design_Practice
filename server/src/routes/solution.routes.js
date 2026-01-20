import express from 'express';
import Solution from '../models/Solution.js';
import Question from '../models/Question.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Perplexity AI evaluation function
async function evaluateWithPerplexity(question, excalidrawData, excalidrawImage) {
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

    if (!PERPLEXITY_API_KEY) {
        throw new Error('Perplexity API key not configured');
    }

    // Extract text elements from Excalidraw data
    const textElements = excalidrawData.elements
        ?.filter(el => el.type === 'text')
        ?.map(el => el.text)
        ?.join('\n') || '';

    // Extract other element types for context
    const elementTypes = excalidrawData.elements
        ?.map(el => el.type)
        ?.reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {}) || {};

    const diagramDescription = `
The diagram contains:
- ${elementTypes.rectangle || 0} rectangles (likely representing services/components)
- ${elementTypes.ellipse || 0} ellipses (likely representing databases/storage)
- ${elementTypes.arrow || 0} arrows (showing data flow/connections)
- ${elementTypes.line || 0} lines
- ${elementTypes.text || 0} text labels

Text content in the diagram:
${textElements}
`;

    const evaluationCriteriaText = question.evaluationCriteria
        ?.map(c => `- ${c.name} (${c.weight}%): ${c.description}`)
        ?.join('\n') || '';

    const prompt = `You are an expert system design interviewer evaluating a candidate's system design solution.

## Question
**Title:** ${question.title}
**Description:** ${question.description}
**Difficulty:** ${question.difficulty}

**Requirements:**
${question.requirements?.map(r => `- ${r}`).join('\n') || 'No specific requirements'}

## Evaluation Criteria
${evaluationCriteriaText}

## Candidate's Solution (Excalidraw Diagram Analysis)
${diagramDescription}

## Your Task
Evaluate this system design solution and provide:

1. **Overall Score (0-100):** A numerical score based on the weighted evaluation criteria.

2. **Detailed Feedback:** A comprehensive paragraph explaining the overall quality of the solution.

3. **Strengths:** List 3-5 specific things the candidate did well.

4. **Areas for Improvement:** List 3-5 specific suggestions for improvement.

5. **Criteria Scores:** For each evaluation criterion, provide:
   - Score (0-100)
   - Brief feedback

Please respond in the following JSON format:
{
  "score": <number>,
  "feedback": "<string>",
  "strengths": ["<string>", ...],
  "improvements": ["<string>", ...],
  "criteriaScores": [
    {
      "name": "<criterion name>",
      "score": <number>,
      "feedback": "<string>"
    }
  ]
}

Provide only the JSON response, no additional text.`;

    try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'sonar-pro',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert system design interviewer. Evaluate solutions fairly but thoroughly. Always respond with valid JSON only.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Perplexity API error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        // Parse the JSON response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Could not parse AI response as JSON');
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Perplexity API error:', error);
        throw error;
    }
}

// @route   GET /api/solutions
// @desc    Get all solutions for current user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const solutions = await Solution.find({ user: req.user._id })
            .populate('question', 'title difficulty category')
            .sort({ submittedAt: -1 });

        res.json(solutions);
    } catch (error) {
        console.error('Get solutions error:', error);
        res.status(500).json({ message: 'Error fetching solutions' });
    }
});

// @route   GET /api/solutions/question/:questionId
// @desc    Get solutions for a specific question by current user
// @access  Private
router.get('/question/:questionId', protect, async (req, res) => {
    try {
        const solutions = await Solution.find({
            user: req.user._id,
            question: req.params.questionId
        }).sort({ submittedAt: -1 });

        res.json(solutions);
    } catch (error) {
        console.error('Get solutions by question error:', error);
        res.status(500).json({ message: 'Error fetching solutions' });
    }
});

// @route   GET /api/solutions/:id
// @desc    Get a specific solution
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const solution = await Solution.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('question');

        if (!solution) {
            return res.status(404).json({ message: 'Solution not found' });
        }

        res.json(solution);
    } catch (error) {
        console.error('Get solution error:', error);
        res.status(500).json({ message: 'Error fetching solution' });
    }
});

// @route   POST /api/solutions
// @desc    Submit a new solution
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { questionId, excalidrawData, excalidrawImage } = req.body;

        // Validate question exists
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Create solution
        const solution = await Solution.create({
            user: req.user._id,
            question: questionId,
            excalidrawData,
            excalidrawImage: excalidrawImage || '',
            status: 'pending'
        });

        res.status(201).json(solution);
    } catch (error) {
        console.error('Submit solution error:', error);
        res.status(500).json({ message: 'Error submitting solution' });
    }
});

// @route   POST /api/solutions/:id/evaluate
// @desc    Evaluate a solution using Perplexity AI
// @access  Private
router.post('/:id/evaluate', protect, async (req, res) => {
    try {
        const solution = await Solution.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('question');

        if (!solution) {
            return res.status(404).json({ message: 'Solution not found' });
        }

        // Update status to evaluating
        solution.status = 'evaluating';
        await solution.save();

        try {
            // Call Perplexity AI for evaluation
            const evaluation = await evaluateWithPerplexity(
                solution.question,
                solution.excalidrawData,
                solution.excalidrawImage
            );

            // Update solution with evaluation results
            solution.status = 'evaluated';
            solution.evaluation = {
                score: evaluation.score,
                feedback: evaluation.feedback,
                strengths: evaluation.strengths,
                improvements: evaluation.improvements,
                criteriaScores: evaluation.criteriaScores,
                evaluatedAt: new Date()
            };

            await solution.save();
            res.json(solution);
        } catch (evalError) {
            // Mark as error but save what we can
            solution.status = 'error';
            solution.evaluation = {
                feedback: `Evaluation failed: ${evalError.message}`,
                evaluatedAt: new Date()
            };
            await solution.save();

            res.status(500).json({
                message: 'Evaluation failed',
                error: evalError.message,
                solution
            });
        }
    } catch (error) {
        console.error('Evaluate solution error:', error);
        res.status(500).json({ message: 'Error evaluating solution' });
    }
});

// @route   PUT /api/solutions/:id
// @desc    Update a solution (save progress)
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const { excalidrawData, excalidrawImage } = req.body;

        const solution = await Solution.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            {
                excalidrawData,
                excalidrawImage: excalidrawImage || '',
                status: 'pending' // Reset status if updating
            },
            { new: true }
        );

        if (!solution) {
            return res.status(404).json({ message: 'Solution not found' });
        }

        res.json(solution);
    } catch (error) {
        console.error('Update solution error:', error);
        res.status(500).json({ message: 'Error updating solution' });
    }
});

// @route   DELETE /api/solutions/:id
// @desc    Delete a solution
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const solution = await Solution.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!solution) {
            return res.status(404).json({ message: 'Solution not found' });
        }

        res.json({ message: 'Solution deleted successfully' });
    } catch (error) {
        console.error('Delete solution error:', error);
        res.status(500).json({ message: 'Error deleting solution' });
    }
});

export default router;
