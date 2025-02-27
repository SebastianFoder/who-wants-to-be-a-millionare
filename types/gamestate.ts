import { QuizQuestion } from './quiz';

/**
 * Available lifelines in the game
 */
export interface Lifelines {
    fiftyFifty: boolean;    // Removes two wrong answers
    phoneAFriend: boolean;  // Call a friend for help
    askTheAudience: boolean; // Ask the audience for help
}

/**
 * Prize levels in the game
 */
export const PRIZE_LEVELS = {
    1: 1000,
    2: 2000,
    3: 3000,
    4: 4000,
    5: 5000,    // First checkpoint
    6: 8000,
    7: 12000,
    8: 20000,
    9: 32000,
    10: 50000,  // Second checkpoint
    11: 75000,
    12: 125000,
    13: 250000,
    14: 500000,
    15: 1000000
} as const;

/**
 * Game level (1-15)
 */
export type Level = keyof typeof PRIZE_LEVELS;

/**
 * Checkpoint levels
 */
export const CHECKPOINTS: Level[] = [5, 10, 15];

/**
 * Current state of the game
 */
interface GameState {
    // Game progress
    currentQuestionIndex: number;
    currentQuestion: QuizQuestion | null;
    questions: QuizQuestion[];

    activeAnswers: {
        a: boolean;
        b: boolean;
        c: boolean;
        d: boolean;
    };
    
    // Player status
    currentPrize: number;
    safePrize: number;      // Last checkpoint reached (5000 or 50000)

    answerCorrect?: boolean;

    audienceResults?: Record<string, number>;

    phoneFriendResponse?: {
        answer: string;
        confidence: 'very sure' | 'pretty sure' | 'not sure';
        explanation: string;
    };
    
    // Game status
    isGameOver: boolean;
    hasWon: boolean;
    
    // Available help options
    lifelines: Lifelines;
    
    // Current level (1-15)
    level: Level;
    
    // Timer state (optional, if implementing timer)
    timeRemaining?: number;
    isTimerActive?: boolean;

    getPrizeMoney: (level: Level) => number;
    getSafePrizeMoney: (level: Level) => number;
}

function getInitialGameState(): GameState {
    return {
        currentQuestionIndex: 0,
        currentQuestion: null,
        questions: [],
        activeAnswers: {
            a: true,
            b: true,
            c: true,
            d: true
        },
        currentPrize: 0,
        safePrize: 0,
        isGameOver: false,
        hasWon: false,
        lifelines: {
            fiftyFifty: true,
            phoneAFriend: true,
            askTheAudience: true
        },
        level: 1,
        audienceResults: undefined,
        phoneFriendResponse: undefined,
        answerCorrect: undefined,
        getPrizeMoney,
        getSafePrizeMoney
    }
}

/**
 * Helper function to get prize money for a given level
 */
function getPrizeMoney(level: Level): number {
    return PRIZE_LEVELS[level];
}

/**
 * Helper function to get safe prize money based on current level
 */
function getSafePrizeMoney(level: Level): number {
    if (level >= 10) return PRIZE_LEVELS[10];  // 50,000
    if (level >= 5) return PRIZE_LEVELS[5];    // 5,000
    return 0;
}

export { getInitialGameState, type GameState };