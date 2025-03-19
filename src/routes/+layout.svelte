<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	let { children } = $props();
</script>

<div class="w-screen h-screen fixed -z-10 blur-sm [&>div]:absolute [&>div]:w-full [&>div]:h-full [&>div]:bg-cover [&>div]:bg-no-repeat">
	<div id="bg-1" class="bg-[url(/bg-1.png)]"></div>
	<div id="bg-2" class="bg-[url(/bg-2.png)] bg-[0_150px]"></div>
</div>
<Header></Header>
<main class="w-screen pt-24 pb-32 min-h-[calc(100vh-10rem)]">
	{@render children()}
</main>
<Footer></Footer>
