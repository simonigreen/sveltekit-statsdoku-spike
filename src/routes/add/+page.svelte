<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();

	let submitting = $state(false);
</script>

<div class="container">
	<h1>Add today's Sudoku completion time</h1>

	<form
		method="POST"
		use:enhance={() => {
			submitting = true;

			return async ({ update }) => {
				await update();
				submitting = false;
			};
		}}
	>
		<div>
			<label>
				Minutes
				<input
					name="minutes"
					type="number"
					min="0"
					max="59"
					required
					autocomplete="off"
					disabled={submitting}
				/>
			</label>
			<label>
				Seconds
				<input
					name="seconds"
					type="number"
					min="1"
					max="59"
					required
					autocomplete="off"
					disabled={submitting}
				/>
			</label>
		</div>
		<button type="submit" disabled={submitting}>
			<span>
				{submitting ? 'Saving...' : 'Submit'}
			</span>
		</button>
	</form>

	{#if form?.success}
		<div class="success">
			{form.message}. See all your stats on the <a href="/stats">stats page</a>.
		</div>
	{:else if form?.error}
		<div class="error">
			{form.error}. See all your stats on the <a href="/stats">stats page</a>.
		</div>
	{/if}
</div>

<style>
	form {
		max-width: 400px;
	}

	.success {
		border: 2px solid #4caf50;
		background-color: rgba(76, 175, 80, 0.1);
		padding: 1rem;
		margin-bottom: 1rem;
		border-radius: 4px;
	}

	.error {
		border: 2px solid #f44336;
		background-color: rgba(244, 67, 54, 0.1);
		padding: 1rem;
		margin-bottom: 1rem;
		border-radius: 4px;
	}

	button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
</style>
