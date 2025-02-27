import { GameState } from '@/types/gamestate';
import { BarChart3 } from 'lucide-react';

interface AudienceResultsProps {
    results: GameState['audienceResults'];
}

export default function AudienceResults({ results }: AudienceResultsProps) {
    if (!results) return null;

    const maxPercentage = Math.max(...Object.values(results));

    return (
        <div className="mt-4 bg-gradient-to-b from-blue-900/80 to-blue-800/80 p-6 rounded-xl border-2 border-blue-400">
            <div className="flex items-center justify-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">
                    Publikum har stemt
                </h3>
            </div>

            <div className="space-y-3">
                {Object.entries(results).map(([answer, percentage]) => (
                    percentage > 0 && (
                        <div key={answer} className="space-y-1">
                            <div className="flex justify-between text-sm text-white">
                                <span className="font-semibold">
                                    {answer.toUpperCase()}
                                </span>
                                <span className="font-bold text-amber-400">
                                    {percentage}%
                                </span>
                            </div>
                            <div className="h-2 bg-blue-950 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                        percentage === maxPercentage 
                                            ? 'bg-gradient-to-r from-amber-500 to-amber-400' 
                                            : 'bg-gradient-to-r from-blue-600 to-blue-500'
                                    }`}
                                    style={{ 
                                        width: `${percentage}%`,
                                        transition: 'width 1s ease-out'
                                    }}
                                />
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}