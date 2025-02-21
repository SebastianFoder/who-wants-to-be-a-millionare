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
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-4xl font-bold mb-8">Hvem vil være millionær?</h1>
            
            {/* Current Prize */}
            <PrizeDisplay 
                gameState={gameState} />

            {/* Question */}
            {gameState.currentQuestion && (
                <QuestionBox
                    gameState={gameState}
                    setSelectedAnswer={setSelectedAnswer}
                    selectedAnswer={selectedAnswer}/>
            )}

            <Lifelines
                gameState={gameState}
                handleLifeline={handleLifeline}/>

            <GameControls
                gameState={gameState}
                handleQuit={handleQuit}
                handleNextQuestion={handleNextQuestion}
                handleAnswer={handleAnswer}
                selectedAnswer={selectedAnswer}/>

            <LifelineResults
                gameState={gameState}/>
            

            {/* Game Over State */}
            {gameState.isGameOver && (
                <GameOver 
                    gameState={gameState}
                    handleNewGame={handleNewGame}/>  
            )}
        </div>
    );
}
