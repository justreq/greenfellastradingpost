<script lang="ts">
	import { page } from "$app/state";
	import { cartContents, checkout, getCardName, globalPopupState } from "$lib/globals";
	import { onMount } from "svelte";
	import FancyButton from "./FancyButton.svelte";

	let checkoutList = $state([]);

	onMount(() => {
		if (localStorage.getItem("cart") != null) checkoutList = JSON.parse(localStorage.getItem("cart") as string).product_ids;
	});
</script>

<article class="flex flex-col gap-2 p-2 lg:p-0">
	{#if checkoutList.length > 0}
		<FancyButton onclick={() => checkout()} text="Proceed to checkout" className="bg-accent2/80 uppercase p-3 w-full justify-center md:hover:!bg-accent2" iconPath="/icons/buy-now.svg" />
		{#each checkoutList as product}
			<div class="flex justify-between gap-4 py-4 place-items-center bg-glass-sm rounded-lg p-2">
				<p>{getCardName(page.data.cards.find((c: { id: any }) => c.id == page.data.products.find((c: { id: any }) => c.id == product).item_id))}</p>
				<FancyButton
					iconPath="/icons/delete.svg"
					className="fancy-button border-none bg-red-500/80 disabled:opacity-50 [&:not(:disabled)]:md:hover:!bg-red-500"
					onclick={() => {
						let cart = JSON.parse(localStorage.getItem("cart") as string);
						cart.product_ids.splice(cart.product_ids.indexOf(product), 1);
						$cartContents = cart.product_ids;
						checkoutList = cart.product_ids;

						if (cart.product_ids.length == 0) {
							localStorage.removeItem("cart");
						} else localStorage.setItem("cart", JSON.stringify(cart));

						$globalPopupState = "none";
						if (cart.product_ids.length > 0) $globalPopupState = "checkout";
					}}
				/>
			</div>
		{/each}
	{:else}
		<p class="bg-glass-sm p-2 rounded-lg">
			There's nothing in your cart... yet. Fill your cart with high-end soccer cards from our ever-expanding
			<span>
				<a href="/collection" onclick={() => ($globalPopupState = "none")}>
					<span class="underline uppercase underline-offset-4">collection</span>
					→
				</a>
			</span>
		</p>
	{/if}
</article>
