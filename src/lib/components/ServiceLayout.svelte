<script lang="ts">
	import { page } from "$app/state";
	import { globalPopupState } from "$lib/globals";
	import { isSuperUser } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import FancyButton from "./FancyButton.svelte";
	import FancyCheckbox from "./FancyCheckbox.svelte";
	import FancyTextInput from "./FancyTextInput.svelte";
	let { supabase, user } = $derived(page.data);

	let { type } = $props();

	let selectedSpotCount = $state(0);
	let allSpotsSelected = $state(false);

	let isPopupVisible = $state(false);
	let isBuyingSpot = $state(false);

	const psaServices = ["Value Bulk", "Value", "Value Plus", "Value Max", "Regular", "Express", "Super Express", "Walk-Through"];

	let selectedPSAServices: number[] = $state([]);
	let psaEmail = $state("");
	let psaNotes = $state("");

	const togglePSAService = (index: number) => {
		if (selectedPSAServices.includes(index)) {
			selectedPSAServices.splice(selectedPSAServices.indexOf(index), 1);
		} else selectedPSAServices.push(index);
	};

	const submitPSARequest = async (event: Event) => {
		event.preventDefault();

		const { error } = await supabase.from("psa_submissions").insert({ from_email: psaEmail, services: selectedPSAServices.map((e) => psaServices[e]), notes: psaNotes });
		if (error) throw error;

		(document.getElementById("psa-confirmation") as HTMLDialogElement).showModal();
	};

	const info: { [key: string]: { [key: string]: string } } = {
		mag: {
			heading: "",
			subheading: "",
			ctaText: "Next stream",
			overviewTitle: "Mag streams explained",
			overview: "",
		},
		slab: {
			heading: "",
			subheading: "",
			ctaText: "Next stream",
			overviewTitle: "Slab streams explained",
			overview: "",
		},
		repack: {
			heading: "",
			subheading: "",
			ctaText: "Next stream",
			overviewTitle: "Repacks explained",
			overview: "",
		},
		break: {
			heading: "Experience amazing breaks",
			subheading: "Find our next break and secure your spot before it's gone!",
			ctaText: "Check spots",
			overviewTitle: "Breaks explained",
			overview: "During a breaking stream, you get to watch as we open card hobby cases.\n\nEveryone who purchases a spot gets to keep all of the affiliated cards from that break, which are delivered after the stream ends.\n\nSpots are available for purchase before a break, but each spot can only go to one person.",
		},
		psa: {
			heading: "Grade your cards faster than ever",
			subheading: "Skip PSA's processing times when you grade your cards through us!",
			ctaText: "Submit Request",
			overviewTitle: "How does it work?",
			overview: "Below is a form you can submit for a PSA submission request. You will need to choose a PSA pricing model. You CAN choose multiple, but you have to specify which of your cards apply to which one.\n\nAfter submitting the form, you will be sent an email with a quote containing information on how to pay us and where to ship your cards.\n\nWe will hand-deliver your cards to PSA, skipping any processing times and ensuring quick turnover rates.\n\nWhen we recieve your graded cards, we will email you once again, this time asking for an address to ship the graded cards to.",
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
		if (user != null) psaEmail = user.email || "";

		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			(anchor as HTMLElement).addEventListener("click", (event) => {
				event.preventDefault();

				(document.querySelector(anchor.getAttribute("href") ?? "") as Element).scrollIntoView({
					behavior: "smooth",
				});
			});
		});
	});

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

<div class="absolute left-0 top-[82px] -z-10 w-screen h-screen max-h-[56rem] overflow-hidden">
	<img src="/images/hero-image-{type}.png" alt="" draggable="false" class="blur-sm w-full h-full object-cover object-center" />
</div>
<section class="flex gap-4 mt-64 mb-32">
	<article class="flex flex-col px-2 mx-auto gap-4 text-center [text-shadow:_0_2px_4px_black]">
		<h2>{getInfo("heading")}</h2>
		<h3 class="text-balance">{getInfo("subheading")}</h3>
		<a href={type == "psa" ? "#form" : "#stream"} class="bg-glass-sm fancy-button w-fit mx-auto px-4 py-2 text-lg rounded-full">{getInfo("ctaText")}</a>
	</article>
</section>
<section class="flex flex-col items-center [&>*]:px-4 [&>*]:py-16 [&>*]:lg:py-32 [&>*]:w-full [&>*]:place-items-center [&_h2]:text-center [&_h2]:lg:text-left [&_h2]:lg:max-w-fit [&_h4]:text-center [&_h4]:lg:text-left [&_h4]:max-w-[32rem] [&_h3]:whitespace-pre-line [&_h4]:whitespace-pre-line [&_article]:flex [&_article]:flex-col [&_article]:sm:flex-row [&_article]:gap-16 [&_article]:lg:gap-32 [&_article]:items-center">
	<div class="bg-primary">
		<article>
			<h2>
				{getInfo("overviewTitle")}
			</h2>
			<h4>{getInfo("overview")}</h4>
		</article>
	</div>
	<div class="bg-secondary !py-8 lg:!py-16">
		<article id={type == "psa" ? "form" : "stream"}>
			{#if type == "psa"}
				<dialog id="psa-confirmation" class="m-auto bg-glass-sm p-4 rounded-lg max-w-[95vw]">Thank you for submitting! We will send a quote to your email very soon.</dialog>
				<form class="max-w-[64rem] flex flex-col gap-2 px-2" method="post" onsubmit={submitPSARequest}>
					<h2>PSA Submission Form</h2>
					<p>
						Choose one or more of the service options below. If you choose multiple options, <span class="font-extrabold text-red-500">you are required</span>
						to specify which of your submitted cards apply to each one.
					</p>
					<div class="flex flex-wrap gap-1 sm:gap-2 [&>*]:bg-glass [&>*]:text-sm [&>*]:sm:text-base">
						<FancyButton text="Value Bulk*" isTogglable toggleValue={selectedPSAServices.includes(0)} onclick={() => togglePSAService(0)} />
						<FancyButton text="Value" isTogglable toggleValue={selectedPSAServices.includes(1)} onclick={() => togglePSAService(1)} />
						<FancyButton text="Value Plus" isTogglable toggleValue={selectedPSAServices.includes(2)} onclick={() => togglePSAService(2)} />
						<FancyButton text="Value Max" isTogglable toggleValue={selectedPSAServices.includes(3)} onclick={() => togglePSAService(3)} />
						<FancyButton text="Regular" isTogglable toggleValue={selectedPSAServices.includes(4)} onclick={() => togglePSAService(4)} />
						<FancyButton text="Express" isTogglable toggleValue={selectedPSAServices.includes(5)} onclick={() => togglePSAService(5)} />
						<FancyButton text="Super Express" isTogglable toggleValue={selectedPSAServices.includes(6)} onclick={() => togglePSAService(6)} />
						<FancyButton text="Walk-Through" isTogglable toggleValue={selectedPSAServices.includes(7)} onclick={() => togglePSAService(7)} />
					</div>
					<p class:hidden={!selectedPSAServices.includes(0)}>* Must be for at least 20 cards</p>
					<h5 class="inline text-xs sm:text-sm lg:text-base font-bold">
						For more information about PSA's pricing options, visit
						<span>
							<a class="text-accent underline" target="_blank" href="https://www.psacard.com/services/tradingcardgrading#card-authentication-and-grading-prices">
								psacard.com/services/tradingcardgrading
								<div></div>
							</a>
						</span>
					</h5>
					<textarea name="grade-cards" id="grade-cards" bind:value={psaNotes} class:hidden={selectedPSAServices.length < 2} class="h-64" placeholder="Notes (required if you select multiple services, see above)"></textarea>
					<label for="psa-email">Contact Email</label>
					<FancyTextInput bind:value={psaEmail} type="email" name="psa-email" placeholder="Email" required iconPath="/icons/email.svg" className="max-w-[24rem]" />
					<FancyButton type="submit" text="Submit" disabled={psaEmail == "" || selectedPSAServices.length == 0 || (selectedPSAServices.length > 1 && psaNotes == "")} className="max-w-64 fancy-anchor fancy-anchor-on !transition-all [&:not(:disabled)]:md:hover:scale-105 flex justify-center cursor-pointer disabled:bg-text/20" />
				</form>
			{:else}
				<a target="_blank" href={page.data.streams.find((e: { type: any }) => e.type == type).link} class="cursor-pointer relative flex justify-center object-contain overflow-hidden [&:hover_img:last-child]:md:scale-110 h-auto max-w-[24rem] lg:rounded-2xl bg-primary sm:bg-transparent">
					<img src="https://stcebbhxlmcaweulagty.supabase.co/storage/v1/object/public/previews/{type}.jpg" alt="Next stream thumbnail" draggable="false" class="max-h-full mx-auto" />
					<div class="bg-black/60 w-full h-full absolute"></div>
					<img src="/icons/external-link.svg" alt="Link to next stream" class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 h-12 transition-transform duration-200" />
				</a>
				<div>
					<h2 class="sm:!text-left text-xl sm:text-2xl md:text-3xl lg:text-4xl">Next {type} Stream</h2>
					<h3 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{page.data.streams.find((e: { type: any }) => e.type == type).name}</h3>
				</div>
			{/if}
		</article>
	</div>
	<article class="justify-center !items-center lg:!items-start !gap-0 sm:!gap-8 lg:!gap-4 sm:justify-evenly xl:justify-center xl:!gap-32 w-full">
		{#if type == "break"}
			<div class="w-screen sm:w-auto overflow-x-scroll">
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
						{#each page.data.breakSpots.sort((a: { name: any }, b: { name: any }) => a.name.localeCompare(b.name)) as breakSpot}
							<tr data-id={breakSpot.id}>
								{#each (isSuperUser(user) ? [""] : []).concat(Object.keys(breakSpot).slice(2, 5)) as key}
									<td class:text-accent2={breakSpot[key] == null}>
										{#if key == ""}
											<FancyCheckbox className="gap-0" value={allSpotsSelected} onclick={trackSelectedSpots} />
										{/if}
										{#if key != "" && breakSpot[key] == null}
											<span>
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
