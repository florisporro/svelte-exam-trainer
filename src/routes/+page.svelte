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

	let numberOfQuestionsIndex = 3;
	let numberOfQuestions: { [key: number]: number | boolean } = {
		0: 5,
		1: 10,
		2: 13,
		3: 16,
		4: 20,
		5: 40,
		6: 60,
		7: true
	};

	let passingGrade = 0.75;

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
		<button
			class="btn btn-outline"
			on:click={() => {
				quizActive = false;
			}}
		>
			Return home (abort quiz)
		</button>
	</div>
{:else}
	<div class="quizselector pb-10">
		<div class="h-24 py-12 mb-12">
			<h1 class="text-4xl text-center">Svelte Exam Trainer</h1>
		</div>
		<div class="numberOfQuestions mb-10">
			<p>Number of questions in quiz:</p>
			<input
				bind:value={numberOfQuestionsIndex}
				type="range"
				min="0"
				max="7"
				class="range"
				step="1"
			/>
			<div class="w-full flex justify-between text-xs px-2">
				<span>5</span>
				<span>10</span>
				<span>13</span>
				<span>16</span>
				<span>20</span>
				<span>40</span>
				<span>60</span>
				<span>All</span>
			</div>
		</div>
		<div class="passingGrade mb-10">
			<p>Passing grade: {Math.round(passingGrade * 100)} %</p>
			<input bind:value={passingGrade} type="range" min="0" max="1" class="range" step="0.05" />
			<div class="w-full flex justify-between text-center text-xs">
				<span>0%</span>
				<span>10%</span>
				<span>20%</span>
				<span>30%</span>
				<span>40%</span>
				<span>50%</span>
				<span>60%</span>
				<span>70%</span>
				<span>80%</span>
				<span>90%</span>
				<span>100%</span>
			</div>
		</div>
		<ul class="topics mb-10">
			{#each [...topics] as topic}
				{@const topicHistory = quizHistory.filter((q) => q.topic === topic)}
				<li>
					<button
						class="btn"
						on:click={() => {
							quiz = new QuizType(
								parsedQuestions,
								topic,
								numberOfQuestions[numberOfQuestionsIndex],
								passingGrade
							);
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
		{#if quizHistory.length > 0}
			<div class="text-center">
				<button
					class="btn btn-outline"
					on:click={() => {
						quizHistory = [];
						localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
					}}
				>
					Clear history
				</button>
			</div>
		{/if}
	</div>
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
		@apply dark:bg-green-700 bg-green-500;
	}

	ul.scores li.failure {
		@apply dark:bg-red-700 bg-red-500;
	}
</style>
