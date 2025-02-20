import { GameState } from '@/types/gamestate';

interface AudienceResultsProps {
    results: GameState['audienceResults'];
}

export default function AudienceResults({ results }: AudienceResultsProps) {
    return (
        <div className="mt-4">
            <h3>Audience Results:</h3>
            {results && Object.entries(results).map(([answer, percentage]) => (
                <div key={answer}>
                    {answer.toUpperCase()}: {percentage}%
                </div>
            ))}
        </div>
    );
}