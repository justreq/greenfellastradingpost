<script lang="ts">
	import { page } from "$app/state";
	import FancyButton from "$lib/components/FancyButton.svelte";
	import { cartContents, checkout, getCardName } from "$lib/globals";
	import { onMount } from "svelte";

	let cardData = page.data.cards.find((c: { id: any }) => c.id == page.data.id);

	let currentImage = $state(0);
	let productIndex = page.data.cards.map((e: any) => e.id).indexOf(page.data.id);

	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		trailingZeroDisplay: "stripIfInteger",
	});

	const addToCart = () => {
		if (localStorage.getItem("cart") == null) {
			let cart: { product_ids: string[]; owner_id: string | null } = { product_ids: [page.data.id], owner_id: null };

			localStorage.setItem("cart", JSON.stringify(cart));
			$cartContents = cart.product_ids;
		} else {
			let cart = JSON.parse(localStorage.getItem("cart") as string);
			if (cart.product_ids.includes(page.data.id)) return;

			cart.product_ids.push(page.data.id);
			localStorage.setItem("cart", JSON.stringify(cart));
			$cartContents = cart.product_ids;
		}

		document.getElementById("cart-button")?.animate(
			[
				{
					transform: "scale(1)",
					opacity: 1,
				},
				{
					transform: "scale(1.2)",
					opacity: 0.75,
					backgroundColor: "#57C5A0",
				},
				{
					transform: "scale(1)",
					opacity: 1,
				},
			],
			{ duration: 500, easing: "ease-out" }
		);
	};

	let element: HTMLElement;

	onMount(() => {
		if (localStorage.getItem("cart") != null) $cartContents = JSON.parse(localStorage.getItem("cart") as string).product_ids;
	});
</script>

<section class="mx-auto max-w-[90rem] w-[95%]">
	<header class="flex justify-between mb-4 [&>*]:fancy-button">
		<a data-sveltekit-reload href="/marketplace/{page.data.cards[(productIndex == 0 ? page.data.cards.length : productIndex) - 1].id}">← Previous</a>
		<a data-sveltekit-reload href="/marketplace/{page.data.cards[(productIndex == page.data.cards.length - 1 ? -1 : productIndex) + 1].id}">Next →</a>
	</header>
	<article class="flex flex-col-reverse lg:flex-row gap-8 xl:gap-16 [&>*]:bg-glass-sm [&>*]:rounded-lg">
		<div class="flex flex-col sm:flex-row lg:flex-col-reverse xl:flex-row gap-4 xl:gap-16 p-2 sm:p-4">
			<aside class="flex mx-auto sm:mx-0 gap-4 w-[16rem] sm:w-min sm:h-[32rem] lg:w-[21rem] lg:h-min xl:w-min xl:h-[36rem] overflow-scroll sm:flex-col lg:flex-row xl:flex-col [&>button]:min-w-16 [&>button]:xl:w-24 [&>button]:bg-glass-sm [&>button]:p-2 [&>button]:rounded-lg [&>button]:transition-colors [&>button]:duration-200 [&_img]:rounded-md">
				{#each [...Array(cardData.file_extensions.length).keys()] as image}
					<button type="button" class:!border-text={currentImage == image} onclick={() => (currentImage = image)}>
						<img src="https://stcebbhxlmcaweulagty.supabase.co/storage/v1/object/public/product_images/{page.data.id}/{image}.{cardData.file_extensions[image]}" alt="Product" draggable="false" />
					</button>
				{/each}
			</aside>
			<div class="w-[90%] sm:w-max sm:h-[32rem] xl:h-[36rem] mx-auto object-contain">
				<img bind:this={element} src="https://stcebbhxlmcaweulagty.supabase.co/storage/v1/object/public/product_images/{page.data.id}/{currentImage}.{cardData.file_extensions[currentImage]}" alt="Product" draggable="false" class="rounded-lg w-full sm:w-auto sm:h-full shadow-[0_0_1rem_4px_black]" />
			</div>
		</div>
		<div class="flex-grow p-4 sm:p-8 flex flex-col gap-8">
			<h2>
				{getCardName(cardData)}
			</h2>
			<h3 class="text-accent font-bold">{formatter.format(cardData.sell_price)}</h3>
			<div class="flex flex-col sm:flex-row gap-4 [&>*]:w-full [&>*]:font-bold [&>*]:flex [&>*]:justify-center [&>*]:p-4 [&>*]:text-xl [&>*]:rounded-xl [&>*]:transition-all [&>*:hover]:md:scale-[101%]">
				<FancyButton text={$cartContents.includes(page.data.id) ? "In Cart" : "Add To Cart"} iconPath="/icons/cart.svg" className="bg-tertiary/80" onclick={addToCart} />
				<FancyButton text="Buy Now" iconPath="/icons/buy-now.svg" className="bg-accent2/80 md:hover:!bg-accent2 uppercase" onclick={() => checkout(page.data.id)} />
			</div>
			<h3>Description</h3>
			<p class="text-lg">All card information is displayed in the title or front/back card images. All cards are handled with care and packaged securely. Please contact us if you have any questions.</p>
		</div>
	</article>
</section>
