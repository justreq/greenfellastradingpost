<script lang="ts">
	import { page } from "$app/state";
	import { breakIDToShowSpots } from "$lib/globals";

	const convertFloatToPrice = (float: number) => {
		const formatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			trailingZeroDisplay: "stripIfInteger",
		});

		return formatter.format(float);
	};

	const buySpot = async () => {
		let cartContents;

		if (localStorage.getItem("spotCart") != null) {
			let cart = JSON.parse(localStorage.getItem("spotCart") as string);

			let spotData = page.data.breakSpots.find((c: { id: any }) => c.id == cart.spot_id);

			cartContents = [
				{
					name: spotData.name,
					price: spotData.price,
				},
			];
		}

		localStorage.setItem("redirect-route", "/break");

		const data = await fetch("/checkout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ type: "spot", cart: cartContents, message: "You are not charged for shipping when buying a break spot, only after the break. Even if your spot doesn't get hits, you can purchase a shipping label with us for some base cards." }),
		}).then((data) => data.json());

		window.location.replace(data.url);
	};
</script>

<div class="flex flex-col gap-2 p-2">
	{#each page.data.breakSpots.filter((e: { break_id: string | null }) => e.break_id == $breakIDToShowSpots).sort((a: { name: any }, b: { name: any }) => a.name.localeCompare(b.name)) as breakSpot}
		<article class="bg-glass-secondary-sm p-2 rounded-xl" data-spot-id={breakSpot.id}>
			<div class="flex justify-between items-center">
				<p class="text-accent text-xl font-bold">{convertFloatToPrice(breakSpot.price)}</p>
				{#if breakSpot.bought != "" || breakSpot.owner_id != null}
					<div class="absolute top-0 left-0 w-full h-full bg-black/40 rounded-xl"></div>
					<p>{breakSpot.owner_id == null ? breakSpot.bought : page.data.users.find((e: { id: any }) => e.id == breakSpot.owner_id).display_name}</p>
				{:else}
					<div class="flex gap-2">
						<button
							class="whitespace-nowrap bg-accent2/40 border-2 border-accent2/80 px-2 py-1 rounded-md"
							onclick={(event) => {
								localStorage.removeItem("spotCart");
								let spotCart: { spot_id: string; owner_id: string | null } = { spot_id: (event.target as HTMLElement).parentElement?.parentElement?.parentElement?.getAttribute("data-spot-id") as string, owner_id: null };
								localStorage.setItem("spotCart", JSON.stringify(spotCart));
								buySpot();
							}}
						>
							Buy Spot
						</button>
					</div>
				{/if}
			</div>
			<p class="font-bold mt-2 bg-tertiary/40 rounded-md px-2 py-0.5">{breakSpot.name}</p>
			{#if breakSpot.contents != ""}
				<p class="text-sm mt-2 bg-tertiary/40 rounded-md px-2 py-0.5">{breakSpot.contents}</p>
			{/if}
		</article>
	{/each}
</div>
