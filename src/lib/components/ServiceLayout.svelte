<script lang="ts">
	import { page } from "$app/state";
	import { breakIDToShowSpots, globalPopupState } from "$lib/globals";
	import { onMount } from "svelte";
	import FancyButton from "./FancyButton.svelte";
	import FancyTextInput from "./FancyTextInput.svelte";
	let { supabase, user } = $derived(page.data);

	let { type } = $props();

	const psaServices = ["Value Bulk", "Value", "Value Plus", "Value Max", "Regular", "Express", "Super Express", "Walk-Through"];

	let selectedPSAServices: number[] = $state([]);
	let psaEmail = $state("");
	let psaNotes = $state("");
	let psaCardCount = $state("");

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
			overview: "You can access our PSA submission form below. You'll need to provide us basic information about each card you want to submit, including the PSA pricing model you want to use.\n\nOnce you submit the form and we look it over, we will email you an invoice you can pay for directly from the email.\n\nThe invoice will also contain an address for you to ship your cards to. When we receive your cards back from PSA, we will ship them straight back to you.",
		},
	};

	const getInfo = (key: string) => {
		return info[type][key];
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
<section class="flex flex-col items-center [&>*]:px-4 [&>*]:py-16 [&>*]:lg:py-32 [&>*]:w-full [&>*]:place-items-center [&_h2]:text-center [&_h2]:lg:text-left [&_h2]:lg:max-w-fit [&_h4]:text-center [&_h4]:lg:text-left [&_h4]:max-w-[32rem] [&_h3]:whitespace-pre-line [&_h4]:whitespace-pre-line [&_article]:flex [&_article]:flex-col [&_article]:md:flex-row [&_article]:gap-8 [&_article]:sm:gap-16 [&_article]:lg:gap-32 [&_article]:items-center">
	<div class="bg-glass">
		<article>
			<h2>{getInfo("overviewTitle")}</h2>
			<h4>{getInfo("overview")}</h4>
		</article>
	</div>
	{#if type == "psa"}
		<div class="bg-glass-secondary !px-1 sm:!px-2 flex flex-col gap-4 [&_div]:rounded-lg [&_div]:w-48 [&_div]:sm:w-64 [&_div]:bg-glass-secondary-sm [&_div]:p-2 [&_div]:sm:p-4 [&_h4]:!text-left [&_h4]:text-base [&_h4]:sm:text-lg [&_h4]:uppercase [&_h5]:text-accent [&_h5]:text-xl [&_h5]:sm:text-2xl [&_h5]:font-bold">
			<article class="!gap-4">
				<h2 class="text-5xl lg:text-7xl">Pricing</h2>
				<div class="!w-[90%] max-w-[32rem]">
					These prices cover our curing, direct walk-in, and the PSA submission cost. Cleaning incurs an additional <span class="text-accent">$2.99 per card</span>
					you want cleaned.
				</div>
			</article>
			<article class="flex !flex-row flex-wrap !gap-2 sm:!gap-4 justify-center w-full max-w-[72rem]">
				<div>
					<h4>Value Bulk</h4>
					<h5>$24.99 / card</h5>
				</div>
				<div>
					<h4>Value</h4>
					<h5>$29.99 / card</h5>
				</div>
				<div>
					<h4>Value Plus</h4>
					<h5>$44.99 / card</h5>
				</div>
				<div>
					<h4>Value Max</h4>
					<h5>$64.99 / card</h5>
				</div>
				<div>
					<h4>Regular</h4>
					<h5>$84.99 / card</h5>
				</div>
				<div>
					<h4>Express</h4>
					<h5>$159.99 / card</h5>
				</div>
				<div>
					<h4>Super Express</h4>
					<h5>$314.99 / card</h5>
				</div>
				<div>
					<h4>Walk-Through</h4>
					<h5>$614.99 / card</h5>
				</div>
			</article>
		</div>
	{/if}
	<div class="bg-glass-secondary !py-8 lg:!py-16 relative">
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
					<p class:hidden={!selectedPSAServices.includes(0)}>* Must be for at least 20 cards (PSA requirement)</p>
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
					<!-- <div class="flex gap-2"> -->
					<FancyTextInput bind:value={psaEmail} type="email" name="psa-email" placeholder="Email" required iconPath="/icons/email.svg" className="max-w-[24rem]" />
					<!-- <FancyTextInput type="number" min="1" bind:value={psaCardCount} required /> -->
					<!-- </div> -->
					<FancyButton type="submit" text="Submit" disabled={psaEmail == "" || selectedPSAServices.length == 0 || (selectedPSAServices.length > 1 && psaNotes == "")} className="max-w-64 fancy-anchor fancy-anchor-on !transition-all [&:not(:disabled)]:md:hover:scale-105 flex justify-center cursor-pointer disabled:bg-text/20" />
				</form>
			{:else}
				<div class="flex flex-col gap-16">
					{#each page.data.streams as stream, index}
						<article>
							<a target="_blank" href={stream.link} class="cursor-pointer relative flex justify-center overflow-hidden [&:hover_img:last-child]:md:scale-110 h-auto max-w-[24rem] rounded-lg bg-primary sm:bg-transparent">
								<img src="https://stcebbhxlmcaweulagty.supabase.co/storage/v1/object/public/previews/{type}/{stream.id}.jpg" alt="Next stream thumbnail" draggable="false" class="h-full mx-auto aspect-square md:aspect-auto object-cover" />
								<div class="bg-black/60 w-full h-full absolute"></div>
								<img src="/icons/external-link.svg" alt="Link to next stream" class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 h-12 transition-transform duration-200" />
							</a>
							<div class="-mt-4 md:mt-0">
								<h2 class="md:!text-left text-3xl md:text-2xl lg:text-4xl">Upcoming {type} Stream</h2>
								<h3 class="text-center md:text-left text-balance text-4xl md:text-3xl lg:text-5xl">{stream.name}</h3>
								{#if type == "break"}
									<FancyButton
										onclick={() => {
											$globalPopupState = "breakspots";
											$breakIDToShowSpots = stream.id;
										}}
										text="Purchase Spots"
										className="fancy-button rounded-full mt-4 text-xl fancy-anchor fancy-anchor-on mx-auto md:mx-0"
									/>
								{/if}
							</div>
						</article>
						<hr class:hidden={index == page.data.streams.length - 1} class="bg-tertiary border-none h-1 rounded-full" />
					{/each}
				</div>
			{/if}
		</article>
	</div>
</section>
