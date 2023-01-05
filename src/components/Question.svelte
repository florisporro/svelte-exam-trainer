<script lang="ts">
	import type { MultipleChoiceQuestion } from '$lib/multiplechoicequestion';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let question: MultipleChoiceQuestion;
	export let canReselect: boolean = false;

	export let selectedAnswer: undefined | number;

	let popupAttachment = false;

	function selectAnswer(i: number) {
		if (selectedAnswer !== undefined && !canReselect) {
			return;
		}
		selectedAnswer = i;
		dispatch('answer', i);
	}
</script>

<div class="questioncontainer">
	<div class="question">
		<p>{@html question.text}</p>

		<ul>
			{#each question.options as option, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li
					on:click={() => selectAnswer(i)}
					class:correct={i === question.correctAnswer && selectedAnswer !== undefined}
					class:incorrect={selectedAnswer === i && i !== question.correctAnswer}
				>
					{@html option}
				</li>
			{/each}
		</ul>
	</div>
	{#if question.attachment}
		<div class="attachment">
			<img
				src="attachments/{question.attachment}"
				alt="Attachment"
				on:click={() => (popupAttachment = !popupAttachment)}
				class={popupAttachment
					? 'w-screen h-screen p-5 fixed left-0 top-0 object-contain mx-auto'
					: ''}
			/>
		</div>
	{/if}
</div>

<style lang="postcss">
	.questioncontainer {
		@apply flex flex-row flex-wrap gap-5;
	}

	.attachment {
		@apply sm:max-w-sm lg:max-w-lg object-cover object-center rounded-lg shadow-md;
	}

	.attachment img {
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
		@apply w-full bg-slate-300 px-4 py-2 rounded gap-5 cursor-pointer text-black;
		list-style: none;
	}

	li.correct {
		@apply bg-green-500;
	}

	li.incorrect {
		@apply bg-red-500;
	}
</style>
