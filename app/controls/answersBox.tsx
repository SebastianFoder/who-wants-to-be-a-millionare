import { GameState } from "@/types/gamestate";

interface AnswersBoxProps {
    gameState: GameState;
    selectedAnswer: "a" | "b" | "c" | "d" | null;
    setSelectedAnswer: (answer: "a" | "b" | "c" | "d") => void;
}

export default function AnswersBox({ gameState, selectedAnswer, setSelectedAnswer }: AnswersBoxProps) {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 xl:gap-4">
            {Object.entries(gameState.currentQuestion?.answers || {}).map(([key, value]) => {
                const isCorrectAnswer = key === gameState.currentQuestion?.correct_answer;
                const isSelectedAnswer = key === selectedAnswer;
                const isAnswered = gameState.answerCorrect !== undefined;
                
                return gameState.activeAnswers[key as keyof GameState['activeAnswers']] && (
                    <button
                        key={key}
                        onClick={() => setSelectedAnswer(key as keyof GameState['activeAnswers'])}
                        className={`
                            relative 
                            bg-gradient-to-r 
                            text-lg font-semibold 
                            px-4 py-3 xl:px-6 xl:py-3
                            rounded-lg border-2 border-blue-200 
                            shadow-lg 
                            before:absolute before:inset-0 
                            before:rounded-lg 
                            before:bg-white/20 before:blur-sm
                            w-full
                            text-left
                            transition-all duration-300
                            flex items-center gap-3
                            min-h-[60px] xl:min-h-[70px]
                            ${
                                isAnswered
                                    ? isCorrectAnswer
                                        ? 'from-green-600 to-green-500 text-white animate-pulse'  // Correct answer
                                        : isSelectedAnswer
                                            ? 'from-red-800 to-red-600 text-white'  // Wrong selected answer
                                            : 'from-blue-900 to-blue-800 text-white grayscale'  // Other answers after selection
                                    : isSelectedAnswer 
                                        ? 'from-amber-600 to-amber-500 text-black'  // Selected but not answered
                                        : 'from-blue-900 to-blue-800 text-white hover:scale-[1.02] hover:shadow-xl hover:from-blue-500 hover:to-blue-400'  // Not selected with hover
                            }
                            disabled:cursor-not-allowed
                        `}
                        disabled={isAnswered}
                        aria-disabled={isAnswered}
                    >
                        <span className={`
                            text-base xl:text-lg
                            min-w-[24px]
                            ${isSelectedAnswer 
                                ? gameState.answerCorrect === undefined
                                    ? 'text-black' 
                                    : 'text-white'
                                : 'text-amber-500'
                            }
                        `}>
                            {key.toUpperCase()}:
                        </span>
                        <span className="flex-1">
                            {value}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
