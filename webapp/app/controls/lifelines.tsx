import { GameState } from '@/types/gamestate';
import Image from 'next/image';
interface LifelineResultsProps {
    gameState: GameState;
    handleLifeline: (lifeline: keyof GameState['lifelines']) => void;
}

export default function Lifelines({ gameState, handleLifeline }: LifelineResultsProps) {
    return (
        <div className="flex justify-center items-center gap-2 mb-8">
            {Object.entries(gameState.lifelines).map(([lifeline, isAvailable]) => (
                <button
                    key={lifeline}
                    onClick={() => handleLifeline(lifeline as keyof GameState['lifelines'])}
                    disabled={!isAvailable}
                    className={`rounded p-1 ${
                        isAvailable ? '' : 'opacity-50'
                    }`}
                >
                    <Image
                        src={`/img/${lifeline}.png`}
                        alt={lifeline}
                        width={120}
                        height={60}
                    />
                </button>
            ))}
        </div>
    );
}