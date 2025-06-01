<script lang="ts">
	import { page } from "$app/state";
	import { breakIDToShowSpots, globalPopupState } from "$lib/globals";
	import { isSuperUser } from "$lib/supabaseClient";
	import FancyButton from "./FancyButton.svelte";
	import FancyCheckbox from "./FancyCheckbox.svelte";
	let { supabase, user } = $derived(page.data);

	let selectedSpotCount = $state(0);
	let allSpotsSelected = $state(false);

	const convertFloatToPrice = (float: number) => {
		const formatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			trailingZeroDisplay: "stripIfInteger",
		});

		return formatter.format(float);
	};

	const trackSelectedSpots = (event: Event, amount: number | null) => {
		if (amount) selectedSpotCount = (event.target as HTMLInputElement).checked ? amount : 0;
		else selectedSpotCount += ((event.target as HTMLInputElement).checked ? 1 : -1) * (amount ?? 1);

		(document.getElementById("button-delete-spots") as HTMLElement).innerText = `Delete ${selectedSpotCount} SPOT${selectedSpotCount == 1 ? "" : "s"}`;
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

		const data = await fetch("/checkout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ cart: cartContents }),
		}).then((data) => data.json());

		window.location.replace(data.url);
	};
</script>

{#if isSuperUser(user)}
	<div class="sm:p-0 p-2 flex justify-evenly flex-col sm:flex-row gap-2 mb-0 sm:mb-2 [&>*]:w-full [&>*]:uppercase [&>*]:block [&>*]:border-2">
		<FancyButton className="!bg-green-500/40 !border-green-500/80 md:hover:!border-green-500 md:hover:!text-green-500" id="create-new-spot" text="Create New Spot" onclick={() => ($globalPopupState = "createbreakspot")} />
		<FancyButton
			text="Delete {selectedSpotCount} Spot{selectedSpotCount == 1 ? '' : 's'}"
			onclick={async (event: Event) => {
				switch ((event.target as HTMLElement).innerText) {
					case `DELETE ${selectedSpotCount} SPOT${selectedSpotCount == 1 ? "" : "S"}`:
						(event.target as HTMLElement).innerText = "Confirm?";
						break;
					case "CONFIRM?":
						(event.target as HTMLElement).innerText = "Are you sure?";
						break;
					case "ARE YOU SURE?":
						(event.target as HTMLElement).innerText = "All right then";
						const { error } = await supabase
							.from("break_spots")
							.delete()
							.in(
								"id",
								Array.from(document.getElementById("break-spots-table")?.querySelectorAll("tr") as NodeList)
									.slice(1)
									.filter((e) => ((e as HTMLElement).querySelector("input") as HTMLInputElement).checked)
									.map((e) => (e as HTMLElement).getAttribute("data-id"))
							);

						if (error) throw error;
						location.reload();

						break;
				}
			}}
			id="delete-spots"
			disabled={selectedSpotCount == 0}
			className="!bg-red-500/40 !border-red-500/80 [&:not(:disabled)]:md:hover:!border-red-500 [&:not(:disabled)]:md:hover:!text-red-500 disabled:opacity-50 transition-all"
		/>
	</div>
{/if}
<table id="break-spots-table" class="block mx-auto w-fit table-fixed overflow-scroll border-separate [&_td]:overflow-scroll [&_td]:rounded-sm [&_td]:p-2">
	<thead class="bg-accent2/60">
		<tr>
			{#each (isSuperUser(user) ? [""] : []).concat(["Spot", "Price", "Owner"]) as column}
				<td>
					{#if column == ""}
						<FancyCheckbox
							id="select-all-spots"
							className="gap-0"
							bind:value={allSpotsSelected}
							onclick={(cb: Event) => {
								trackSelectedSpots(cb, Array.from(document.getElementById("break-spots-table")?.querySelectorAll("tr") as NodeList).length - 1);
							}}
						/>{:else}
						{column}
					{/if}
				</td>
			{/each}
		</tr>
	</thead>
	<tbody class="even:bg-tertiary/80 odd:bg-secondary/80 [&_td]:!select-text [&_button:not(:has(*))]:fancy-button [&_button:not(:has(*))]:bg-accent2/20 [&_button:not(:has(*))]:border-accent2/40">
		{#each page.data.breakSpots.filter((e: { break_id: string | null }) => e.break_id == $breakIDToShowSpots).sort((a: { name: any }, b: { name: any }) => a.name.localeCompare(b.name)) as breakSpot}
			<tr data-id={breakSpot.id}>
				{#each (isSuperUser(user) ? [""] : []).concat(Object.keys(breakSpot).slice(2, 5)) as key}
					<td class:text-accent2={breakSpot[key] == null}>
						{#if key == ""}
							<FancyCheckbox className="gap-0" value={allSpotsSelected} onclick={trackSelectedSpots} />
						{/if}
						{#if (breakSpot.bought != "" && key == "owner_id") || (key != "" && breakSpot[key] == null)}
							<span>
								{#if breakSpot.bought != ""}
									{breakSpot.bought}
								{:else}
									<button
										data-spot-id={breakSpot.id}
										class="whitespace-nowrap"
										onclick={(event) => {
											localStorage.removeItem("spotCart");
											let spotCart: { spot_id: string; owner_id: string | null } = { spot_id: (event.target as HTMLElement).getAttribute("data-spot-id") as string, owner_id: null };
											if (user) {
												spotCart.owner_id = user.id;
												localStorage.setItem("spotCart", JSON.stringify(spotCart));
												buySpot();
											} else $globalPopupState = "profile";
										}}
									>
										Buy Spot
									</button>
								{/if}
							</span>
						{:else}
							{key == "price" ? convertFloatToPrice(breakSpot[key]) : key == "owner_id" ? page.data.users.find((e: { id: any }) => e.id == breakSpot[key]).display_name : breakSpot[key]}
						{/if}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
