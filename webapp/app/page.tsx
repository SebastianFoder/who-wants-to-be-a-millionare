'use client';

import { useEffect, useState } from 'react';
import { GameManager } from '@/utils/gameManager';
import { GameState } from '@/types/gamestate';
import GameOver from '@/app/controls/gameover';
import Lifelines from '@/app/controls/lifelines';
import LifelineResults from '@/app/controls/lifelineResults';
import QuestionBox from '@/app/controls/questionBox';
import GameControls from '@/app/controls/gameControls';
import PrizeDisplay from '@/app/components/prizeDisplay';
import AnswersBox from '@/app/controls/answersBox';

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
        setSelectedAnswer(null);
    };

    if (!gameState) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen xl:h-screen p-4 container mx-auto">
            <h1 className="text-2xl xl:text-4xl font-bold mb-4 xl:mb-8 text-white text-center">
                Hvem vil være millionær?
            </h1>

            {/* Main Game Layout */}
            <div className="w-full flex flex-col xl:flex-row gap-4">
                {/* Left Column - Lifelines (moves to top below xl) */}
                <div className="w-full xl:w-1/4 order-1 xl:order-1">
                    <div className="flex justify-center xl:flex-col gap-4">
                        <Lifelines
                            gameState={gameState}
                            handleLifeline={handleLifeline}
                        />
                        <div className="hidden xl:block">
                            <LifelineResults
                                gameState={gameState}
                            />
                        </div>
                    </div>
                </div>

                {/* Center Column - Questions and Controls */}
                <div className="w-full xl:w-2/4 xl:my-auto items-center order-3 xl:order-2">
                    {gameState.currentQuestion && (
                        <div className="flex flex-col h-100 gap-6">
                            <QuestionBox
                                gameState={gameState}
                            />
                            <AnswersBox
                                gameState={gameState}
                                selectedAnswer={selectedAnswer}
                                setSelectedAnswer={setSelectedAnswer}
                            />
                        </div>
                    )}

                    {/* Lifeline Results (shows below question below xl) */}
                    <div className="xl:hidden mt-4">
                        <LifelineResults
                            gameState={gameState}
                        />
                    </div>

                    <GameControls
                        gameState={gameState}
                        handleQuit={handleQuit}
                        handleNextQuestion={handleNextQuestion}
                        handleAnswer={handleAnswer}
                        selectedAnswer={selectedAnswer}
                    />

                    {/* Game Over State */}
                    {gameState.isGameOver && (
                        <GameOver 
                            gameState={gameState}
                            handleNewGame={handleNewGame}
                        />
                    )}
                </div>

                {/* Right Column - Prize Display (moves to bottom below xl) */}
                <div className="w-full xl:w-1/4 order-2 xl:order-3">
                    <PrizeDisplay 
                        gameState={gameState}
                    />
                </div>
            </div>
        </div>
    );
}
