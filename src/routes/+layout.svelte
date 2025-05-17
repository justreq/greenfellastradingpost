<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { page } from "$app/state";
	import { currentUser, fetchCurrentUser, loadedAuth, supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import Popup from "$lib/components/Popup.svelte";
	import { filtersList, globalPopupState, superUsers } from "$lib/globals";
	import { dev } from "$app/environment";
	let { children } = $props();

	$filtersList = {
		prices: [
			{ name: "Free - $10", value: "lowest" },
			{ name: "$11 - $25", value: "affordable" },
			{ name: "$26 - $75", value: "midrange" },
			{ name: "$75 - $150", value: "premium" },
			{ name: "$151+", value: "luxury" },
		],
		years: page.data.cards.map((e: { year: string }) => ({ name: e.year, value: e.year.toLowerCase() })),
		sets: page.data.cards.map((e: { brand: string; set: string }) => ({ name: `${e.brand} ${e.set}`, value: `${e.brand.toLowerCase().split(" ").join("-")}-${e.set.toLowerCase().split(" ").join("-")}` })),
		players: page.data.cards.map((e: { player: string }) => ({ name: e.player, value: e.player.toLowerCase().split(" ").join("-") })),
		other: [
			{ name: "Is Numbered", value: "numbered" },
			{ name: "Has Auto", value: "auto" },
			{ name: "Has Patch", value: "patch" },
		],
	};

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
	});

	supabase.auth.onAuthStateChange(() => {
		fetchCurrentUser();
	});
</script>

<svelte:head>
	<!-- <script src="https://www.paypal.com/sdk/js?client-id=BAAiDpoa6hKu2qzEnwK605Ix6mZuiIECKR7vhNx_GljZz2UMCvzZzs7ubI0UyeqXepMkFyvJ81dxnc-iNo&components=hosted-buttons&enable-funding=venmo&currency=USD"> -->
	<!-- </script> -->
	<title>Greenfellas Trading Post</title>
	<meta name="description" content="Get the highest quality soccer trading cards. Mags, slabs, repacks, breaks, and more available here!" />
</svelte:head>

<svelte:window
	onscroll={moveParallaxBG}
	onresize={(event) => {
		if ((event.target as Window).innerWidth > 1024 && ($globalPopupState == "headernav" || $globalPopupState == "profile" || $globalPopupState == "sorts" || $globalPopupState == "filters")) $globalPopupState = "none";
	}}
/>

<Popup></Popup>
<div class="w-screen h-screen fixed -z-10 blur-sm [&>img]:absolute">
	<img id="bg-1" src="/images/bg-1.png" alt="" class="w-full h-full object-cover" />
	<img id="bg-2" src="/images/bg-2.png" alt="" class="mt-64 h-full object-cover" />
</div>
{#if $loadedAuth}
	{#if page.url.pathname == "/" && !$currentUser}
		<article class:hidden={$currentUser || page.url.pathname != "/"} class="fixed flex gap-2 right-4 top-4 z-20 [&>*]:fancy-button [&>*]:bg-glass-sm">
			<button type="button" onclick={() => ($globalPopupState = "signup")}>Sign Up</button>
			<button type="button" onclick={() => ($globalPopupState = "login")}>Log In</button>
		</article>
	{:else}
		<Header></Header>
	{/if}
	<main class:pb-32={page.url.pathname != "/" || $currentUser} class="w-screen pt-12 lg:pt-24 min-h-[calc(100vh-9rem)] lg:min-h-[calc(100vh-10rem)] flex flex-col gap-8 sm:gap-16 xl:gap-32">
		{#if dev || ($currentUser && superUsers.includes($currentUser.id)) || page.route.id?.includes("legal")}
			{@render children()}
		{:else}
			<article class="flex flex-col justify-center [&>*]:text-center px-8 md:px-16 lg:px-0">
				<h2>Coming Soon...</h2>
				<p class="text-lg lg:text-xl">Create an account with us to stay up to date with GTP's latest machinations...</p>
				<button class="fancy-button w-fit mx-auto mt-4" onclick={() => ($globalPopupState = "signup")}>Sign Up</button>
			</article>
		{/if}
	</main>
	<Footer></Footer>
{/if}
