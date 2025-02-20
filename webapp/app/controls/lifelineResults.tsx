import { GameState } from '@/types/gamestate';
import AudienceResults from '@/app/components/audienceResults';
interface LifelineResultsProps {
    gameState: GameState;
}

export default function LifelineResults({ gameState }: LifelineResultsProps) {
    return (
        <>
            {/* Lifeline Results */}
            {gameState.audienceResults && (
                <AudienceResults results={gameState.audienceResults} />
            )}

            {gameState.phoneFriendResponse && (
                <div className="mt-4">
                    <h3>Friend says:</h3>
                    <p>{gameState.phoneFriendResponse.explanation}</p>
                    <p>Answer: {gameState.phoneFriendResponse.answer.toUpperCase()}</p>
                    <p>Confidence: {gameState.phoneFriendResponse.confidence}</p>
                </div>
            )}
        </>
    );
}