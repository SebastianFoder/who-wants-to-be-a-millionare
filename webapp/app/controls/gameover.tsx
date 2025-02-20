import { GameState } from '@/types/gamestate';

interface GameOverProps {
    gameState: GameState;
    handleNewGame: () => void;
}

export default function GameOver({ gameState, handleNewGame }: GameOverProps) {
    return (
        <div className="mt-8 text-center">
            <h2 className="text-3xl mb-4">
                {gameState.hasWon ? 'Congratulations!' : 'Game Over'}
            </h2>
            <p className="text-xl">
                Final Prize: {gameState.currentPrize} DKK
            </p>
            <button onClick={handleNewGame} className="p-2 bg-blue-500 text-white rounded">
                New Game
            </button>
        </div>
    );
}