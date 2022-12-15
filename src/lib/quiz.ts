import type { MultipleChoiceQuestion } from './multiplechoicequestion';

export class Quiz {
	// The list of all the questions in the quiz
	questions: MultipleChoiceQuestion[];

	// The current question that the user is answering
	currentQuestionIndex = 0;

	// The list of questions that the user has answered
	answers: { [key: number]: number } = {};

	// The topic of the quiz
	topic: string;

	// The passing grade factor for the quiz
	passingGradeFactor: number;

	constructor(
		questions: MultipleChoiceQuestion[],
		topic: string,
		numberOfQuestions: number | boolean,
		passingGradeFactor: number
	) {
		// Filter the list of questions by the specified topic
		this.questions = questions.filter((q) => q.topic === topic);

		// Pick the specified number of questions randomly, without duplicates
		this.questions = Quiz.pickRandomQuestions(
			this.questions,
			numberOfQuestions === true ? this.questions.length : (numberOfQuestions as number)
		);

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

	public get questionsRemaining(): number {
		return this.questions.length - Object.entries(this.answers).length;
	}

	public previousQuestion(): MultipleChoiceQuestion | null {
		if (this.currentQuestionIndex === 0) {
			return null;
		}

		this.currentQuestionIndex--;

		return this.currentQuestion;
	}

	// Gets the next question in the quiz
	public nextQuestion(): MultipleChoiceQuestion | null {
		// If all the questions have been answered, return null
		if (this.currentQuestionIndex >= this.questions.length - 1) {
			return null;
		}

		this.currentQuestionIndex++;

		return this.currentQuestion;
	}

	// Sets the answer for the question
	public setAnswer(question: number, answer: number): void {
		this.answers[question] = answer;
	}

	// Checks if the answer is correct
	public checkQuestionIndex(index: number): boolean | null {
		if (this.answers[index] === undefined) return null;
		return this.questions[index].correctAnswer === this.answers[index];
	}

	// Gets the score of the quiz
	public getScore(): number {
		let score = 0;

		for (const [index, answer] of Object.entries(this.answers)) {
			if (this.questions[Number(index)].correctAnswer === answer) {
				score++;
			}
		}

		return score / Object.entries(this.answers).length;
	}

	// Evaluates whether the user has passed the quiz
	public hasPassed(): boolean {
		if (Number.isNaN(this.getScore())) return true;
		return this.getScore() >= this.passingGradeFactor;
	}
}
