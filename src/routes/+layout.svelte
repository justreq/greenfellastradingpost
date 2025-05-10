<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { page } from "$app/state";
	import { currentUser, fetchCurrentUser, loadedAuth, supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { dev } from "$app/environment";
	import CardProductCarousel from "$lib/components/CardProductCarousel.svelte";
	import CardProductThumbnail from "$lib/components/CardProductThumbnail.svelte";
	import Popup from "$lib/components/Popup.svelte";
	import { globalPopupState, superUsers } from "$lib/globals";
	let { children, data } = $props();

	let innerWidth = $state(0);
	let innerHeight = $state(0);

	const moveParallaxBG = (event: Event) => {
		let bg1 = document.getElementById("bg-1");
		let bg2 = document.getElementById("bg-2");

		if (!bg1 || !bg2) return;

		let scrollAmount = window.pageYOffset / (document.body.scrollHeight - innerHeight);

		bg1.style.top = `-${scrollAmount * 50}px`;
		bg2.style.top = `-${scrollAmount * 200}px`;
	};

	const getTitleImage = () => {
		return `/images/title-${innerWidth >= 1024 ? "desktop" : "mobile"}.png`;
	};

	const updateTitle = () => {
		if (document.getElementById("title")) (document.getElementById("title") as HTMLImageElement).src = getTitleImage();
	};

	onMount(() => {
		moveParallaxBG(new Event(""));
		updateTitle();
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

<svelte:window bind:innerWidth bind:innerHeight on:scroll={moveParallaxBG} onresize={updateTitle} />

<Popup></Popup>
<div class="w-screen h-screen fixed -z-10 blur-sm [&>img]:absolute">
	<img id="bg-1" src="/images/bg-1.png" alt="" class="w-full h-full object-cover" />
	<img id="bg-2" src="/images/bg-2.png" alt="" class="mt-64 h-full object-cover" />
</div>
{#if $loadedAuth}
	<Header></Header>
	<main class:pb-32={page.url.pathname != "/" || $currentUser} class="w-screen pt-12 lg:pt-24 min-h-[calc(100vh-9rem)] lg:min-h-[calc(100vh-10rem)] flex flex-col gap-8 sm:gap-16 xl:gap-32">
		{#if ($currentUser && superUsers.includes($currentUser.id)) || page.route.id?.includes("legal")}
			<article class:hidden={$currentUser || page.url.pathname != "/"} class="fixed flex gap-2 right-4 top-4 z-20 [&>*]:fancy-button [&>*]:bg-glass-sm">
				<button type="button" onclick={() => ($globalPopupState = "signup")}>Sign Up</button>
				<button type="button" onclick={() => ($globalPopupState = "login")}>Log In</button>
			</article>
			<section class:hidden={$currentUser || page.url.pathname != "/"} class="w-screen">
				<img src={getTitleImage()} alt="Title" id="title" class="mt-56 xl:-mt-20 mb-4 xl:mb-56 w-3/4 sm:w-1/2 lg:w-4/5 lg:max-w-[48rem] mx-auto" draggable="false" />
				<article class="px-2 sm:px-8 pb-4 w-fit mx-auto flex flex-col gap-4">
					<h2 class="text-center text-4xl sm:text-5xl lg:text-6xl text-balance">Filling your collections with high-end soccer cards</h2>
					<a href="/collection" class="bg-glass-sm fancy-button w-fit mx-auto px-4 py-2 text-lg rounded-full">Browse GTP Collection</a>
				</article>
			</section>
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
