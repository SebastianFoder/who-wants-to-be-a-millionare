import { GameState } from '@/types/gamestate';

interface GameOverProps {
    gameState: GameState;
    handleNewGame: () => void;
}

export default function GameOver({ gameState, handleNewGame }: GameOverProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-gradient-to-b from-blue-900 to-blue-800 p-8 rounded-xl shadow-2xl border-2 border-blue-400 max-w-md w-full mx-4">
                <h2 className={`text-4xl font-bold mb-6 text-center ${
                    gameState.hasWon ? 'text-amber-400' : 'text-white'
                }`}>
                    {gameState.hasWon ? 'Tillykke!' : 'Spillet er slut'}
                </h2>
                
                <div className="space-y-4 mb-8">
                    <p className="text-2xl text-center text-white">
                        Du vandt:
                    </p>
                    <p className="text-3xl font-bold text-center text-amber-400">
                        {gameState.currentPrize.toLocaleString()} KR
                    </p>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleNewGame}
                        className="
                            px-8 py-3
                            bg-gradient-to-r from-green-600 to-green-500 
                            text-white font-semibold rounded-lg
                            shadow-lg border-2 border-green-400
                            transition-all duration-300
                            hover:scale-105 hover:shadow-xl
                            hover:from-green-500 hover:to-green-400
                            active:scale-100
                        "
                    >
                        Nyt Spil
                    </button>
                </div>
            </div>
        </div>
    );
}