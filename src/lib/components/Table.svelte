<script lang="ts">
	import { format } from 'date-fns';
	import { secondsToMinutesAndSeconds } from '$lib/utils/time';

	export let puzzleCompletions: Array<{
		puzzle_date: Date;
		completionTime: number;
	}>;
</script>

<table>
	<thead>
		<tr>
			<th>Date</th>
			<th>Completion Time</th>
		</tr>
	</thead>
	<tbody>
		{#each puzzleCompletions as puzzleCompletion}
			<tr>
				<td>{format(puzzleCompletion.puzzle_date, 'dd/MM/yyyy')}</td>
				<td>{secondsToMinutesAndSeconds(puzzleCompletion.completionTime)}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid #ddd;
	}
</style>
