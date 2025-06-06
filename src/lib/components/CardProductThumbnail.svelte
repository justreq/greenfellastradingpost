<script lang="ts">
	import { page } from "$app/state";
	import { getCardName } from "$lib/globals";
	export let id;

	let cardData = page.data.cards.find((c: { id: any }) => c.id == page.data.products.find((p: { id: any }) => p.id == id).item_id);
	let productData = page.data.products.find((c: { id: any }) => c.id == id);
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		trailingZeroDisplay: "stripIfInteger",
	});
</script>

<a href="/collection/{id}" class="flex flex-row gap-4 sm:gap-0 sm:flex-col sm:justify-normal sm:bg-none sm:block w-full sm:w-min [&:hover_p:not(:last-child)]:lg:text-accent [&:hover>div:first-child]:lg:bg-tertiary/60 whitespace-normal">
	<div class="flex py-2 sm:py-0 min-w-max sm:min-w-0 h-48 sm:h-64 sm:aspect-square rounded-xl bg-transparent sm:bg-tertiary/30 sm:backdrop-blur-sm sm:border-2 border-tertiary/30 duration-200 transition-colors">
		<img src="https://stcebbhxlmcaweulagty.supabase.co/storage/v1/object/public/product_images/{id}/0.{productData.file_extensions[0]}" alt="Product" class="rounded-lg h-full sm:h-4/5 m-auto shadow-[0_0_1rem_4px_black]" draggable="false" />
	</div>
	<div class="flex flex-col">
		<p class="mt-2 lg:mt-4 h-14 lg:text-lg line-clamp-2 text-ellipsis transition-colors duration-200">
			{getCardName(cardData)}
		</p>
		<p class="w-full text-2xl sm:text-lg lg:text-2xl text-accent font-bold">{formatter.format(cardData.sell_price)}</p>
	</div>
</a>
