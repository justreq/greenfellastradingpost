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
			ctaText: "Get Spots",
			overviewTitle: "Breaks explained",
			overview: "During a breaking stream, you get to watch as we open card hobby cases.\n\nEveryone who purchases a spot gets to keep all of the affiliated cards from that break, which are delivered after the stream ends.\n\nSpots are available for purchase before a break, but each spot can only go to one person.",
		},
		psa: {
			heading: "Grade your cards faster than ever",
			subheading: "Skip PSA's processing times when you grade your cards through us!",
			ctaText: "Submit Form",
			overviewTitle: "How does it work?",
			overview: "You can access the PSA submission form above. You'll need to provide basic information about each card you want to submit.\n\nOnce you submit the form, you'll be shown an address to ship your cards to. When we receive your cards, we will hand-deliver them to PSA, ensuring they skip processing and go straight to grading.\n\nWhen we receive your cards back from PSA, we will ship them to the address you provided when submitting the form.",
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

<div class="absolute left-0 top-[52px] lg:top-[82px] -z-10 w-screen h-screen max-h-[56rem] overflow-hidden">
	<img src="/images/hero-image-{type}.png" alt="" draggable="false" class="blur-sm w-full h-full object-cover object-center" />
</div>
<section class="flex gap-4 mt-64 mb-32">
	<article class="flex flex-col px-2 mx-auto gap-4 text-center [text-shadow:_0_2px_4px_black]">
		<h2>{getInfo("heading")}</h2>
		<h3 class="text-balance">{getInfo("subheading")}</h3>
		<div class="mt-4 [&>*]:bg-glass-sm [&>*]:fancy-button [&>*]:w-fit [&>*]:mx-auto [&>*]:px-4 [&>*]:py-2 [&>*]:text-lg [&>*]:rounded-full">
			{#if type == "psa"}
				<button onclick={() => ($globalPopupState = "psaform")} type="button">{getInfo("ctaText")}</button>
			{:else}
				<a href="#streams">{getInfo("ctaText")}</a>
			{/if}
		</div>
	</article>
</section>
<section class="flex flex-col items-center [&>*]:px-4 [&>*]:py-16 [&>*]:lg:py-32 [&>*]:w-full [&>*]:place-items-center [&_h2]:text-center [&_h2]:lg:text-left [&_h2]:lg:max-w-fit [&_h4]:text-center [&_h4]:lg:text-left [&_h4]:max-w-[32rem] [&_h3]:whitespace-pre-line [&_h4]:whitespace-pre-line [&_article]:flex [&_article]:flex-col [&_article]:md:flex-row [&_article]:gap-8 [&_article]:sm:gap-16 [&_article]:lg:gap-32 [&_article]:items-center">
	<div class="bg-primary">
		<article>
			<h2>{getInfo("overviewTitle")}</h2>
			<h4>{getInfo("overview")}</h4>
		</article>
	</div>
	{#if type == "psa"}
		<div class="bg-glass-secondary !px-1 sm:!px-2 flex flex-col gap-4 [&_div]:rounded-lg [&_div]:w-48 [&_div]:sm:w-64 [&_div]:bg-glass-secondary-sm [&_div]:p-2 [&_div]:sm:p-4 [&_h4]:!text-left [&_h4]:text-base [&_h4]:sm:text-lg [&_h4]:uppercase [&_h5]:text-accent [&_h5]:text-xl [&_h5]:sm:text-2xl [&_h5]:font-bold">
			<h2 class="text-5xl lg:text-7xl">Pricing</h2>
			<article class="flex sm:!flex-row flex-wrap !gap-2 sm:!gap-4 justify-center w-full max-w-[72rem] [&>*]:flex [&>*]:sm:flex-col [&>*]:justify-between [&>*]:sm:justify-normal [&>*]:!w-[95%] [&>*]:sm:!w-64">
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
			<div class="!w-[95%] max-w-[67rem] text-balance text-center sm:text-lg">
				These prices cover our curing, direct walk-in, and the PSA submission cost. Cleaning incurs an additional <span class="text-accent">$2.99 per card</span>
				you want cleaned. For more information about PSA's pricing models, visit
				<span class="text-accent inline-block">
					<a target="_blank" class="underline inline-block" href="https://www.psacard.com/services/tradingcardgrading#card-authentication-and-grading-prices">
						<div class="hidden"></div>
						psacard.com
					</a>
				</span>
			</div>
		</div>
	{/if}
	{#if type != "psa"}
		<div class="bg-glass-secondary !py-8 lg:!py-16 relative">
			<article id="streams">
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
			</article>
		</div>
	{/if}
</section>
