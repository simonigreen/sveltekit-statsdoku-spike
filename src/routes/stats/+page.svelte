<script lang="ts">
	import { format } from 'date-fns';
	import { secondsToMinutesAndSeconds } from '$lib/utils/time';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="container">
	<h1>Stats</h1>

	{#await data.puzzleCompletions}
		<div class="skeleton-container">
			<div class="skeleton-item"></div>
			<div class="skeleton-item"></div>
			<div class="skeleton-item"></div>
		</div>
	{:then completions}
		{#if completions.length === 0}
			<p>No stats available</p>
		{:else}
			<table>
				<thead>
					<tr>
						<th>Date</th>
						<th>Completion Time</th>
					</tr>
				</thead>
				<tbody>
					{#each completions as puzzleCompletion}
						<tr>
							<td>{format(puzzleCompletion.puzzle_date, 'dd/MM/yyyy')}</td>
							<td>{secondsToMinutesAndSeconds(puzzleCompletion.completionTime)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	{/await}
</div>

<style>
	.skeleton-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.skeleton-item {
		height: 2.5rem;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
		border-radius: 4px;
	}

	@keyframes loading {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}
</style>
