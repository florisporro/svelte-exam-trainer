<script lang="ts">
	import type { MultipleChoiceQuestion } from '$lib/multiplechoicequestion';

	interface Props {
		question: MultipleChoiceQuestion;
		selectedAnswer: undefined | number;
		onanswer: (answer: number) => void;
		canReselect?: boolean;
	}

	let { question, selectedAnswer, onanswer, canReselect = false }: Props = $props();

	let popupAttachment = $state(false);

	function selectAnswer(i: number) {
		if (selectedAnswer !== undefined && !canReselect) {
			return;
		}
		onanswer(i);
	}
</script>

<div class="questioncontainer">
	<div class="question">
		<p>{@html question.text}</p>

		<ul>
			{#each question.options as option, i}
				<li>
					<button
						onclick={() => selectAnswer(i)}
						class:correct={i === question.correctAnswer && selectedAnswer !== undefined}
						class:incorrect={selectedAnswer === i && i !== question.correctAnswer}
					>
						{@html option}
					</button>
				</li>
			{/each}
		</ul>
	</div>
	{#if question.attachment}
		<div class="attachment">
			<button onclick={() => (popupAttachment = !popupAttachment)}>
				<img
					src="attachments/{question.attachment}"
					alt="Attachment"
					class={popupAttachment
						? 'w-screen h-screen p-5 fixed left-0 top-0 object-contain mx-auto'
						: ''}
				/>
			</button>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference '../app.css';

	.questioncontainer {
		@apply flex flex-row flex-wrap gap-5;
	}

	.attachment {
		@apply sm:max-w-sm lg:max-w-lg object-cover object-center rounded-lg shadow-md;
	}

	.attachment button {
		@apply cursor-pointer;
	}

	.question {
		@apply flex-1;
	}

	p {
		@apply text-xl leading-relaxed mb-10 dark:text-white;
	}

	ul {
		@apply list-none grid grid-cols-1 gap-4;
	}

	li {
		list-style: none;
	}

	li button {
		@apply w-full text-left bg-slate-300 px-4 py-2 rounded-sm gap-5 cursor-pointer text-black;
	}

	li button.correct {
		@apply bg-green-500;
	}

	li button.incorrect {
		@apply bg-red-500;
	}
</style>
