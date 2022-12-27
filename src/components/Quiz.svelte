<script lang="ts">
	import type { Quiz } from '$lib/quiz';
	import type { MultipleChoiceQuestion } from '$lib/multiplechoicequestion';
	import QuestionComponent from './Question.svelte';

	export let quiz: Quiz;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<h1 class="text-4xl text-center">{quiz.topic}</h1>
<ul class="questionlist mb-4">
	{#each quiz.questions as question, i}
		<li
			class:correct={quiz.checkQuestionIndex(i) === true}
			class:incorrect={quiz.checkQuestionIndex(i) === false}
			class:active={i === quiz.currentQuestionIndex}
			on:click={() => {
				quiz.currentQuestionIndex = i;
				quiz = quiz;
			}}
		>
			{i + 1}
		</li>
	{/each}
	<li class:correct={quiz.hasPassed()} class:incorrect={!quiz.hasPassed()}>
		{Number.isNaN(quiz.getScore()) ? 0 : Math.round(quiz.getScore() * 100)} %
	</li>
</ul>
<div class="btn-group mb-6">
	<button
		class="btn"
		on:click={() => {
			quiz.previousQuestion();
			quiz = quiz;
		}}>Previous</button
	>
	<button
		class="btn"
		on:click={() => {
			quiz.nextQuestion();
			quiz = quiz;
		}}>Next</button
	>
</div>
<p>Question {quiz.currentQuestionIndex + 1} of {quiz.questions.length}</p>
<div class="question mb-4">
	{#each quiz.questions as question, i}
		{#if quiz.currentQuestionIndex === i}
			<QuestionComponent
				bind:question
				bind:selectedAnswer={quiz.answers[i]}
				on:answer={(event) => {
					quiz.setAnswer(i, event.detail);
					setTimeout(() => {
						quiz.nextQuestion();
						quiz = quiz;
					}, 800);
				}}
			/>
		{/if}
	{/each}
</div>
<div class="navigation">
	<div class="finished mb-10">
		{#if Object.entries(quiz.answers).length === quiz.questions.length}
			<button
				class="btn btn-success btn-lg"
				on:click={() => {
					dispatch('complete', quiz);
				}}
			>
				Finish and score
			</button>
		{/if}
	</div>
</div>

<style lang="postcss">
	ul.questionlist {
		@apply list-none gap-1 w-full grid grid-cols-[repeat(auto-fit,minmax(50px,1fr))];
	}

	ul.questionlist li {
		@apply grow bg-slate-300 text-center px-2 py-2 rounded gap-5 cursor-pointer text-black;
		list-style: none;
	}

	ul.questionlist li.active {
		@apply bg-blue-500;
	}

	ul.questionlist li.correct {
		@apply bg-green-500;
	}

	ul.questionlist li.incorrect {
		@apply bg-red-500;
	}
</style>
