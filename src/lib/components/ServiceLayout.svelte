<script lang="ts">
	import { page } from "$app/state";
	import { currentUser, isSuperUser, supabase } from "$lib/supabaseClient";
	import FancyCheckbox from "./FancyCheckbox.svelte";
	import FancyTextInput from "./FancyTextInput.svelte";

	let { type } = $props();

	let selectedSpotCount = $state(0);
	let allSpotsSelected = $state(false);

	let isPopupVisible = $state(false);
	let isBuyingSpot = $state(false);

	const info: { [key: string]: { [key: string]: string } } = {
		breaks: {
			heading: "Experience amazing breaks",
			subheading: "Find our next break and secure your spot before it's gone!",
			ctaText: "Check spots",
			ctaPath: "#break-spots",
			overview: "During a breaking stream, you get to watch as we open card hobby cases. Each stream will see a different case (e.g. Topps Merlin, Panini Immaculate).\n\nAt the end of the stream, everyone who purchased a team spot gets to keep all of the cards from the case that belong to the respective team.\n\nTeam spots are available for purchase before the stream starts, but each spot can only go to one person.",
			nextStream: "24/25 FOTL PANINI PRIZM EPL\nShowtime TBD",
		},
	};

	const getInfo = (key: string) => {
		return info[type][key];
	};

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

		if (selectedSpotCount > 0) (document.getElementById("delete-spots") as HTMLElement).innerText = `Delete ${selectedSpotCount} SPOT${selectedSpotCount == 1 ? "" : "s"}`;
	};

	const toggleCreateSpotForm = async (value: boolean, submit = false) => {
		const form = document.getElementById("create-new-spot-form") as HTMLFormElement;

		if (submit) {
			const data = Object.fromEntries(new FormData(form));

			const { error } = await supabase.from("break_spots").insert({ name: data.spot_name, price: data.spot_price, break_id: page.data.break.id });
			if (error) throw error;

			location.reload();
		}

		if (value) document.body.classList.add("!overflow-y-hidden");
		else {
			document.body.classList.remove("!overflow-y-hidden");
			form.reset();
		}

		isPopupVisible = value;
	};
</script>

<div class="absolute left-0 top-[82px] -z-10 w-screen h-screen max-h-[56rem] overflow-hidden">
	<img src="/images/hero-image-{type}.png" alt="" draggable="false" class="blur-sm w-full h-full object-cover object-center" />
</div>
<section class="flex gap-4 mt-64 mb-32">
	<article class="flex flex-col px-2 mx-auto gap-4 text-center [text-shadow:_0_2px_4px_black]">
		<h2>{getInfo("heading")}</h2>
		<h3 class="text-balance">{getInfo("subheading")}</h3>
		<a href={getInfo("ctaPath")} class="bg-glass-sm fancy-button w-fit mx-auto px-4 py-2 text-lg rounded-full">{getInfo("ctaText")}</a>
	</article>
</section>
<section class="flex flex-col gap-32 items-center [&_h2]:text-center [&_h2]:lg:text-left [&_h2]:lg:max-w-fit [&_h4]:text-center [&_h4]:lg:text-left [&_h4]:max-w-[32rem] [&_h3]:whitespace-pre-line [&_h4]:whitespace-pre-line [&_article]:flex [&_article]:flex-col [&_article]:lg:flex-row [&_article]:gap-16 [&_article]:lg:gap-32 [&_article]:items-center">
	<div class="bg-primary px-4 py-16 lg:py-32 w-full place-items-center">
		<article>
			<h2>
				{type}:
				<br />
				A brief overview
			</h2>
			<h4>{getInfo("overview")}</h4>
		</article>
		<div id="break-spots"></div>
	</div>
	<article class="justify-center !items-center lg:!items-start !gap-0 sm:!gap-8 lg:!gap-4 sm:justify-evenly xl:justify-center xl:!gap-32 w-full">
		<div class="relative flex justify-center object-contain overflow-hidden !w-full max-h-[32rem] h-[32rem] lg:h-auto lg:max-h-none lg:max-w-[24rem] -mt-32 lg:mt-0 lg:rounded-md">
			<img src="/images/next-stream-{type}.png" alt="Next stream thumbnail backdrop" draggable="false" class="lg:hidden !absolute w-full blur-md -z-10 top-1/4 -translate-y-1/4" />
			<img src="/images/next-stream-{type}.png" alt="Next stream thumbnail" draggable="false" class="max-h-full mx-auto rounded-sm" />
			<span class="absolute px-4 flex flex-col w-full max-w-[24rem] h-full justify-between bottom-0 p-2 [text-shadow:_0_0_2px_secondary] [&>*]:text-primary [&>*]:mx-auto [&>*]:text-center">
				<h2>
					Next {type.slice(0, type.length - 1)} stream
				</h2>
				<h3>{getInfo("nextStream")}</h3>
			</span>
		</div>
		{#if type == "breaks"}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				id="popup-backdrop"
				class:hidden={!isPopupVisible}
				class="bg-black/80 w-screen h-screen fixed left-0 top-0 z-20 flex"
				onclick={(event: Event) => {
					if ((event.target as HTMLElement).id != "popup-backdrop") return;
					toggleCreateSpotForm(false);
					isBuyingSpot = false;
				}}
			>
				<div class="m-auto w-3/4 sm:w-1/2 lg:w-fit p-4 bg-glass-sm rounded-lg">
					<div class:hidden={!isBuyingSpot} class="min-w-[32rem]">
						<div id="paypal-container-2Q7MW8YTLFWAW" class="[&_.amount-container]:pointer-events-none [&_.amount-container]:select-none [&_.amount-container]:[tabindex:-1]"></div>
						<script>
							paypal
								.HostedButtons({
									hostedButtonId: "2Q7MW8YTLFWAW",
								})
								.render("#paypal-container-2Q7MW8YTLFWAW");
						</script>
					</div>
					<form
						class:hidden={isBuyingSpot}
						id="create-new-spot-form"
						onsubmit={() => {
							toggleCreateSpotForm(false, true);
						}}
						class="flex flex-col gap-1"
					>
						<FancyTextInput name="spot_name" placeholder="Spot Name" required />
						<FancyTextInput name="spot_price" type="number" placeholder="Spot Price" step="any" required />
						<button type="submit" class="fancy-button fancy-anchor-on w-full mt-3">Create New Spot</button>
					</form>
				</div>
			</div>
			<div class="w-screen sm:w-auto overflow-x-scroll">
				<table id="break-spots-table" class="block mx-auto w-fit table-fixed overflow-scroll border-separate [&_td]:overflow-scroll [&_td]:rounded-sm [&_td]:p-2">
					<thead class="bg-accent2/60">
						<tr>
							{#each (isSuperUser($currentUser) ? [""] : []).concat(["Spot", "Price", "Owner"]) as column}
								<td>
									{column}
								</td>
							{/each}
						</tr>
					</thead>
					<tbody class="even:bg-tertiary/80 odd:bg-secondary/80 [&_td]:!select-text [&_button:not(:has(*))]:fancy-button [&_button:not(:has(*))]:bg-accent2/20 [&_button:not(:has(*))]:border-accent2/40">
						{#if isSuperUser($currentUser)}
							<tr>
								<td>
									<FancyCheckbox
										id="select-all-spots"
										className="gap-0"
										bind:value={allSpotsSelected}
										onclick={(cb: Event) => {
											trackSelectedSpots(cb, Array.from(document.getElementById("break-spots-table")?.querySelectorAll("tr") as NodeList).length - 1);
										}}
									/>
								</td>
								<td>
									<span>
										<button
											class:hidden={selectedSpotCount > 0}
											id="create-new-spot"
											onclick={() => {
												toggleCreateSpotForm(true);
											}}
										>
											Create New Spot
										</button>
										<button
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
											class:hidden={selectedSpotCount == 0}
											class="!bg-red-500/20 !border-red-500/40 md:hover:!border-red-500 md:hover:!text-red-500"
										>
											Delete {selectedSpotCount} Spot{selectedSpotCount == 1 ? "" : "s"}
										</button>
									</span>
								</td>
								<td></td>
								<td></td>
							</tr>
						{/if}
						{#each page.data.breakSpots.filter((e: { break_id: any }) => e.break_id == page.data.break.id).sort((a: { name: any }, b: { name: any }) => a.name.localeCompare(b.name)) as breakSpot}
							<tr data-id={breakSpot.id}>
								{#each (isSuperUser($currentUser) ? [""] : []).concat(Object.keys(breakSpot).slice(2, 5)) as key}
									<td class:text-accent2={breakSpot[key] == null}>
										{#if key == ""}
											<FancyCheckbox className="gap-0" value={allSpotsSelected} onclick={trackSelectedSpots} />
										{/if}
										{#if key != "" && breakSpot[key] == null}
											<span>
												<button
													onclick={() => {
														isPopupVisible = true;
														isBuyingSpot = true;
													}}
												>
													Buy Spot
												</button>
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
			</div>
		{/if}
	</article>
</section>
