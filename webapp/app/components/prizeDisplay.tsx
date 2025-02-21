import { GameState } from '@/types/gamestate';

interface PrizeDisplayProps {
    gameState: GameState;
}

export default function PrizeDisplay({ gameState }: PrizeDisplayProps) {
    return (
        <div className="mb-4">
            Current Prize: {gameState.currentPrize} DKK
            {gameState.safePrize > 0 && ` (Safe: ${gameState.safePrize} DKK)`}
        </div>
    );
}