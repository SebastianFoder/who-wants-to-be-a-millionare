import { GameState, PRIZE_LEVELS, CHECKPOINTS, Level } from '@/types/gamestate';
import { Gem } from 'lucide-react';

interface PrizeDisplayProps {
    gameState: GameState;
}

export default function PrizeDisplay({ gameState }: PrizeDisplayProps) {
    return (
        <div className="mb-4 grid grid-cols-1 gap-1">
            {Object.entries(PRIZE_LEVELS).sort((a, b) => parseInt(a[0]) > parseInt(b[0]) ? -1 : 1).map(([key, value]) => (
                <div key={key} className={`text-lg font-semibold grid grid-cols-[2ch_2ch_1fr] items-center gap-2 rounded-md px-2
                ${
                    parseInt(key) === gameState.level ? 'text-black bg-amber-600 border-2 border-white' : 
                    CHECKPOINTS.includes(parseInt(key) as Level) ? 'text-white' : 
                    'text-amber-500'
                }`}>
                    <span className="text-center">{key}</span>
                    <Gem className={`text-amber-500 ${value <= gameState.currentPrize ? 'opacity-100' : 'opacity-0'}`} />
                    <span>
                        {key === "15" ? "1 MILLION KR" : `KR ${value.toLocaleString()}`}
                    </span>
                </div>
            ))}
        </div>
    );
}