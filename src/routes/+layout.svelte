<script lang="ts">
	import '@picocss/pico/css/pico.pumpkin.min.css';
	import '../app.css';

	let { children } = $props();
	import Header from '$lib/components/Header.svelte';
</script>

<Header />
<main>{@render children()}</main>
