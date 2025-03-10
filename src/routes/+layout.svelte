<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	let { children } = $props();
</script>

<Header></Header>
<main class="min-w-[60vw] w-[60vw] pt-24 mx-auto min-h-[calc(100vh-10rem)]">
	{@render children()}
</main>
<Footer></Footer>
