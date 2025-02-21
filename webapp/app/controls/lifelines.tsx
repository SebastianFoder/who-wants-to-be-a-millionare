import { GameState } from '@/types/gamestate';

interface LifelineResultsProps {
    gameState: GameState;
    handleLifeline: (lifeline: keyof GameState['lifelines']) => void;
}

export default function Lifelines({ gameState, handleLifeline }: LifelineResultsProps) {
    return (
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
    );
}