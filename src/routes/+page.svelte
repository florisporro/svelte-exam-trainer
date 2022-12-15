<script lang="ts">
	import questions from '../data.json';

	const parsedQuestions = questions.map((q) => {
		return {
			topic: q.Topic,
			text: q.Question,
			options: q.AnswersList,
			correctAnswer: q.CorrectAnswer - 1
		};
	});

	const topics = new Set(parsedQuestions.map((q) => q.topic));

	import Quiz from '../components/Quiz.svelte';
	import { Quiz as QuizType } from '$lib/quiz';

	import { browser } from '$app/environment';

	let localStorageValue;
	if (browser) {
		localStorageValue = localStorage.getItem('quizHistory');
	}
	let quizHistory: { topic: string; score: number; passingGradeFactor: number }[] =
		localStorageValue ? JSON.parse(localStorageValue) : [];

	let quizActive = false;

	function finishQuiz(quiz: QuizType) {
		quizHistory.push({
			topic: quiz.topic,
			score: quiz.getScore(),
			passingGradeFactor: quiz.passingGradeFactor
		});
		quizHistory = quizHistory;
		localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
		quizActive = false;
	}

	$: console.log(quizHistory);

	let quiz: QuizType;
</script>

{#if quizActive}
	<div class="quiz mb-10">
		<Quiz
			{quiz}
			on:complete={(event) => {
				finishQuiz(event.detail);
			}}
		/>
	</div>
	<button
		class="btn btn-outline"
		on:click={() => {
			quizActive = false;
		}}
	>
		Return home (abort quiz)
	</button>
{:else}
	<ul class="topics">
		{#each [...topics] as topic}
			{@const topicHistory = quizHistory.filter((q) => q.topic === topic)}
			<li>
				<button
					class="btn"
					on:click={() => {
						quiz = new QuizType(parsedQuestions, topic, 3, 0.75);
						quizActive = true;
					}}
				>
					{topic}
				</button>
				{#if topicHistory.length > 0}
					<ul class="scores">
						{#each topicHistory as history}
							<li class={history.passingGradeFactor <= history.score ? 'success' : 'failure'}>
								{Math.round(history.score * 100)} %
							</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ul>
{/if}

<style lang="postcss">
	ul.topics {
		@apply list-none grid grid-cols-1 gap-4 text-center;
	}

	ul.topics li {
		@apply text-center mx-auto;
	}

	ul.scores {
		@apply list-none flex flex-row gap-1 w-full text-center mx-auto mt-2;
	}

	ul.scores li {
		@apply text-center p-1 rounded gap-2 text-white;
		list-style: none;
	}

	ul.scores li.success {
		@apply bg-green-700;
	}

	ul.scores li.failure {
		@apply bg-red-700;
	}
</style>
