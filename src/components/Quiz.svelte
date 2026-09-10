<script lang="ts">
	import type { Quiz } from '$lib/quiz.svelte';
	import QuestionComponent from './Question.svelte';

	interface Props {
		quiz: Quiz;
		oncomplete: (quiz: Quiz) => void;
	}

	let { quiz, oncomplete }: Props = $props();
</script>

<h1 class="text-4xl text-center">{quiz.topic}</h1>
<ul class="questionlist mb-4">
	{#each quiz.questions as _question, i}
		<li>
			<button
				class:correct={quiz.checkQuestionIndex(i) === true}
				class:incorrect={quiz.checkQuestionIndex(i) === false}
				class:active={i === quiz.currentQuestionIndex}
				onclick={() => (quiz.currentQuestionIndex = i)}
			>
				{i + 1}
			</button>
		</li>
	{/each}
	<li>
		<span class:correct={quiz.hasPassed()} class:incorrect={!quiz.hasPassed()}>
			{Number.isNaN(quiz.getScore()) ? 0 : Math.round(quiz.getScore() * 100)} %
		</span>
	</li>
</ul>
<div class="join mb-6">
	<button class="btn btn-neutral join-item" onclick={() => quiz.previousQuestion()}>Previous</button
	>
	<button class="btn btn-neutral join-item" onclick={() => quiz.nextQuestion()}>Next</button>
</div>
<p>Question {quiz.currentQuestionIndex + 1} of {quiz.questions.length}</p>
<div class="question mb-4">
	{#each quiz.questions as question, i}
		{#if quiz.currentQuestionIndex === i}
			<QuestionComponent
				{question}
				selectedAnswer={quiz.answers[i]}
				onanswer={(answer) => {
					quiz.setAnswer(i, answer);
					setTimeout(() => quiz.nextQuestion(), 800);
				}}
			/>
		{/if}
	{/each}
</div>
<div class="navigation">
	<div class="finished mb-10">
		{#if Object.entries(quiz.answers).length === quiz.questions.length}
			<button class="btn btn-success btn-lg" onclick={() => oncomplete(quiz)}>
				Finish and score
			</button>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference '../app.css';

	ul.questionlist {
		@apply list-none gap-1 w-full grid grid-cols-[repeat(auto-fit,minmax(50px,1fr))];
	}

	ul.questionlist li {
		list-style: none;
	}

	ul.questionlist :is(button, span) {
		@apply block w-full grow bg-slate-300 text-center py-1 rounded-sm gap-5 cursor-pointer text-black text-sm;
	}

	ul.questionlist .active {
		@apply bg-blue-500;
	}

	ul.questionlist .correct {
		@apply bg-green-500;
	}

	ul.questionlist .incorrect {
		@apply bg-red-500;
	}
</style>
