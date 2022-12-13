import type { MultipleChoiceQuestion } from './multiplechoicequestion';

export class Quiz {
	// The list of all the questions in the quiz
	private questions: MultipleChoiceQuestion[];

	// The list of questions that the user has answered correctly
	private correctQuestions: MultipleChoiceQuestion[] = [];

	// The list of questions that the user has answered wrongly
	private incorrectQuestions: MultipleChoiceQuestion[] = [];

	// The current question that the user is answering
	private currentQuestionIndex = 0;

	// The number of questions that the quiz has
	private numberOfQuestions: number;

	// The topic of the quiz
	private topic: string;

	// The passing grade factor for the quiz
	private passingGradeFactor: number;

	constructor(
		questions: MultipleChoiceQuestion[],
		topic: string,
		numberOfQuestions: number,
		passingGradeFactor: number
	) {
		// Filter the list of questions by the specified topic
		this.questions = questions.filter((q) => q.topic === topic);

		// Pick the specified number of questions randomly, without duplicates
		this.questions = Quiz.pickRandomQuestions(this.questions, numberOfQuestions);

		this.numberOfQuestions = numberOfQuestions;
		this.topic = topic;
		this.passingGradeFactor = passingGradeFactor;
	}

	static pickRandomQuestions(
		questions: MultipleChoiceQuestion[],
		n: number
	): MultipleChoiceQuestion[] {
		if (n > questions.length) {
			throw new Error(
				'Cannot pick more questions than the number of questions available in the array'
			);
		}

		// create a copy of the input array to avoid modifying the original
		const copy = [...questions];

		// shuffle the copy to randomize the order of the elements
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}

		// return the first n questions from the shuffled array
		return copy.slice(0, n);
	}

	// Gets the current question
	public get currentQuestion(): MultipleChoiceQuestion {
		return this.questions[this.currentQuestionIndex];
	}

	public get numberOfCorrectQuestions(): number {
		return this.correctQuestions.length;
	}

	public get numberOfIncorrectQuestions(): number {
		return this.incorrectQuestions.length;
	}

	public get questionsRemaining(): number {
		return this.numberOfQuestions - this.currentQuestionIndex;
	}

	// Gets the next question in the quiz
	public nextQuestion(): MultipleChoiceQuestion | null {
		// If all the questions have been answered, return null
		if (this.currentQuestionIndex > this.numberOfQuestions) {
			return null;
		}

		this.currentQuestionIndex++;

		return this.currentQuestion;
	}

	// Checks the answer to the current question
	public checkAnswer(answer: number): boolean {
		if (answer === this.currentQuestion.correctAnswer) {
			this.correctQuestions.push(this.currentQuestion);
			return true;
		}

		this.incorrectQuestions.push(this.currentQuestion);
		return false;
	}

	// Gets the score of the quiz
	public getScore(): number {
		return this.correctQuestions.length / this.numberOfQuestions;
	}

	// Evaluates whether the user has passed the quiz
	public hasPassed(): boolean {
		return this.getScore() >= this.passingGradeFactor;
	}
}
