<script lang="ts">
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import VanillaTilt from "vanilla-tilt";
	export let id;
	export let showPrice = true;

	let cardData = page.data.cards.find((c: { id: any }) => c.id == id);
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		trailingZeroDisplay: "stripIfInteger",
	});

	let element: HTMLElement;

	onMount(() => {
		VanillaTilt.init(element, {
			reverse: true,
		});
	});
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<a href="/marketplace/{id}" class="w-48 h-min self-center flex relative justify-center">
	<img bind:this={element} src="https://stcebbhxlmcaweulagty.supabase.co/storage/v1/object/public/product_images/{id}/0.{cardData.file_extensions[0]}" alt="Product" class="rounded-lg w-full shadow-[0_0_1rem_8px_black]" draggable="false" />
	{#if showPrice}
		<p class="absolute w-fit text-2xl px-4 py-2 rounded-xl sm:text-lg lg:text-2xl text-accent font-bold text-center bg-glass-secondary -bottom-6 left-1/2 -translate-x-1/2">{formatter.format(cardData.sell_price)}</p>
	{/if}
</a>
