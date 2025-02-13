<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	let { children } = $props();
</script>

<Header></Header>
<div class="flex min-h-[calc(100vh-10rem)] h-[calc(100vh-10rem)]">
	{@render children()}
</div>
<Footer></Footer>
