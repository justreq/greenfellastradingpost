<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	let { children, data } = $props();
	console.log(data);
</script>

<Header></Header>
{@render children()}
