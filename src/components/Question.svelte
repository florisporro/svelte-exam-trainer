<script lang="ts">
	import type { MultipleChoiceQuestion } from '$lib/multiplechoicequestion';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let question: MultipleChoiceQuestion;
	export let canReselect: boolean = false;

	export let selectedAnswer: undefined | number;

	function selectAnswer(i: number) {
		if (selectedAnswer !== undefined && !canReselect) {
			return;
		}
		selectedAnswer = i;
		dispatch('answer', i);
	}
</script>

<p class="mb-10 text-white text-xl">{@html question.text}</p>

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

<style lang="postcss">
	p {
		@apply text-xl leading-relaxed;
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
