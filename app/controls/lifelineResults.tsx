import { GameState } from '@/types/gamestate';
import AudienceResults from '@/app/components/audienceResults';
import PhoneFriendResponse from '@/app/components/phoneFriendResponse';

interface LifelineResultsProps {
    gameState: GameState;
}

export default function LifelineResults({ gameState }: LifelineResultsProps) {
    return (
        <>
            {/* Lifeline Results */}
            <AudienceResults results={gameState.audienceResults} />
            <PhoneFriendResponse response={gameState.phoneFriendResponse} />
        </>
    );
}