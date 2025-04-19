<script lang="ts">
	import { page } from "$app/state";
	export let id;

	let data = page.data.cards.find((c: { id: any }) => c.id == page.data.products.find((p: { id: any }) => p.id == id).item_id);
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		trailingZeroDisplay: "stripIfInteger",
	});
</script>

<a href="/collection/{id}" class="[&:hover>p:not(:last-child)]:lg:text-accent [&:hover>div]:lg:bg-tertiary/60 whitespace-normal w-min">
	<div class="relative w-48 lg:w-64 aspect-square rounded-xl bg-tertiary/30 backdrop-blur-sm border-2 border-tertiary/30 duration-200 transition-colors">
		<img src="https://stcebbhxlmcaweulagty.supabase.co/storage/v1/object/public/product_images/{id}/0.jpg" alt="Product" class="absolute rounded-lg h-4/5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_1rem_4px_black]" draggable="false" />
	</div>
	<p class="mt-2 lg:mt-4 h-14 lg:text-lg line-clamp-2 text-ellipsis transition-colors duration-200">
		{[data.number || "", data.player || "", data.year || "", data.brand || "", data.set || ""]
			.map((e) => e.trim())
			.filter((e) => e != "")
			.join(" ")}
	</p>
	<p class="w-full text-lg lg:text-2xl text-accent font-bold">{formatter.format(data.sell_price)}</p>
</a>
