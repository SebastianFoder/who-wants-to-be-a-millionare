import { GameState } from '@/types/gamestate';

interface GameControlsProps {
    gameState: GameState;
    handleQuit: () => void;
    handleNextQuestion: () => void;
    handleAnswer: () => void;
    selectedAnswer: string | null;
}

export default function GameControls({ 
    gameState, 
    handleQuit, 
    handleNextQuestion, 
    handleAnswer, 
    selectedAnswer 
}: GameControlsProps) {
    return (
        <div className="flex justify-center items-center gap-4 my-4">
            {gameState.currentQuestion && (
                gameState.answerCorrect && (
                    <>
                    <button
                        onClick={handleQuit}
                        className="
                            px-8 py-4
                            bg-gradient-to-r from-red-600 to-red-500 
                            text-white text-sm font-semibold rounded-lg
                            shadow-lg border-2 border-red-400
                            transition-all duration-300
                            hover:scale-105 hover:shadow-xl
                            hover:from-red-500 hover:to-red-400
                            active:scale-100
                            disabled:grayscale disabled:cursor-not-allowed
                            min-w-[140px]
                        "
                    >
                        Stop spillet
                    </button>
                    <button
                        onClick={handleNextQuestion}
                        className="
                            px-8 py-4
                            bg-gradient-to-r from-green-600 to-green-500 
                            text-white text-sm font-semibold rounded-lg
                            shadow-lg border-2 border-green-400
                            transition-all duration-300
                            hover:scale-105 hover:shadow-xl
                            hover:from-green-500 hover:to-green-400
                            active:scale-100
                            disabled:grayscale disabled:cursor-not-allowed
                            min-w-[140px]
                        "
                    >
                        Næste spørgsmål
                    </button>
                    </>
                ) || (
                    <button
                        onClick={handleAnswer}
                        disabled={!selectedAnswer}
                        className="
                            px-8 py-4
                            bg-gradient-to-r from-amber-600 to-amber-500 
                            text-white text-sm font-semibold rounded-lg
                            shadow-lg border-2 border-amber-400
                            transition-all duration-300
                            hover:scale-105 hover:shadow-xl
                            hover:from-amber-500 hover:to-amber-400
                            active:scale-100
                            disabled:grayscale disabled:cursor-not-allowed
                            min-w-[140px]
                        "
                    >
                        Endeligt svar
                    </button>
                )
            )}
        </div>
    );
}