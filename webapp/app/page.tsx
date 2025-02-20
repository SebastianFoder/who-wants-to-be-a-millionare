'use client';

import { useEffect, useState } from 'react';
import { GameManager } from '@/utils/gameManager';
import { GameState } from '@/types/gamestate';
import GameOver from '@/app/controls/gameover';
import Lifelines from '@/app/controls/lifelines';

export default function Home() {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [gameManager, setGameManager] = useState<GameManager | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<keyof GameState['activeAnswers'] | null>(null);

    // Initialize game manager and load questions
    useEffect(() => {
        const initGame = async () => {
            // Create game manager instance
            const manager = new GameManager((newState) => {
                setGameState(newState);
            });

            // Start new game
            await manager.newGame();
            setGameManager(manager);
        };

        initGame();
    }, []);

    // Example handlers for game actions
    const handleAnswer = () => {
        if (!selectedAnswer) return;
        gameManager?.dispatch({ type: 'ANSWER_QUESTION', answer: selectedAnswer });
    };

    const handleLifeline = (lifeline: keyof GameState['lifelines']) => {
        gameManager?.dispatch({ type: 'USE_LIFELINE', lifeline });
    };

    const handleQuit = async () => {
        gameManager?.dispatch({ type: 'QUIT_GAME' });
    };

    const handleNextQuestion = () => {
        gameManager?.dispatch({ type: 'NEXT_QUESTION' });
        setSelectedAnswer(null);
    };

    const handleNewGame = async () => {
        await gameManager?.newGame();
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
                                    onClick={() => setSelectedAnswer(key as keyof GameState['activeAnswers'])}
                                    className={`p-4 border rounded transition-colors duration-300 ${
                                        selectedAnswer === key 
                                            ? gameState.answerCorrect === undefined
                                                ? 'bg-blue-500 text-white'  // Selected but not answered
                                                : gameState.answerCorrect
                                                    ? 'bg-green-500 text-white animate-pulse'  // Correct answer
                                                    : 'bg-red-500 text-white'  // Wrong answer
                                            : 'hover:bg-blue-500 hover:text-white'  // Not selected
                                    }`}
                                    disabled={gameState.answerCorrect !== undefined}
                                >
                                    {key.toUpperCase()}: {value}
                                </button>
                            )
                        ))}
                    </div>
                </div>
            )}

            <Lifelines gameState={gameState} handleLifeline={handleLifeline} />


            {/* Game Controls */}
            <div className="flex gap-4">
                <button
                    onClick={handleQuit}
                    className="p-2 bg-red-500 text-white rounded"
                >
                    Quit Game
                </button>
                {gameState.currentQuestion && (
                    gameState.answerCorrect && (
                      <button
                        onClick={handleNextQuestion}
                        className="p-2 bg-green-500 text-white rounded"
                      >
                        Next Question
                      </button>
                    ) || (
                      <button
                        onClick={handleAnswer}
                        className="p-2 bg-green-500 text-white rounded"
                        disabled={!selectedAnswer}
                      >
                          Final Answer
                      </button>
                    )
                )}
                
            </div>

            

            {/* Game Over State */}
            {gameState.isGameOver && (
                <GameOver gameState={gameState} handleNewGame={handleNewGame} />  
            )}
        </div>
    );
}
