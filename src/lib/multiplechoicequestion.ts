export class MultipleChoiceQuestion {
	// The topic of the question
	public topic: string;

	// The question text
	public text: string;

	// An array of strings representing the multiple choice options
	public options: string[];

	// The index of the correct answer in the options array
	public correctAnswer: number;

	// An optional attachment to the question
	public attachment?: string | undefined;

	constructor(
		topic: string,
		text: string,
		options: string[],
		correctAnswer: number,
		attachment?: string
	) {
		this.topic = topic;
		this.text = text;
		this.options = options;
		this.correctAnswer = correctAnswer;
		this.attachment = attachment;
	}
}
