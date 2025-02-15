<script lang="ts">
	import Skeleton from '$lib/components/Skeleton.svelte';
	import Table from '$lib/components/Table.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="container">
	<h1>Stats</h1>

	{#await data.puzzleCompletions}
		<Skeleton count={3} />
	{:then completions}
		{#if completions.length === 0}
			<p>No stats available</p>
		{:else}
			<Table puzzleCompletions={completions} />
		{/if}
	{/await}
</div>
