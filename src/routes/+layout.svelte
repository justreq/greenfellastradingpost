<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { page } from "$app/state";
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	let { children } = $props();

	const greenfellas = ["2b5c3202-96ca-4ce2-b9dc-b4c4661e6f7b", "bb6b222d-c0c1-426e-bd7e-447c5089f675", "ca860e56-c5ae-4cb2-8b47-7195c5ee17f4", "d7f62e3e-9dad-4551-9aff-5ad5e24c3577"];

	const moveParallaxBG = (event: Event) => {
		let bg1 = document.getElementById("bg-1");
		let bg2 = document.getElementById("bg-2");

		if (!bg1 || !bg2) return;

		let scrollAmount = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);

		bg1.style.top = `-${scrollAmount * 50}px`;
		bg2.style.top = `-${scrollAmount * 200}px`;
	};

	onMount(() => {
		moveParallaxBG(new Event(""));
	});
</script>

<svelte:head>
	<title>Greenfellas Trading Post</title>
	<meta name="description" content="Get the highest quality soccer trading cards. Mags, slabs, repacks, breaks, and more available here!" />
</svelte:head>

<svelte:window on:scroll={moveParallaxBG} />

<div class="w-screen h-screen fixed -z-10 blur-sm [&>img]:absolute">
	<img id="bg-1" src="/images/bg-1.png" alt="" class="w-full h-full object-cover" />
	<img id="bg-2" src="/images/bg-2.png" alt="" class="mt-64 h-full object-cover" />
</div>
<Header></Header>
<main class="w-screen pt-12 lg:pt-24 pb-32 min-h-[calc(100vh-9rem)] lg:min-h-[calc(100vh-10rem)] flex flex-col gap-8 sm:gap-16 xl:gap-32">
	{#await supabase.auth.getUser() then { data }}
		{#if (data.user && greenfellas.includes(data.user.id)) || page.route.id?.includes("login") || page.route.id?.includes("signup") || page.route.id?.includes("legal")}
			{@render children()}
		{:else}
			<article class="flex flex-col justify-center [&>*]:text-center px-8 md:px-16 lg:px-0">
				<h2>Coming Soon...</h2>
				<p class="text-lg lg:text-xl">Create an account with us to stay up to date with GTP's latest machinations...</p>
				<a href="/signup" class="fancy-button w-fit mx-auto mt-4">Sign Up</a>
			</article>
		{/if}
	{/await}
</main>
<Footer></Footer>
