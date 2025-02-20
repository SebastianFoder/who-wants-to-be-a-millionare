import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { QuizDataSchema } from '@/types/quiz';
import { ZodError } from 'zod';

/**
 * GET handler for retrieving quiz data
 * 
 * @returns {Promise<NextResponse>} JSON response containing validated quiz data
 * @description Reads the data.json file, validates its structure, and returns its contents as a JSON response
 */
export async function GET() {
    try {
        // Get the path to the JSON file
        const jsonPath = path.join(process.cwd(), 'app/api/data.json');
        
        // Read the JSON file
        const jsonData = await fs.readFile(jsonPath, 'utf8');
        
        // Parse JSON
        const rawData = JSON.parse(jsonData);
        
        // Validate data structure
        const validatedData = QuizDataSchema.parse(rawData);
        
        return NextResponse.json(validatedData);
        
    } catch (error) {
        console.error('Error processing data.json:', error);
        
        // Return specific error for validation failures
        if (error instanceof ZodError) {
            return NextResponse.json(
                { 
                    error: 'Invalid data structure',
                    details: error.errors 
                },
                { status: 400 }
            );
        }
        
        // Return generic error for other failures
        return NextResponse.json(
            { error: 'Failed to load data' },
            { status: 500 }
        );
    }
}
