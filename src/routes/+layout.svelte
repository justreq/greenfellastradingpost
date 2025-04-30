<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { page } from "$app/state";
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { dev } from "$app/environment";
	import CardProductCarousel from "$lib/components/CardProductCarousel.svelte";
	import CardProductThumbnail from "$lib/components/CardProductThumbnail.svelte";
	import type { User } from "@supabase/supabase-js";
	let { children, data } = $props();

	let getUser = supabase.auth.getUser();
	let currentUser: User | null = $state(null);

	const greenfellas = ["2b5c3202-96ca-4ce2-b9dc-b4c4661e6f7b", "bb6b222d-c0c1-426e-bd7e-447c5089f675", "ca860e56-c5ae-4cb2-8b47-7195c5ee17f4", "d7f62e3e-9dad-4551-9aff-5ad5e24c3577"];

	const moveParallaxBG = (event: Event) => {
		let bg1 = document.getElementById("bg-1");
		let bg2 = document.getElementById("bg-2");

		if (!bg1 || !bg2) return;

		let scrollAmount = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);

		bg1.style.top = `-${scrollAmount * 50}px`;
		bg2.style.top = `-${scrollAmount * 200}px`;
	};

	const updateTitle = () => {
		if (document.getElementById("title") == null) return;
		(document.getElementById("title") as HTMLImageElement).src = `/images/title-${window.innerWidth >= 1024 ? "desktop" : "mobile"}.png`;
	};

	onMount(() => {
		moveParallaxBG(new Event(""));
		updateTitle();
	});
</script>

<svelte:head>
	<title>Greenfellas Trading Post</title>
	<meta name="description" content="Get the highest quality soccer trading cards. Mags, slabs, repacks, breaks, and more available here!" />
</svelte:head>

<svelte:window on:scroll={moveParallaxBG} onresize={updateTitle} />

<div class="w-screen h-screen fixed -z-10 blur-sm [&>img]:absolute">
	<img id="bg-1" src="/images/bg-1.png" alt="" class="w-full h-full object-cover" />
	<img id="bg-2" src="/images/bg-2.png" alt="" class="mt-64 h-full object-cover" />
</div>
{#await getUser then { data: user }}
	<div class="hidden">(currentUser = user)</div>
	{#if user.user || page.url.pathname != "/"}
		<Header {getUser}></Header>
	{/if}
	<main class:pb-32={page.url.pathname != "/" || user.user} class="w-screen pt-12 lg:pt-24 min-h-[calc(100vh-9rem)] lg:min-h-[calc(100vh-10rem)] flex flex-col gap-8 sm:gap-16 xl:gap-32">
		{#if dev || (user.user && greenfellas.includes(user.user.id)) || page.route.id?.includes("login") || page.route.id?.includes("signup") || page.route.id?.includes("legal")}
			<article class:hidden={user.user || page.url.pathname != "/"} class="fixed flex gap-2 right-4 top-4 z-20 [&>*]:fancy-button [&>*]:bg-glass-sm">
				<a href="/signup">Sign Up</a>
				<a href="/login">Log In</a>
			</article>
			<section class:hidden={user.user || page.url.pathname != "/"} class="w-screen">
				<img src="/images/title-{window.innerWidth >= 1024 ? 'desktop' : 'mobile'}.png" alt="Title" id="title" class="mt-56 xl:-mt-20 mb-4 xl:mb-56 w-3/4 sm:w-1/2 lg:w-4/5 lg:max-w-[48rem] mx-auto" draggable="false" />
				<article class="px-2 sm:px-8 pb-4 w-fit mx-auto flex flex-col gap-4">
					<h2 class="text-center text-4xl sm:text-5xl lg:text-6xl text-balance">Filling your collections with high-end soccer cards</h2>
					<a href="/collection" class="bg-glass-sm fancy-button w-fit mx-auto px-4 py-2 text-lg rounded-full">Browse GTP Collection</a>
				</article>
			</section>
			{#if user.user && page.url.pathname == "/"}
				{#each ["Hottest", "New Arrivals", "Recently Viewed"] as carousel}
					<CardProductCarousel title={carousel}>
						{#each data.products as product}
							<CardProductThumbnail id={product.id} />
						{/each}
					</CardProductCarousel>
				{/each}
			{/if}
			{@render children()}
		{:else}
			<article class="flex flex-col justify-center [&>*]:text-center px-8 md:px-16 lg:px-0">
				<h2>Coming Soon...</h2>
				<p class="text-lg lg:text-xl">Create an account with us to stay up to date with GTP's latest machinations...</p>
				<a href="/signup" class="fancy-button w-fit mx-auto mt-4">Sign Up</a>
			</article>
		{/if}
	</main>
	<Footer></Footer>
{/await}
