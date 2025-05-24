<script lang="ts">
	import { page } from "$app/state";
	import FancyButton from "$lib/components/FancyButton.svelte";

	let cardData = page.data.cards.find((c: { id: any }) => c.id == page.data.products.find((p: { id: any }) => p.id == page.data.id).item_id);
	let productData = page.data.products.find((c: { id: any }) => c.id == page.data.id);

	let currentImage = $state(0);

	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		trailingZeroDisplay: "stripIfInteger",
	});
</script>

<section class="mx-auto max-w-[90rem] w-[95%] flex flex-col-reverse lg:flex-row gap-8 xl:gap-16 [&>*]:bg-glass-sm [&>*]:rounded-lg">
	<article class="flex flex-col sm:flex-row lg:flex-col-reverse xl:flex-row gap-4 xl:gap-16 p-2 sm:p-4">
		<aside class="flex mx-auto sm:mx-0 gap-4 sm:flex-col lg:flex-row xl:flex-col [&>button]:w-16 [&>button]:xl:w-24 [&>button]:bg-glass-sm [&>button]:p-2 [&>button]:rounded-lg [&>button]:transition-colors [&>button]:duration-200 [&_img]:rounded-md">
			{#each [...Array(productData.file_extensions.length).keys()] as image}
				<button type="button" class:!border-text={currentImage == image} onclick={() => (currentImage = image)}>
					<img src="https://stcebbhxlmcaweulagty.supabase.co/storage/v1/object/public/product_images/{page.data.id}/{image}.{productData.file_extensions[image]}" alt="Product" draggable="false" />
				</button>
			{/each}
		</aside>
		<div class="w-[90%] sm:w-max sm:h-[32rem] xl:h-[36rem] m-auto object-contain">
			<img src="https://stcebbhxlmcaweulagty.supabase.co/storage/v1/object/public/product_images/{page.data.id}/{currentImage}.{productData.file_extensions[currentImage]}" alt="Product" draggable="false" class="rounded-lg w-full sm:w-auto sm:h-full" />
		</div>
	</article>
	<article class="flex-grow p-4 sm:p-8 flex flex-col gap-8">
		<h2>
			{[cardData.number || "", cardData.grade || "", cardData.player || "", cardData.year || "", cardData.brand || "", cardData.set || ""]
				.map((e) => e.trim())
				.filter((e) => e != "")
				.join(" ")}
		</h2>
		<h3 class="text-accent font-bold">{formatter.format(cardData.sell_price)}</h3>
		<div class="flex flex-col sm:flex-row gap-4 [&>*]:w-full [&>*]:font-bold [&>*]:flex [&>*]:justify-center [&>*]:p-4 [&>*]:text-xl [&>*]:rounded-xl [&>*]:transition-all [&>*:hover]:md:scale-105">
			<FancyButton text="Add to Cart" iconPath="/icons/cart.svg" className="bg-tertiary/80" />
			<FancyButton text="Buy Now" iconPath="/icons/buy-now.svg" className="bg-accent2/80 md:hover:!bg-accent2" />
		</div>
		<h3>Description</h3>
		<p class="text-lg">All card information is displayed in the title or front/back card images. All cards are handled with care and packaged securely. Please contact us if you have any questions.</p>
	</article>
</section>
