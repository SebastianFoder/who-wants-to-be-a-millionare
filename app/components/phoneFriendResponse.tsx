import { GameState } from '@/types/gamestate';
import { Phone } from 'lucide-react';

interface PhoneFriendResponseProps {
    response: GameState['phoneFriendResponse'];
}

export default function PhoneFriendResponse({ response }: PhoneFriendResponseProps) {
    if (!response) return null;

    const confidenceColor = {
        'very sure': 'text-green-400',
        'pretty sure': 'text-amber-400',
        'not sure': 'text-red-400'
    }[response.confidence];

    return (
        <div className="mt-4 bg-gradient-to-b from-blue-900/80 to-blue-800/80 p-6 rounded-xl border-2 border-blue-400">
            <div className="flex items-center justify-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">
                    Din ven siger
                </h3>
            </div>

            <div className="space-y-4">
                {/* Explanation */}
                <div className="bg-blue-950/50 p-4 rounded-lg border border-blue-700">
                    <p className="text-white text-center italic">
                        &quot;{response.explanation}&quot;
                    </p>
                </div>

                {/* Answer and Confidence */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">Svar:</span>
                        <span className="text-amber-400 font-bold text-lg">
                            {response.answer.toUpperCase()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">Sikkerhed:</span>
                        <span className={`font-bold ${confidenceColor}`}>
                            {response.confidence === 'very sure' && 'Meget sikker'}
                            {response.confidence === 'pretty sure' && 'Ret sikker'}
                            {response.confidence === 'not sure' && 'Usikker'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
