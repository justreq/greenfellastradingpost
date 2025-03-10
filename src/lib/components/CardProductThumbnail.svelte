<script>
	import FancyButton from "./FancyButton.svelte";
	import FancyLabel from "./FancyLabel.svelte";

	export let brand = "";
	export let year = "";
	export let set = "";
	export let player = "";
	export let type = "";
	export let variant = "";
	export let number = "";
</script>

<div class="min-w-64 max-w-64">
	<div class="w-full relative aspect-square bg-text rounded-xl">
		<img src="" alt="" />

		<div class="absolute right-2 bottom-2 flex gap-2">
				<FancyButton iconPath="/icons/cart.svg" className="bg-glass transition-all hover:scale-105" />
				<FancyButton iconPath="/icons/buy-now.svg" className="bg-glass transition-all hover:scale-105" />
			</div>
		</div>
		<p class="mt-4 h-14 text-lg line-clamp-2 text-ellipsis">
			{[number, player, year, brand, set]
			.map((e) => e.trim())
			.filter((e) => e != "")
			.join(" ")}
	</p>
	<p class="w-full text-2xl text-accent font-bold">$700.00</p>
</div>
