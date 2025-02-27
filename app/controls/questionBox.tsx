import { GameState } from '@/types/gamestate';

interface QuestionBoxProps {
    gameState: GameState;
}

export default function QuestionBox({ gameState }: QuestionBoxProps) {
    return (
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
    );
}