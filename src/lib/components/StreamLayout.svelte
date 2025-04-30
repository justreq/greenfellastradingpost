<script lang="ts">
	import { page } from "$app/state";

	export let type: "breaks";

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
			<div class="w-screen sm:w-auto overflow-x-scroll">
				<table class="block mx-auto w-fit table-fixed overflow-scroll border-separate [&_td]:overflow-scroll [&_td]:rounded-sm [&_td]:p-2">
					<thead class="bg-accent2/60">
						<tr>
							{#each ["Spot", "Price", "Owner"] as column}
								<td>
									{column}
								</td>
							{/each}
						</tr>
					</thead>
					{#each page.data.breakSpots.filter((e: { break_id: any }) => e.break_id == page.data.break.id).sort((a: { name: any }, b: { name: any }) => a.name.localeCompare(b.name)) as breakSpot}
						<tbody class="even:bg-tertiary/80 odd:bg-secondary/80 [&_td]:!select-text [&_button]:fancy-button [&_button]:bg-accent2/20 [&_button]:border-accent2/40">
							<tr>
								{#each Object.keys(breakSpot).slice(2, 5) as key}
									<td class:text-accent2={breakSpot[key] == null}>
										{#if breakSpot[key] == null}
											<span>
												<button>Buy Spot</button>
											</span>
										{:else}
											{key == "price" ? convertFloatToPrice(breakSpot[key]) : key == "owner_id" ? page.data.users.find((e: { id: any }) => e.id == breakSpot[key]).display_name : breakSpot[key]}
										{/if}
									</td>
								{/each}
							</tr>
						</tbody>
					{/each}
				</table>
			</div>
		{/if}
	</article>
</section>
