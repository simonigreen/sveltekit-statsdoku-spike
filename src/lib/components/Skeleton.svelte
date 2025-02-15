<script lang="ts">
	export let count = 3;
</script>

<div class="skeleton-container">
	{#each Array(count) as _}
		<div class="skeleton-item"></div>
	{/each}
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
