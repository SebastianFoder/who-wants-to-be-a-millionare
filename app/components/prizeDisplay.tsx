import { GameState, PRIZE_LEVELS, CHECKPOINTS, Level } from '@/types/gamestate';
import { Gem } from 'lucide-react';

interface PrizeDisplayProps {
    gameState: GameState;
}

export default function PrizeDisplay({ gameState }: PrizeDisplayProps) {
    // Group questions by checkpoint sections (reversed for mobile)
    const sections = [
        [15, 14, 13, 12, 11],
        [10, 9, 8, 7, 6], 
        [5, 4, 3, 2, 1],     
    ];

    // Get relevant levels for compact view
    const currentLevel = gameState.level;
    const nextLevel = currentLevel < 15 ? currentLevel + 1 : null;
    const lastLevel = currentLevel > 1 ? currentLevel - 1 : null;

    const PrizeRow = ({ level }: { level: number }) => (
        <div className={`
            text-sm xl:text-lg font-semibold 
            grid grid-cols-[2ch_2ch_1fr] xl:grid-cols-[3ch_3ch_1fr] items-center gap-2 xl:gap-3
            rounded-md px-2 xl:px-4 py-1 xl:py-2
            transition-all duration-300
            ${
                level === gameState.level 
                    ? 'text-black bg-amber-600 border-2 border-white scale-105' : 
                CHECKPOINTS.includes(level as Level) 
                    ? 'text-white bg-blue-900/50' : 
                    'text-amber-500'
            }
            ${
                level <= gameState.level 
                    ? 'opacity-100' : 
                    'opacity-70'
            }
            hover:opacity-100
        `}>
            <span className="text-center">{level}</span>
            <Gem 
                className={`
                    w-4 h-4
                    text-amber-500 
                    ${PRIZE_LEVELS[level as keyof typeof PRIZE_LEVELS] <= gameState.currentPrize ? 'opacity-100' : 'opacity-0'}
                `} 
            />
            <span className="truncate">
                {level === 15 ? "1 MILLION KR" : `KR ${PRIZE_LEVELS[level as keyof typeof PRIZE_LEVELS].toLocaleString()}`}
            </span>
        </div>
    );

    return (
        <>
            {/* Extra Small Screen View */}
            <div className="mb-4 sm:hidden space-y-1">
                {nextLevel && <PrizeRow level={nextLevel} />}
                <PrizeRow level={currentLevel} />
                {lastLevel && <PrizeRow level={lastLevel} />}
            </div>

            {/* Tablet View */}
            <div className="
                mb-4 
                hidden sm:grid sm:grid-cols-3 sm:gap-4 xl:hidden
            ">
                {sections.map((section, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        {section.map(level => (
                            <PrizeRow key={level} level={level} />
                        ))}
                    </div>
                ))}
            </div>

            {/* Desktop View */}
            <div className="
                mb-4 
                hidden xl:grid xl:grid-cols-1 xl:gap-1
                lg:w-[300px]
            ">
                {sections.map((section, index) => (
                    <div key={index} className="flex flex-col justify-center">
                        {section.map(level => (
                            <PrizeRow key={level} level={level} />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}