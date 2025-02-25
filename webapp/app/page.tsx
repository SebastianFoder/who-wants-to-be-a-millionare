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
        <div className="flex flex-col items-center justify-center min-h-screen p-4 container mx-auto">
            <h1 className="text-4xl font-bold mb-8">Hvem vil være millionær?</h1>
            <div className="flex flex-row gap-4">
                <div className="w-1/4 flex flex-col gap-1">
                    <Lifelines
                        gameState={gameState}
                        handleLifeline={handleLifeline}/>
                    <LifelineResults
                        gameState={gameState}/>
                </div>
                <div className="w-2/4 grid grid-cols-1 gap-1">
                    {/* Question */}
                    {gameState.currentQuestion && (
                    <div className="mb-8 flex flex-col gap-6">
                        <QuestionBox
                            gameState={gameState}/>
                        <AnswersBox
                            gameState={gameState}
                            selectedAnswer={selectedAnswer}
                            setSelectedAnswer={setSelectedAnswer}/>
                    </div>
                    )}

                    

                    <GameControls
                        gameState={gameState}
                        handleQuit={handleQuit}
                        handleNextQuestion={handleNextQuestion}
                        handleAnswer={handleAnswer}
                        selectedAnswer={selectedAnswer}/>

                    
                    

                    {/* Game Over State */}
                    {gameState.isGameOver && (
                        <GameOver 
                            gameState={gameState}
                            handleNewGame={handleNewGame}/>  
                    )}
                </div>
                <div className="w-1/4 grid grid-cols-1 gap-1">
                    {/* Current Prize */}

                    <PrizeDisplay 
                        gameState={gameState} />
                </div>
            </div>
        </div>
    );
}
