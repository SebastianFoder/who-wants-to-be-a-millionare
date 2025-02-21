import { GameState } from '@/types/gamestate';

interface QuestionBoxProps {
    gameState: GameState;
    setSelectedAnswer: (answer: keyof GameState['activeAnswers']) => void;
    selectedAnswer: keyof GameState['activeAnswers'] | null;
}

export default function QuestionBox({ gameState, setSelectedAnswer, selectedAnswer }: QuestionBoxProps) {
    return (
        <div className="mb-8 flex flex-col gap-6">
            <div className="flex items-center justify-center">
                <div 
                    className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white text-lg font-semibold 
                            px-6 py-3 rounded-lg border-2 border-blue-200 shadow-lg 
                            before:absolute before:inset-0 before:rounded-lg 
                            before:bg-white/20 before:blur-sm
                            w-full
                            text-center"
                    aria-live="polite"
                >
                    {gameState.currentQuestion?.question}
                </div>

            </div>
            
            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-4">
            {Object.entries(gameState.currentQuestion?.answers || {}).map(([key, value]) => {
                const isCorrectAnswer = key === gameState.currentQuestion?.correct_answer;
                const isSelectedAnswer = key === selectedAnswer;
                
                return gameState.activeAnswers[key as keyof GameState['activeAnswers']] && (
                    <button
                        key={key}
                        onClick={() => setSelectedAnswer(key as keyof GameState['activeAnswers'])}
                        className={`p-4 transition-all duration-300 disabled:cursor-not-allowed 
                            relative bg-gradient-to-r text-white text-lg font-semibold 
                            px-6 py-3 rounded-lg border-2 border-blue-200 shadow-lg 
                            before:absolute before:inset-0 before:rounded-lg 
                            before:bg-white/20 before:blur-sm
                            w-full
                            text-center
                            ${
                                gameState.answerCorrect === undefined
                                    ? isSelectedAnswer 
                                        ? 'from-amber-600 to-amber-500 text-black'  // Selected but not answered
                                        : 'from-blue-900 to-blue-800 text-white hover:from-blue-500 hover:to-blue-400'  // Not selected
                                    : isCorrectAnswer
                                        ? 'from-green-600 to-green-500 text-white animate-pulse'  // Correct answer
                                        : isSelectedAnswer
                                            ? 'from-red-800 to-red-600 text-white'  // Wrong selected answer
                                            : 'from-blue-900 to-blue-800 text-white opacity-50'  // Other answers after selection
                            }`}
                        disabled={gameState.answerCorrect !== undefined}
                        aria-disabled={gameState.answerCorrect !== undefined}
                    >
                        <span className={`
                            ${isSelectedAnswer 
                                ? gameState.answerCorrect === undefined
                                    ? 'text-black' 
                                    : 'text-white'
                                : 'text-amber-500'
                            }`
                        }>
                            {key.toUpperCase()}:
                        </span> {value}
                    </button>
                );
            })}
            </div>
        </div>
    );
}