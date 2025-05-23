<script lang="ts">
	import { page } from "$app/state";
	import { globalPopupState } from "$lib/globals";
	import { currentUser, isSuperUser, supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import FancyButton from "./FancyButton.svelte";
	import FancyCheckbox from "./FancyCheckbox.svelte";

	let { type } = $props();

	let selectedSpotCount = $state(0);
	let allSpotsSelected = $state(false);

	let isPopupVisible = $state(false);
	let isBuyingSpot = $state(false);

	const info: { [key: string]: { [key: string]: string } } = {
		mag: {
			heading: "",
			subheading: "",
			ctaText: "Next stream",
			overview: "",
		},
		slab: {
			heading: "",
			subheading: "",
			ctaText: "Next stream",
			overview: "",
		},
		repack: {
			heading: "",
			subheading: "",
			ctaText: "Next stream",
			overview: "",
		},
		break: {
			heading: "Experience amazing breaks",
			subheading: "Find our next break and secure your spot before it's gone!",
			ctaText: "Check spots",
			overview: "During a breaking stream, you get to watch as we open card hobby cases.\n\nEveryone who purchases a spot gets to keep all of the affiliated cards from that break, which are delivered after the stream ends.\n\nSpots are available for purchase before a break, but each spot can only go to one person.",
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

		(document.getElementById("button-delete-spots") as HTMLElement).innerText = `Delete ${selectedSpotCount} SPOT${selectedSpotCount == 1 ? "" : "s"}`;
	};

	onMount(() => {
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			(anchor as HTMLElement).addEventListener("click", (event) => {
				event.preventDefault();

				console.log(document.querySelector(anchor.getAttribute("href") as string));
				(document.querySelector(anchor.getAttribute("href") ?? "") as Element).scrollIntoView({
					behavior: "smooth",
				});
			});
		});
	});
</script>

<div class="absolute left-0 top-[82px] -z-10 w-screen h-screen max-h-[56rem] overflow-hidden">
	<img src="/images/hero-image-{type}.png" alt="" draggable="false" class="blur-sm w-full h-full object-cover object-center" />
</div>
<section class="flex gap-4 mt-64 mb-32">
	<article class="flex flex-col px-2 mx-auto gap-4 text-center [text-shadow:_0_2px_4px_black]">
		<h2>{getInfo("heading")}</h2>
		<h3 class="text-balance">{getInfo("subheading")}</h3>
		<a href="#stream" class="bg-glass-sm fancy-button w-fit mx-auto px-4 py-2 text-lg rounded-full">{getInfo("ctaText")}</a>
	</article>
</section>
<section class="flex flex-col items-center [&>*]:px-4 [&>*]:py-16 [&>*]:lg:py-32 [&>*]:w-full [&>*]:place-items-center [&_h2]:text-center [&_h2]:lg:text-left [&_h2]:lg:max-w-fit [&_h4]:text-center [&_h4]:lg:text-left [&_h4]:max-w-[32rem] [&_h3]:whitespace-pre-line [&_h4]:whitespace-pre-line [&_article]:flex [&_article]:flex-col [&_article]:lg:flex-row [&_article]:gap-16 [&_article]:lg:gap-32 [&_article]:items-center">
	<div class="bg-primary">
		<article>
			<h2>
				{type} Explained
			</h2>
			<h4>{getInfo("overview")}</h4>
		</article>
	</div>
	<div class="bg-secondary !py-8 lg:!py-16">
		<article id="stream">
			<a target="_blank" href={page.data.streams.find((e: { type: any }) => e.type == type)} class="cursor-pointer relative flex justify-center object-contain overflow-hidden !w-full max-h-[32rem] h-[32rem] [&:hover_img:last-child]:md:scale-110 lg:h-auto lg:max-h-none lg:max-w-[24rem] -mt-32 lg:mt-0 lg:rounded-2xl bg-primary sm:bg-transparent">
				<img src="https://stcebbhxlmcaweulagty.supabase.co/storage/v1/object/public/previews/{type}.jpg" alt="Next stream thumbnail" draggable="false" class="max-h-full mx-auto" />
				<div class="bg-black/60 w-full h-full absolute"></div>
				<img src="/icons/external-link.svg" alt="Link to next stream" class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 h-12 transition-transform duration-200" />
			</a>
			<h2>Next {type} Stream</h2>
		</article>
	</div>
	<article class="justify-center !items-center lg:!items-start !gap-0 sm:!gap-8 lg:!gap-4 sm:justify-evenly xl:justify-center xl:!gap-32 w-full">
		{#if type == "break"}
			<div class="w-screen sm:w-auto overflow-x-scroll">
				{#if isSuperUser($currentUser)}
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
							{#each (isSuperUser($currentUser) ? [""] : []).concat(["Spot", "Price", "Owner"]) as column}
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
						{#each page.data.breakSpots.sort((a: { name: any }, b: { name: any }) => a.name.localeCompare(b.name)) as breakSpot}
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
