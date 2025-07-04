<script lang="ts">
	import { page } from "$app/state";
	import FancyButton from "$lib/components/FancyButton.svelte";
	import FancyCheckbox from "$lib/components/FancyCheckbox.svelte";
	import FancyTextInput from "$lib/components/FancyTextInput.svelte";
	let { supabase } = $derived(page.data);

	const convertFloatToPrice = (float: number) => {
		const formatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			trailingZeroDisplay: "stripIfInteger",
		});

		return formatter.format(float);
	};

	let isNewCardFormVisible = $state(false);
	let brand = $state("");
	let year = $state("");
	let set = $state("");
	let player = $state("");
	let sellPrice = $state("");
	let frontImage = $state("");
	let backImage = $state("");

	const stringToHTMLName = (string: string) => {
		return string.toLowerCase().replaceAll(" ", "-");
	};

	const closeNewCardForm = () => {
		isNewCardFormVisible = false;
		document.body.classList.remove("!overflow-y-hidden");
		(document.getElementById("new-card-form") as HTMLFormElement).reset();
	};

	const submitNewCardForm = async () => {
		const formData = Object.fromEntries(new FormData(document.getElementById("new-card-form") as HTMLFormElement));

		const card = {
			brand: formData.brand,
			set: formData.set,
			player: formData.player,
			year: formData.year,
			sell_price: formData.sell,
			number: formData.number || "",
			grade: formData.grade || "",
			auto: formData.auto == "on" || false,
			patch: formData.patch == "on" || false,
			retail: formData.retail == "on" || false,
		};

		const { data, error } = await supabase.from("cards").insert(card).select();
		if (error) throw error;
		else {
			const frontExtension = (document.getElementById("front") as HTMLInputElement).value.split(".")[1];
			const backExtension = (document.getElementById("back") as HTMLInputElement).value.split(".")[1];
			const product = await supabase
				.from("cards")
				.update({ file_extensions: [frontExtension, backExtension] })
				.eq("id", data[0].id)
				.select();

			const productID = product.data == null ? "unknown" : product.data[0].id;

			[
				{ name: `0.${frontExtension}`, file: ((document.getElementById("front") as HTMLInputElement).files as FileList)[0] },
				{ name: `1.${backExtension}`, file: ((document.getElementById("back") as HTMLInputElement).files as FileList)[0] },
			].forEach(async (fileData, index) => {
				const { error } = await supabase.storage.from("product_images").upload(`${productID}/${index}.jpg`, fileData.file, {
					contentType: fileData.file.type,
					upsert: true,
				});

				if (error) throw error;
			});
		}

		closeNewCardForm();
	};
</script>

<section class="w-[90%] 2xl:w-[90rem] h-full p-4 mx-auto bg-glass-sm rounded-lg">
	<header class="flex justify-between mb-2">
		<h2>Inventory (Cards)</h2>
		<FancyButton
			iconPath="/icons/plus.svg"
			onclick={() => {
				document.body.classList.add("!overflow-y-hidden");
				isNewCardFormVisible = true;
			}}
			className="bg-secondary !transition-all md:hover:scale-110"
		/>
	</header>
	<table class="block table-fixed overflow-scroll border-separate [&_td]:whitespace-nowrap [&_td]:overflow-scroll [&_td]:rounded-sm [&_td]:p-2">
		<thead class="bg-accent2/60">
			<tr>
				{#each page.data.cards.length == 0 ? [] : Object.keys(page.data.cards[0]).slice(3, -2) as column}
					<td>
						{column[0].toUpperCase() + column.slice(1).replaceAll("_", " ")}
					</td>
				{/each}
			</tr>
		</thead>
		{#each page.data.cards as card}
			<tbody class="even:bg-tertiary/80 odd:bg-secondary/80 [&_td]:!select-text">
				<tr>
					{#each Object.keys(card).slice(3, -2) as key}
						<td>{key.includes("price") ? convertFloatToPrice(card[key]) : ["auto", "patch", "sold"].includes(key) ? (card[key] ? "✅" : "❌") : card[key]}</td>
					{/each}
				</tr>
			</tbody>
		{/each}
	</table>
</section>

<section class:hidden={!isNewCardFormVisible} class="absolute w-screen h-screen left-0 top-0 z-20 overflow-y-scroll [&_hr]:border-none [&_hr]:mt-2 [&_hr]:col-span-6 [&_hr]:h-0.5 [&_hr]:lg:h-1 [&_hr]:bg-tertiary [&_hr]:rounded-full">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="bg-black/80 w-full h-[50vh] sm:h-full" onclick={closeNewCardForm}></div>
	<article class="sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 bg-glass sm:bg-glass-sm w-full sm:w-max mx-auto p-4 pb-24 sm:pb-4 rounded-lg">
		<form class="flex flex-col lg:flex-row gap-2 [&>div]:h-fit [&>div]:sm:w-[32rem] [&>div]:lg:w-[24rem] [&>div]:grid [&>div]:grid-cols-6 [&>div]:gap-x-2 [&>div]:gap-y-1 [&>div>p]:col-span-6 [&>div>p]:mb-4 [&>div>p]:text-sm [&>div>p]:lg:text-base [&_input[type=text]]:pr-0 [&_label]:col-span-6" id="new-card-form">
			<datalist id="brands">
				{#each [...new Set(page.data.cards.map((e: { brand: any }) => e.brand))] as brand}
					<option value={brand}>{brand}</option>
				{/each}
			</datalist>
			{#each [...new Set(page.data.cards.map((e: { brand: any }) => e.brand))] as brand}
				<datalist id="set-{stringToHTMLName(brand as string)}">
					{#each [...new Set(page.data.cards.filter((e: { brand: any }) => e.brand == brand).map((e: { set: any }) => e.set))] as set}
						<option value={set}>{set}</option>
					{/each}
				</datalist>
			{/each}
			<datalist id="years">
				{#each [...new Set(page.data.cards.map((e: { year: any }) => e.year))] as year}
					<option value={year}>{year}</option>
				{/each}
			</datalist>
			<datalist id="players">
				{#each [...new Set(page.data.cards.map((e: { player: any }) => e.player))] as player}
					<option value={player}>{player}</option>
				{/each}
			</datalist>
			<datalist id="numbers">
				{#each [...new Set(page.data.cards.map((e: { number: any }) => e.number))] as number}
					<option value={number}>{number}</option>
				{/each}
			</datalist>
			<datalist id="grades">
				{#each [...new Set(page.data.cards.map((e: { grade: any }) => e.grade))] as grade}
					<option value={grade}>{grade}</option>
				{/each}
			</datalist>
			<div>
				<h2 class="text-center col-span-6">Add a new card</h2>
				<p>Please use full names and proper capitalization (e.g. "PSA 10", "Upper Deck", "Chrome", "Kylian Mbappe")</p>
				<FancyTextInput name="brand" placeholder="Brand" required list="brands" bind:value={brand} className="col-span-3" />
				<FancyTextInput name="set" placeholder={brand == "" ? "Set" : `Set (${brand})`} required bind:value={set} list="set-{stringToHTMLName(brand)}" className="col-span-3" />
				<FancyTextInput name="player" placeholder="Player" required list="players" bind:value={player} className="col-span-6" />
				<FancyTextInput name="year" placeholder="Year" required list="years" bind:value={year} className="col-span-2" />
				<FancyTextInput name="number" placeholder="Number" list="numbers" className="col-span-2" />
				<FancyTextInput name="grade" placeholder="Grade" list="grades" className="col-span-2" />
				<FancyCheckbox id="auto" className="col-span-2">Auto</FancyCheckbox>
				<FancyCheckbox id="patch" className="col-span-2">Patch</FancyCheckbox>
			</div>
			<hr />
			<div>
				<label for="bought">Buy Information</label>
				<FancyTextInput type="number" name="sell" placeholder="Sell Price" required bind:value={sellPrice} step="any" className="col-span-3" />
				<FancyCheckbox id="retail" className="col-span-6">Retail (should this card appear on the website?)</FancyCheckbox>
				<hr />
				<label for="front-image" class="!col-span-3">Front Image</label>
				<label for="back-image" class="!col-span-3">Back Image</label>
				<FancyTextInput type="file" name="front" required bind:value={frontImage} accept="image/*" className="col-span-3" />
				<FancyTextInput type="file" name="back" required bind:value={backImage} accept="image/*" className="col-span-3" />
				<p>Both images should be oriented properly and cropped along the border of the mag / slab / card</p>
				<FancyButton text="Add Card" onclick={submitNewCardForm} disabled={[brand, year, set, player, sellPrice, frontImage, backImage].some((e) => e == null || e == "")} className="bg-accent/60 justify-center mt-4 col-span-6" />
				<hr class="sm:hidden" />
			</div>
		</form>
	</article>
</section>
