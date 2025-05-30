<script lang="ts">
	import { page } from "$app/state";
	import { globalPopupState } from "$lib/globals";
	import { onMount } from "svelte";
	let { user } = $derived(page.data);

	let innerWidth = $state(0);
	let innerHeight = $state(0);

	const getTitleImage = () => {
		return `/images/title-${innerWidth >= 1024 ? "desktop" : "mobile"}.png`;
	};

	const updateTitle = () => {
		if (window.innerWidth > 1024 && ($globalPopupState == "headernav" || ($globalPopupState == "profile" && !user))) $globalPopupState = "none";
		if (document.getElementById("title")) (document.getElementById("title") as HTMLImageElement).src = getTitleImage();
	};

	onMount(() => {
		updateTitle();
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight onresize={updateTitle} />

<section class="w-screen">
	<img src={getTitleImage()} alt="Title" id="title" class="mt-56 xl:-mt-20 mb-4 xl:mb-56 w-3/4 sm:w-1/2 lg:w-4/5 lg:max-w-[48rem] mx-auto" draggable="false" />
	<article class="px-2 sm:px-8 pb-4 w-fit mx-auto flex flex-col gap-4">
		<h2 class="text-center text-4xl sm:text-5xl lg:text-6xl text-balance">Filling your collections with high-end soccer cards</h2>
		<a href="/collection" class="bg-glass-sm fancy-button w-fit mx-auto px-4 py-2 text-lg rounded-full">Browse GTP Collection</a>
	</article>
</section>
<section id="landing-section" class="bg-glass">
	<div class="flex flex-col xl:flex-row gap-16 justify-center items-center py-12 [&>article]:w-[90%] [&>article]:sm:w-[32rem] [&>article]:xl:w-80 [&>article]:flex [&>article]:flex-col [&>article]:gap-2 [&>article]:sm:gap-8 [&>article]:xl:gap-2 [&>article]:items-center [&_img]:aspect-square [&_img]:w-32 [&_div]:flex [&_div]:flex-col [&_div]:items-center [&_div]:gap-2 [&>*]:text-center [&_a]:border-0 [&_span]:border-b-[1.5px] [&_span]:uppercase [&_span]:transition-colors [&_span]:duration-200 [&_span:hover]:lg:text-accent2 [&_span:hover]:lg:border-accent2">
		<article>
			<h3>One-stop shop for everything GTP</h3>
			<p>Buy into our streams for singles, graded cards, breaks, and more!</p>
			<a href="/services">
				<span>All our services</span>
				→
			</a>
		</article>
		<article>
			<h3>Invest in our breaks</h3>
			<p>Secure a team spot and get all of their cards from a multi-case break. Watch a live broadcast of the case breaks on Whatnot</p>
			<a href="/break#stream">
				<span>Next break stream</span>
				→
			</a>
		</article>
		<article>
			<h3>Check out our repacks</h3>
			<p>Get the chance to secure a high-value card in one of our Sunday Repack shows</p>
			<a href="/repack#stream">
				<span>Next Repack stream</span>
				→
			</a>
		</article>
	</div>
	<div class="px-4 flex flex-col items-center [&>article]:py-32 [&>article:not(:first-child)]:bg-glass [&>article]:border-none [&>article]:flex [&>article]:flex-col-reverse [&>article]:xl:flex-row [&>article]:items-center [&>article]:gap-16 [&>article>div]:items-center [&>article>div]:justify-center [&_div]:max-w-[32rem] [&_div]:flex [&_div]:flex-col [&_div]:gap-4 [&_a]:w-min [&_a]:rounded-full [&_a]:px-4 [&_a]:bg-accent/60 [&_a]:border-transparent [&_a]:transition-transform [&_a:hover]:lg:scale-110 [&_a]:!text-text [&_img]:max-h-72 [&_img]:w-3/4 [&_img]:sm:w-1/2 [&_img]:xl:w-auto [&_img]:xl:h-56 [&_img]:2xl:h-full">
		<article>
			<div>
				<h3>Bonus Grading Services</h3>
				<p>Have any raw cards you own or purchase be cleaned and hand-delivered to PSA for expedited grading. Recieve your graded cards faster than ever!</p>
				<a href="/psa">Learn More</a>
			</div>
			<img src="/images/logo-psa.png" alt="PSA logo" draggable="false" />
		</article>
	</div>
</section>
