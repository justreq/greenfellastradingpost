<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import Popup from "$lib/components/Popup.svelte";
	import { cartContents, globalPopupState } from "$lib/globals";
	import { invalidate } from "$app/navigation";
	import { isSuperUser } from "$lib/supabaseClient";
	import { dev } from "$app/environment";
	let { children } = $props();
	let { session, supabase, user } = $derived(page.data);

	const moveParallaxBG = (event: Event) => {
		let bg1 = document.getElementById("bg-1");
		let bg2 = document.getElementById("bg-2");

		if (!bg1 || !bg2) return;

		let scrollAmount = window.pageYOffset / (document.body.scrollHeight - innerHeight);

		bg1.style.top = `-${50 + scrollAmount * 50}px`;
		bg2.style.top = `-${50 + scrollAmount * 50}px`;
	};

	onMount(() => {
		moveParallaxBG(new Event(""));

		if (localStorage.getItem("cart") != null) $cartContents = JSON.parse(localStorage.getItem("cart") as string).product_ids;

		const { data } = supabase.auth.onAuthStateChange(async (_: any, newSession: { expires_at: number | undefined }) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth");
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>High Quality Soccer Collectibles - Greenfellas Trading Post</title>
	<meta name="description" content="Get the highest quality soccer trading cards. Raw, graded, repacks, breaks, and more available here!" />
</svelte:head>

<svelte:window
	onscroll={moveParallaxBG}
	onresize={(event) => {
		if ((event.target as Window).innerWidth > 1024 && ($globalPopupState == "headernav" || $globalPopupState == "sorts" || $globalPopupState == "filters")) $globalPopupState = "none";
	}}
/>

<Popup></Popup>

<div class="w-screen h-screen fixed -z-10 blur-sm [&>img]:absolute">
	<img id="bg-1" src="/images/bg-1.png" alt="" class="w-full h-full object-cover" />
	<img id="bg-2" src="/images/bg-2.png" alt="" class="mt-64 h-full object-cover" />
</div>
{#if page.url.pathname == "/" && (!user || user.is_anonymous)}
	<article class:hidden={user || page.url.pathname != "/"} class="fixed flex gap-2 right-4 top-4 z-20 [&>*]:fancy-button [&>*]:bg-glass-sm">
		<button type="button" onclick={() => ($globalPopupState = "signup")}>Sign Up</button>
		<button type="button" onclick={() => ($globalPopupState = "login")}>Log In</button>
	</article>
{:else}
	<Header></Header>
{/if}
<main class="w-screen pt-16 pb-32 lg:pt-24 min-h-[calc(100vh-7rem)] lg:min-h-[calc(100vh-10rem)] flex flex-col gap-8 sm:gap-16 xl:gap-32">
	{#if page.url.pathname.includes("consignments")}
		{#if isSuperUser(user) || dev}
			{@render children()}
		{:else}
			<article class="flex flex-col justify-center [&>*]:text-center px-8 md:px-16 lg:px-0">
				<h2>Under Construction</h2>
			</article>
		{/if}
	{:else}
		{@render children()}
	{/if}
</main>
<Footer></Footer>
