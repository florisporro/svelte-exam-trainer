export interface MultipleChoiceQuestion {
	// The topic of the question
	topic: string;

	// The question text
	text: string;

	// An array of strings representing the multiple choice options
	options: string[];

	// The index of the correct answer in the options array
	correctAnswer: number;

	// An optional attachment to the question
	attachment?: string;
}
