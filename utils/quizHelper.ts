import { QuizDataSchema } from '@/types/quiz';

/**
 * Fetches and validates quiz data with error handling
 * 
 * @returns {Promise<{ data: QuizData | null, error: string | null }>} Object containing either the data or an error message
 */
export async function getQuizData() {
    try {
        const response = await fetch('/api');
        const rawData = await response.json();
        
        // Validate the data using our Zod schema
        const validatedData = QuizDataSchema.parse(rawData);
        
        return { data: validatedData, error: null };
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        return { 
            data: null, 
            error: error instanceof Error ? error.message : 'Failed to load quiz data'
        };
    }
}