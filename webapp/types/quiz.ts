import { z } from 'zod';

/**
 * Zod schema for quiz answers
 */
const AnswersSchema = z.object({
    a: z.string().min(1, "Answer A cannot be empty"),
    b: z.string().min(1, "Answer B cannot be empty"),
    c: z.string().min(1, "Answer C cannot be empty"),
    d: z.string().min(1, "Answer D cannot be empty"),
});

/**
 * Zod schema for a single quiz question
 */
const QuizQuestionSchema = z.object({
    moneysum: z.number().int().positive("Money sum must be a positive number"),
    question: z.string().min(1, "Question cannot be empty"),
    answers: AnswersSchema,
    correct_answer: z.enum(['a', 'b', 'c', 'd'], {
        errorMap: () => ({ message: "Correct answer must be either 'a', 'b', 'c', or 'd'" })
    }),
}).refine(
    (data) => {
        // Ensure the correct_answer exists in the answers object
        return data.answers[data.correct_answer as keyof typeof data.answers] !== undefined;
    },
    {
        message: "Correct answer must correspond to an existing answer option"
    }
);

/**
 * Zod schema for the entire quiz data array
 */
const QuizDataSchema = z.array(QuizQuestionSchema).min(1, "Quiz must contain at least one question");

/**
 * Types inferred from the Zod schemas
 */
type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
type QuizData = z.infer<typeof QuizDataSchema>;

export { QuizDataSchema, type QuizQuestion, type QuizData };