import { GameState, getInitialGameState, Level, PRIZE_LEVELS } from '@/types/gamestate';
import { QuizQuestion } from '@/types/quiz';

type GameAction = 
    | { type: 'START_GAME'; questions: QuizQuestion[] }
    | { type: 'ANSWER_QUESTION'; answer: 'a' | 'b' | 'c' | 'd' }
    | { type: 'USE_LIFELINE'; lifeline: keyof GameState['lifelines'] }
    | { type: 'QUIT_GAME' }
    | { type: 'NEXT_QUESTION' };

interface PhoneFriendResponse {
    answer: string;
    confidence: 'very sure' | 'pretty sure' | 'not sure';
    explanation: string;
}

const phoneFriendResponses: Record<string, string[]> = {
	"very sure": [
		"Jeg er 100% sikker, stol på mig.",
		"Jeg kender svaret uden tvivl.",
		"Ingen grund til at tænke, jeg ved det.",
		"Det her er jeg helt sikker på.",
		"Jeg ville satse alt på det her.",
		"Jeg har set det her før, jeg er sikker.",
		"Tro mig, jeg ved det.",
		"Jeg føler mig 110% sikker på det.",
		"Gå med det, det er det rigtige.",
		"Jeg har aldrig været mere sikker.",
		"Jeg har hørt det mange gange før.",
		"Ingen tvivl, det her er korrekt.",
		"Det her er jeg fuldstændig sikker på.",
		"Jeg kan sige det med lukkede øjne.",
		"Jeg har ingen tvivl i mit sind.",
		"Det er et faktum, jeg ved det.",
		"Jeg har set det i en quiz før.",
		"Jeg ville aldrig tvivle på det her.",
		"Mit svar er endegyldigt.",
		"Jeg er lige så sikker, som jeg er på mit navn.",
		"Jeg kunne skrive det her i sten.",
		"Jeg har set det i en bog før.",
		"Jeg er 200% sikker.",
		"Det her kan du stole på.",
		"Jeg ved det med sikkerhed."
	],
	"pretty sure": [
		"Jeg er ret sikker, men ikke 100%.",
		"Det lyder meget bekendt, jeg tror jeg ved det.",
		"Jeg har en stærk fornemmelse af, hvad det er.",
		"Det her virker som det rigtige valg.",
		"Jeg ville nok vælge det, men dobbeltjek gerne.",
		"Jeg mener at have hørt det før.",
		"Jeg hælder mest til én mulighed.",
		"Det lyder som det mest logiske valg.",
		"Jeg har en god mavefornemmelse for det.",
		"Jeg føler mig ret overbevist.",
		"Jeg er temmelig sikker på det.",
		"Det kunne meget vel være det rigtige.",
		"Jeg har set det før, men jeg er ikke helt sikker.",
		"Jeg tror, jeg ved det, men tag det med et gran salt.",
		"Jeg har hørt det nævnt, men husker det ikke præcist.",
		"Jeg ville nok gå med det, men jeg kan tage fejl.",
		"Det lyder rigtigt, men jeg er lidt usikker.",
		"Jeg har en stærk idé om, hvad det er.",
		"Jeg hælder klart til en mulighed.",
		"Jeg ville nok vælge det, men ikke satse alt på det.",
		"Jeg tror, det er rigtigt, men jeg ville stadig tænke mig om.",
		"Jeg har en mistanke om svaret.",
		"Jeg ville vælge det, hvis jeg skulle gætte kvalificeret.",
		"Det virker som den bedste mulighed.",
		"Jeg har en anelse om, hvad det kunne være."
	],
	"not sure": [
		"Jeg er virkelig i tvivl.",
		"Det her aner jeg faktisk ikke.",
		"Jeg kan kun gætte på det.",
		"Jeg har aldrig hørt om det før.",
		"Jeg ville nok tage et vildt gæt.",
		"Jeg er ikke den rette at spørge om det her.",
		"Jeg har ingen anelse, desværre.",
		"Jeg kunne forsøge at gætte, men er usikker.",
		"Det ringer en lille klokke, men jeg ved det ikke.",
		"Jeg ville nok bruge en anden livline.",
		"Det her er helt nyt for mig.",
		"Jeg føler mig ikke tryg ved at svare på det her.",
		"Jeg ville nok spørge en ekspert.",
		"Jeg har aldrig set det her før.",
		"Jeg ville nok gå med et tilfældigt svar.",
		"Det her er langt uden for mit felt.",
		"Jeg kan prøve at gætte, men chancen for fejl er stor.",
		"Jeg aner det simpelthen ikke.",
		"Det her er et svært spørgsmål for mig.",
		"Jeg har intet bud på det her.",
		"Jeg ville nok tage en anden livline i brug.",
		"Jeg har intet grundlag for at svare på det her.",
		"Jeg kan ikke hjælpe dig med det her.",
		"Jeg har desværre ikke noget godt svar.",
		"Det her har jeg aldrig hørt om før."
	]
}      

/**
 * Manages the game state and actions
 */
export class GameManager {
    private state: GameState;
    private readonly onStateChange: (state: GameState) => void;
    private questionPool: Map<number, QuizQuestion[]>;

    constructor(onStateChange: (state: GameState) => void) {
        this.state = getInitialGameState();
        this.onStateChange = onStateChange;
        this.questionPool = new Map();
    }

    /**
     * Organizes questions by their money sum and picks random questions for each level
     */
    private organizeQuestions(questions: QuizQuestion[]): QuizQuestion[] {
        // Group questions by money sum
        this.questionPool = questions.reduce((pool, question) => {
            const currentPool = pool.get(question.moneysum) || [];
            pool.set(question.moneysum, [...currentPool, question]);
            return pool;
        }, new Map<number, QuizQuestion[]>());

        // Pick one random question for each level
        return Object.entries(PRIZE_LEVELS).map(([, moneysum]) => {
            const questionsForLevel = this.questionPool.get(moneysum);
            if (!questionsForLevel || questionsForLevel.length === 0) {
                throw new Error(`No questions found for prize level ${moneysum}`);
            }
            const randomIndex = Math.floor(Math.random() * questionsForLevel.length);
            return questionsForLevel[randomIndex];
        });
    }

    /**
     * Updates the game state and notifies listeners
     */
    private setState(newState: Partial<GameState>) {
        this.state = { ...this.state, ...newState };
        this.onStateChange(this.state);
    }

    /**
     * Handles game actions
     */
    public dispatch(action: GameAction) {
        switch (action.type) {
            case 'START_GAME':
                this.handleStartGame(action.questions);
                break;
            case 'ANSWER_QUESTION':
                this.handleAnswer(action.answer);
                break;
            case 'USE_LIFELINE':
                this.handleLifeline(action.lifeline);
                break;
            case 'QUIT_GAME':
                this.handleQuit();
                break;
            case 'NEXT_QUESTION':
                this.handleNextQuestion();
                break;
        }
    }

    /**
     * Initializes a new game with randomly selected questions
     */
    private handleStartGame(questions: QuizQuestion[]) {
        const initialState = getInitialGameState();
        const selectedQuestions = this.organizeQuestions(questions);
        
        this.setState({
            ...initialState,
            questions: selectedQuestions,
            currentQuestion: selectedQuestions[0]
        });
    }

    /**
     * Processes the player's answer
     */
    private handleAnswer(answer: string) {
        const { currentQuestion, level } = this.state;
        if (!currentQuestion || this.state.isGameOver) return;

        const isCorrect = answer === currentQuestion.correct_answer;

        if (isCorrect) {
            // Update prize money and safe prize
            const currentPrize = this.state.getPrizeMoney(level);
            const safePrize = this.state.getSafePrizeMoney(level);

            this.setState({
                currentPrize,
                safePrize: Math.max(this.state.safePrize, safePrize),
                hasWon: level === 15
            });

            if (level === 15) {
                // Player won the game
                this.setState({ isGameOver: true });
            }

            this.handleNextQuestion();
        } else {
            // Wrong answer - game over
            this.setState({
                isGameOver: true,
                currentPrize: this.state.safePrize
            });
        }
    }

    /**
     * Moves to the next question
     */
    private handleNextQuestion() {
        const nextLevel = (this.state.level + 1) as Level;
        if (nextLevel > 15) return;

        const nextQuestion = this.state.questions[nextLevel - 1];
        
        this.setState({
            level: nextLevel,
            currentQuestion: nextQuestion,
            currentQuestionIndex: nextLevel - 1,
            activeAnswers: {
                a: true,
                b: true,
                c: true,
                d: true
            },
            audienceResults: undefined,
            phoneFriendResponse: undefined
        });
    }

    /**
     * Handles lifeline usage
     */
    private handleLifeline(lifeline: keyof GameState['lifelines']) {
        if (!this.state.lifelines[lifeline]) return;

        const updatedLifelines = {
            ...this.state.lifelines,
            [lifeline]: false
        };

        this.setState({ lifelines: updatedLifelines });

        if (lifeline === 'fiftyFifty') {
            this.handleUseFiftyFifty();
        }

        if (lifeline === 'phoneAFriend') {
            this.handleUsePhoneAFriend();
        }

        if (lifeline === 'askTheAudience') {
            this.handleUseAskTheAudience();
        }

    }

    private handleUsePhoneAFriend() {
        if (!this.state.currentQuestion) return;

        // Disable the phone a friend lifeline
        this.setState({
            lifelines: {
                ...this.state.lifelines,
                phoneAFriend: false
            }
        });

        const response = this.generatePhoneFriendResponse(
            this.state.currentQuestion.correct_answer,
            this.state.level,
            this.state.activeAnswers
        );

        this.setState({
            phoneFriendResponse: response
        });
    }

    /**
     * Handles the Ask the Audience lifeline
     * Generates audience responses based on game level and active answers
     */
    private handleUseAskTheAudience() {
        if (!this.state.currentQuestion) return;

        // Disable the ask the audience lifeline
        this.setState({
            lifelines: {
                ...this.state.lifelines,
                askTheAudience: false
            }
        });

        // Get active answers
        const activeAnswers = Object.entries(this.state.activeAnswers)
            .filter(([, isActive]) => isActive)
            .map(([answer]) => answer);

        // Calculate correct answer probability based on level
        const correctAnswerProbability = this.getAudienceProbability(this.state.level);
        
        // Generate 100 audience votes
        const audienceVotes = this.generateAudienceVotes(
            this.state.currentQuestion.correct_answer,
            activeAnswers,
            correctAnswerProbability
        );

        // Update state with audience results
        this.setState({
            audienceResults: audienceVotes
        });
    }

    /**
     * Handles the fifty-fifty lifeline
     */
    private handleUseFiftyFifty() {
        if (!this.state.currentQuestion) return;

        // Disable the fifty-fifty lifeline
        this.setState({
            lifelines: {
                ...this.state.lifelines,
                fiftyFifty: false
            }
        });

        // Get all incorrect answers
        const incorrectAnswers = ['a', 'b', 'c', 'd'].filter(
            answer => answer !== this.state.currentQuestion?.correct_answer
        );

        // Randomly select two incorrect answers to remove
        const answersToRemove = incorrectAnswers
            .sort(() => Math.random() - 0.5)  // Shuffle array
            .slice(0, 2);                     // Take first two

        // Update active answers, setting selected answers to false
        this.setState({
            activeAnswers: {
                ...this.state.activeAnswers,
                [answersToRemove[0]]: false,
                [answersToRemove[1]]: false
            }
        });
    }

    /**
     * Calculates the probability of the audience knowing the correct answer based on level
     */
    private getAudienceProbability(level: Level): number {
        // Probability decreases as level increases
        // Level 1-5: 80-70%
        // Level 6-10: 65-55%
        // Level 11-15: 50-30%
        if (level <= 5) {
            return 0.8 - (level - 1) * 0.02; // 80% -> 70%
        } else if (level <= 10) {
            return 0.65 - (level - 6) * 0.02; // 65% -> 55%
        } else {
            return 0.5 - (level - 11) * 0.04; // 50% -> 30%
        }
    }

    /**
     * Generates audience votes based on probability and active answers
     */
    private generateAudienceVotes(
        correctAnswer: string,
        activeAnswers: string[],
        correctProbability: number
    ): Record<string, number> {
        const votes: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
        const totalVotes = 100;

        // Initialize with zeros for inactive answers
        Object.keys(votes).forEach(answer => {
            if (!activeAnswers.includes(answer)) {
                votes[answer] = 0;
            }
        });

        // Calculate wrong answer probability distribution
        const wrongProbability = (1 - correctProbability) / (activeAnswers.length - 1);

        console.log(wrongProbability);

        // Generate 100 votes
        for (let i = 0; i < totalVotes; i++) {
            const random = Math.random();
            
            if (random < correctProbability) {
                // Vote for correct answer
                votes[correctAnswer]++;
            } else {
                // Randomly distribute remaining votes among wrong active answers
                const wrongAnswers = activeAnswers.filter(answer => answer !== correctAnswer);
                const randomWrongAnswer = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
                votes[randomWrongAnswer]++;
            }
        }

        return votes;
    }

    /**
     * Generates a simulated phone-a-friend response
     */
    private generatePhoneFriendResponse(
        correctAnswer: string,
        level: Level,
        activeAnswers: Record<string, boolean>
    ): PhoneFriendResponse {
        // Calculate base probability of correct answer based on level
        const baseProbability = this.getPhoneFriendProbability(level);
        
        // Determine if friend gives correct answer
        const givesCorrectAnswer = Math.random() < baseProbability;
        
        // Get available answers
        const availableAnswers = Object.entries(activeAnswers)
            .filter(([, isActive]) => isActive)
            .map(([answer]) => answer);
        
        // Select answer (either correct or random wrong answer)
        const selectedAnswer = givesCorrectAnswer 
            ? correctAnswer
            : availableAnswers.filter(a => a !== correctAnswer)[
                Math.floor(Math.random() * (availableAnswers.length - 1))
            ];

        // Determine confidence level based on correctness and level
        const confidence = this.getConfidenceLevel(givesCorrectAnswer, level);

        // Generate explanation
        const explanation = this.generateExplanation(confidence);

        return {
            answer: selectedAnswer,
            confidence,
            explanation
        };
    }

    /**
     * Calculates probability of friend knowing the correct answer based on level
     */
    private getPhoneFriendProbability(level: Level): number {
        if (level <= 5) {
            return 0.9 - (level - 1) * 0.02;     // 90% -> 82%
        } else if (level <= 10) {
            return 0.8 - (level - 6) * 0.03;     // 80% -> 65%
        } else {
            return 0.6 - (level - 11) * 0.05;    // 60% -> 40%
        }
    }

    /**
     * Determines the confidence level of the friend's response
     */
    private getConfidenceLevel(
        isCorrect: boolean,
        level: Level
    ): PhoneFriendResponse['confidence'] {
        if (level <= 5) {
            return isCorrect ? 'very sure' : 'pretty sure';
        } else if (level <= 10) {
            return isCorrect ? 'pretty sure' : 'not sure';
        } else {
            return 'not sure';
        }
    }

    /**
     * Generates a realistic-sounding explanation
     */
    private generateExplanation(
        confidence: PhoneFriendResponse['confidence']
    ): string {
        const explanationPool = phoneFriendResponses[confidence];
        return explanationPool[Math.floor(Math.random() * explanationPool.length)];
    }

    /**
     * Handles player quitting the game
     */
    private handleQuit() {
        this.setState({
            isGameOver: true,
            currentPrize: this.state.getPrizeMoney(this.state.level)
        });
    }

    /**
     * Gets current game state
     */
    public getState(): GameState {
        return this.state;
    }
}

/**
 * Example usage:
 * 
 * const gameManager = new GameManager((state) => {
 *     // Update UI based on new state
 *     console.log('Game state updated:', state);
 * });
 * 
 * // Start new game
 * gameManager.dispatch({ type: 'START_GAME', questions: quizQuestions });
 * 
 * // Answer question
 * gameManager.dispatch({ type: 'ANSWER_QUESTION', answer: 'a' });
 * 
 * // Use lifeline
 * gameManager.dispatch({ type: 'USE_LIFELINE', lifeline: 'fiftyFifty' });
 * 
 * // Quit game
 * gameManager.dispatch({ type: 'QUIT_GAME' });
 */ 