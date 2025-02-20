'use client';

import { useEffect, useState } from 'react';
import { GameManager } from '@/utils/gameManager';
import { GameState } from '@/types/gamestate';
import { getQuizData } from '@/utils/quizHelper';

export default function Home() {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [gameManager, setGameManager] = useState<GameManager | null>(null);

    // Initialize game manager and load questions
    useEffect(() => {
        const initGame = async () => {
            // Get quiz data
            const { data, error } = await getQuizData();
            if (error || !data) {
                console.error('Failed to load questions:', error);
                return;
            }

            // Create game manager instance
            const manager = new GameManager((newState) => {
                setGameState(newState);
            });

            // Start new game
            manager.dispatch({ type: 'START_GAME', questions: data });
            setGameManager(manager);
        };

        initGame();
    }, []);

    // Example handlers for game actions
    const handleAnswer = (answer: 'a' | 'b' | 'c' | 'd') => {
        gameManager?.dispatch({ type: 'ANSWER_QUESTION', answer });
    };

    const handleLifeline = (lifeline: keyof GameState['lifelines']) => {
        gameManager?.dispatch({ type: 'USE_LIFELINE', lifeline });
    };

    const handleQuit = () => {
        gameManager?.dispatch({ type: 'QUIT_GAME' });
    };

    const handleNextQuestion = () => {
        gameManager?.dispatch({ type: 'NEXT_QUESTION' });
    };

    if (!gameState) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-4xl font-bold mb-8">Hvem vil være millionær?</h1>
            
            {/* Current Prize */}
            <div className="mb-4">
                Current Prize: {gameState.currentPrize} DKK
                {gameState.safePrize > 0 && ` (Safe: ${gameState.safePrize} DKK)`}
            </div>

            {/* Question */}
            {gameState.currentQuestion && (
                <div className="mb-8">
                    <h2 className="text-2xl mb-4">{gameState.currentQuestion.question}</h2>
                    
                    {/* Answer Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(gameState.currentQuestion.answers).map(([key, value]) => (
                            gameState.activeAnswers[key as keyof GameState['activeAnswers']] && (
                                <button
                                    key={key}
                                    onClick={() => handleAnswer(key as keyof GameState['activeAnswers'])}
                                    className="p-4 border rounded hover:bg-blue-500 hover:text-white"
                                >
                                    {key.toUpperCase()}: {value}
                                </button>
                            )
                        ))}
                    </div>
                </div>
            )}

            {/* Lifelines */}
            <div className="flex gap-4 mb-8">
                {Object.entries(gameState.lifelines).map(([lifeline, isAvailable]) => (
                    <button
                        key={lifeline}
                        onClick={() => handleLifeline(lifeline as keyof GameState['lifelines'])}
                        disabled={!isAvailable}
                        className={`p-2 rounded ${
                            isAvailable ? 'bg-blue-500 text-white' : 'bg-gray-300'
                        }`}
                    >
                        {lifeline}
                    </button>
                ))}
            </div>

            {/* Game Controls */}
            <div className="flex gap-4">
                <button
                    onClick={handleQuit}
                    className="p-2 bg-red-500 text-white rounded"
                >
                    Quit Game
                </button>
                {gameState.currentQuestion && (
                    <button
                        onClick={handleNextQuestion}
                        className="p-2 bg-green-500 text-white rounded"
                    >
                        Next Question
                    </button>
                )}
            </div>

            {/* Lifeline Results */}
            {gameState.audienceResults && (
                <div className="mt-4">
                    <h3>Audience Results:</h3>
                    {Object.entries(gameState.audienceResults).map(([answer, percentage]) => (
                        <div key={answer}>
                            {answer.toUpperCase()}: {percentage}%
                        </div>
                    ))}
                </div>
            )}

            {gameState.phoneFriendResponse && (
                <div className="mt-4">
                    <h3>Friend says:</h3>
                    <p>{gameState.phoneFriendResponse.explanation}</p>
                    <p>Answer: {gameState.phoneFriendResponse.answer.toUpperCase()}</p>
                    <p>Confidence: {gameState.phoneFriendResponse.confidence}</p>
                </div>
            )}

            {/* Game Over State */}
            {gameState.isGameOver && (
                <div className="mt-8 text-center">
                    <h2 className="text-3xl mb-4">
                        {gameState.hasWon ? 'Congratulations!' : 'Game Over'}
                    </h2>
                    <p className="text-xl">
                        Final Prize: {gameState.currentPrize} DKK
                    </p>
                </div>
            )}
        </div>
    );
}
