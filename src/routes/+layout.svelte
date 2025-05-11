<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { page } from "$app/state";
	import { currentUser, fetchCurrentUser, isSuperUser, loadedAuth, supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import Popup from "$lib/components/Popup.svelte";
	import { globalPopupState, superUsers } from "$lib/globals";
	import FancyTextInput from "$lib/components/FancyTextInput.svelte";
	let { children } = $props();

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
		if (window.innerWidth > 1024 && ($globalPopupState == "headernav" || ($globalPopupState == "profile" && $loadedAuth && !$currentUser))) $globalPopupState = "none";
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
		{#if page.url.pathname.includes("repacks")}
			<div class="px-2 mx-auto w-fit flex flex-col gap-4 justify-center text-center">
				<h2>Available Numbers</h2>
				<h4>Refresh the page for the current numbers</h4>
				{#if isSuperUser($currentUser)}
					<div class="flex flex-col gap-4 [&>button]:fancy-anchor [&>button]:fancy-button whitespace-nowrap [&>button]:bg-glass-sm [&>button]:my-auto">
						<FancyTextInput type="number" name="repack-number" placeholder="Spot Number" />
						<button
							onclick={async () => {
								const { error } = await supabase
									.from("repacks")
									.update({ numbers: page.data.repack.numbers.filter((e: number) => e != parseInt((document.getElementById("repack-number") as HTMLInputElement).value)) })
									.eq("id", page.data.repack.id);
								if (error) throw error;

								location.reload();
							}}
							type="button"
							class="!bg-red-500/80 !text-text !border-red-500"
						>
							Remove Spot
						</button>
						<button
							type="button"
							onclick={async () => {
								const { error } = await supabase
									.from("repacks")
									.update({ numbers: Array.from(Array(50).keys()).map((x) => x + 1) })
									.eq("id", page.data.repack.id);
								if (error) throw error;

								location.reload();
							}}
						>
							Reset Spots
						</button>
					</div>
				{/if}
				<div class="w-auto max-w-[40rem] mx-auto sm:w-screen flex justify-evenly flex-wrap gap-4 [&>*]:bg-glass-sm [&>*]:rounded-md [&>*]:text-center [&>*]:w-12 [&>*]:py-2">
					{#each Array.from(Array(50).keys()).map((x) => x + 1) as spot}
						<div class:opacity-50={!page.data.repack.numbers.includes(spot)} class:text-tertiary={!page.data.repack.numbers.includes(spot)}>{spot}</div>
					{/each}
				</div>
				<h2>GTP 1 of 1 Repack Checklist</h2>
			</div>
		{:else if ($currentUser && superUsers.includes($currentUser.id)) || page.route.id?.includes("legal")}
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
