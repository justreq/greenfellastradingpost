<script lang="ts">
	import { page } from "$app/state";
	import { serviceInfo, breakIDToShowSpots, globalPopupState } from "$lib/globals";
	import FancyButton from "./FancyButton.svelte";

	let { type } = $props();

	const getInfo = (key: string) => {
		return serviceInfo[type][key];
	};
</script>

<div class="absolute left-0 top-[52px] lg:top-[82px] -z-10 w-screen h-screen max-h-[56rem] overflow-hidden">
	<img src="/images/hero-image-{type}.jpg" alt="" draggable="false" class="blur-md w-full h-full object-cover object-center" />
	<div class="w-full h-full bg-black/40 absolute left-0 top-0"></div>
</div>
<section class="flex gap-4 my-8 lg:my-16">
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
<section class="flex flex-col items-center [&>*]:px-4 [&>*]:py-16 [&>*]:lg:py-32 [&>*]:w-full [&>*]:place-items-center [&_h2]:text-center [&_h2]:lg:text-left [&_h2]:lg:max-w-fit [&_h4]:text-center [&_h4]:lg:text-left [&_h4]:max-w-[32rem] [&_h3]:whitespace-pre-line [&_h4]:whitespace-pre-line [&_article]:flex [&_article]:flex-col [&_article]:md:flex-row [&_article]:gap-8 [&_article]:sm:gap-16 [&_article]:lg:gap-32 [&_article]:place-items-center">
	<div class="bg-primary">
		<article class="-mt-8 lg:-mt-24 mb-12 sm:!flex-row !gap-8">
			{#each getInfo("badges") as badges}
				<div class="bg-tertiary/60 border-tertiary border-2 rounded-xl py-6 flex flex-row sm:flex-col w-full sm:w-auto">
					<img src="/icons/{badges.icon}.svg" alt="" class="w-20 mx-4 sm:mx-8 sm:mb-4" />
					<p class="uppercase sm:text-center whitespace-pre-wrap my-auto sm:my-0 mx-4 sm:mx-0">
						{badges.text}
					</p>
				</div>
			{/each}
		</article>
		<article>
			<h2>{getInfo("overviewTitle")}</h2>
			<h4>{getInfo("overview")}</h4>
		</article>
	</div>
	{#if type == "psa"}
		<div class="bg-glass-secondary !px-1 sm:!px-2 flex flex-col gap-4 [&_div]:rounded-lg [&_div]:w-48 [&_div]:sm:w-64 [&_div]:bg-glass-secondary-sm [&_div]:p-2 [&_div]:sm:p-4 [&_h4]:!text-left [&_h4]:text-base [&_h4]:sm:text-lg [&_h4]:uppercase [&_h5]:text-accent [&_h5]:text-xl [&_h5]:sm:text-2xl [&_h5]:font-bold">
			<h2 class="text-5xl lg:text-7xl">Pricing*</h2>
			<article class="flex sm:!flex-row flex-wrap !gap-2 sm:!gap-4 justify-center w-full max-w-[72rem] [&>*]:flex [&>*]:sm:flex-col [&>*]:justify-between [&>*]:sm:justify-normal [&>*]:!w-full [&>*]:sm:!w-64">
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
				Cleaning is optional, <span class="text-accent">$2.99 per card cleaned</span>
				<br />
				*For more information on each pricing model, visit
				<span class="text-accent inline-block">
					<a target="_blank" class="underline inline-block" href="https://www.psacard.com/services/tradingcardgrading#card-authentication-and-grading-prices">
						<div class="hidden"></div>
						psacard.com
					</a>
				</span>
			</div>
		</div>
	{:else}
		<div class="bg-glass-secondary !py-8 lg:!py-16 relative">
			<article id="streams">
				<div class="flex flex-col gap-16">
					{#if page.data.streams.length == 0}
						<h2>No upcoming streams as of right now</h2>
					{:else}
						{#each page.data.streams as stream, index}
							<article>
								<a target="_blank" href={stream.link} class="cursor-pointer relative flex justify-center overflow-hidden [&:hover_img:last-child]:md:scale-110 h-auto max-w-[24rem] rounded-lg bg-primary sm:bg-transparent">
									<img src="https://stcebbhxlmcaweulagty.supabase.co/storage/v1/object/public/previews/{type}/{stream.id}.jpg" alt="Next stream thumbnail" draggable="false" class="h-full mx-auto aspect-square md:aspect-auto object-cover" />
									<div class="bg-black/60 w-full h-full absolute"></div>
									<img src="/icons/external-link.svg" alt="Link to next stream" class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 h-12 transition-transform duration-200" />
								</a>
								<div class="-mt-4 md:mt-0">
									<h2 class="md:!text-left text-3xl md:text-2xl lg:text-4xl">Upcoming {type.slice(0, -1)} Stream</h2>
									<h3 class="text-center md:text-left text-balance text-4xl md:text-3xl lg:text-5xl">{stream.name}</h3>
									{#if type == "breaks"}
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
					{/if}
				</div>
			</article>
		</div>
	{/if}
</section>
