<script lang="ts">
	import '@picocss/pico/css/pico.pumpkin.min.css';
	import '../app.css';
	import { fade } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import { getStores } from '$app/stores';

	let { children } = $props();
	import Header from '$lib/components/Header.svelte';

	const { navigating, page } = getStores();
</script>

{#if $navigating?.from}
	<div
		class="navigation-loader"
		in:slide={{ delay: 100, duration: 12000, axis: 'x', easing: expoOut }}
	></div>
{/if}

<Header />

{#key $page.url.pathname}
	<main in:fade={{ duration: 200, delay: 100 }}>
		{@render children()}
	</main>
{/key}

<style lang="css">
	.navigation-loader {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		height: 4px;
		z-index: 50;
		background-color: #ff9500;
	}
</style>
