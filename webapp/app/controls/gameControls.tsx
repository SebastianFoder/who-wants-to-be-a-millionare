import { GameState } from '@/types/gamestate';

interface GameControlsProps {
    gameState: GameState;
    handleQuit: () => void;
    handleNextQuestion: () => void;
    handleAnswer: () => void;
    selectedAnswer: string | null;
}

export default function GameControls({ gameState, handleQuit, handleNextQuestion, handleAnswer, selectedAnswer }: GameControlsProps) {
    return (
        <div className="flex gap-4">
                
                {gameState.currentQuestion && (
                    gameState.answerCorrect && (
                        <>
                        <button
                            onClick={handleQuit}
                            className="p-2 bg-red-500 text-white rounded"
                        >
                            Quit Game
                        </button>
                        <button
                            onClick={handleNextQuestion}
                            className="p-2 bg-green-500 text-white rounded"
                        >
                            Next Question
                        </button>
                        </>
                    ) || (
                        <button
                            onClick={handleAnswer}
                            className="p-2 bg-green-500 text-white rounded disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={!selectedAnswer}
                        >
                            Final Answer
                        </button>
                    )
                )}
                
            </div>
    );
}