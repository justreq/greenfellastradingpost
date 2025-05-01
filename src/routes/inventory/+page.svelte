<script lang="ts">
	import FancyButton from "$lib/components/FancyButton.svelte";
	import FancyCheckbox from "$lib/components/FancyCheckbox.svelte";
	import FancyTextInput from "$lib/components/FancyTextInput.svelte";
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	let { data } = $props();

	let columns: [{ column_name: string; data_type: string }] = $state([{ column_name: "", data_type: "" }]);

	const convertTimestampToReadable = (timestamp: string) => {
		if (timestamp == null) return "❌";

		const date = new Date(timestamp);

		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};

		const formatter = new Intl.DateTimeFormat("en-US", options);
		return formatter.format(date);
	};

	const convertFloatToPrice = (float: number) => {
		const formatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			trailingZeroDisplay: "stripIfInteger",
		});

		return formatter.format(float);
	};

	let date = new Date();

	let isNewCardFormVisible = $state(false);
	let brand = $state("");
	let year = $state("");
	let set = $state("");
	let player = $state("");
	let comp = $state("");
	let buyPrice = $state("");
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
			comp_price: formData.comp,
			buy_price: formData.buy,
			bought: new Date(formData.bought as string).toISOString().replace("T", " ").replace("Z", "+00"),
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
				.from("products")
				.update({ file_extensions: [frontExtension, backExtension] })
				.eq("item_id", data[0].id)
				.select();

			const productID = product.data == null ? "unknown" : product.data[0].id;

			[
				{ name: `0.${frontExtension}`, file: ((document.getElementById("front") as HTMLInputElement).files as FileList)[0] },
				{ name: `1.${backExtension}`, file: ((document.getElementById("back") as HTMLInputElement).files as FileList)[0] },
			].forEach(async (fileData) => {
				const { error } = await supabase.storage.from("product_images").upload(`${productID}/${fileData.name}`, fileData.file, {
					contentType: fileData.file.type,
					upsert: true,
				});

				if (error) throw error;
			});
		}

		closeNewCardForm();
	};

	onMount(async () => {
		const { data, error } = await supabase.rpc("get_types", { tname: "cards" });
		if (error) throw error;
		columns = data.slice(3);
	});
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
				{#each columns as column}
					<td>
						{column.column_name
							.split("_")
							.map((e) => e.slice(0, 1).toUpperCase() + e.slice(1))
							.join(" ")}
					</td>
				{/each}
			</tr>
		</thead>
		{#each data.cards as card}
			<tbody class="even:bg-tertiary/80 odd:bg-secondary/80 [&_td]:!select-text">
				<tr>
					{#each Object.keys(card).slice(3) as key}
						<td>{["created", "bought", "sold"].includes(key) ? convertTimestampToReadable(card[key]) : key.includes("price") ? convertFloatToPrice(card[key]) : ["auto", "patch"].includes(key) ? (card[key] ? "✅" : "❌") : card[key]}</td>
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
				{#each data.cards.map((e) => e.brand) as brand}
					<option value={brand}>{brand}</option>
				{/each}
			</datalist>
			{#each data.cards.map((e) => e.brand) as brand}
				<datalist id="set-{stringToHTMLName(brand)}">
					{#each data.cards.filter((e) => e.brand == brand).map((e) => e.set) as set}
						<option value={set}>{set}</option>
					{/each}
				</datalist>
			{/each}
			<datalist id="years">
				{#each data.cards.map((e) => e.year) as year}
					<option value={year}>{year}</option>
				{/each}
			</datalist>
			<datalist id="players">
				{#each data.cards.map((e) => e.player) as player}
					<option value={player}>{player}</option>
				{/each}
			</datalist>
			<datalist id="numbers">
				{#each data.cards.map((e) => e.number) as number}
					<option value={number}>{number}</option>
				{/each}
			</datalist>
			<datalist id="grades">
				{#each data.cards.map((e) => e.grade) as grade}
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
				<FancyCheckbox text="Auto" id="auto" className="col-span-2" />
				<FancyCheckbox text="Patch" id="patch" className="col-span-2" />
			</div>
			<hr />
			<div>
				<label for="bought">Buy Information</label>
				<FancyTextInput type="number" name="buy" placeholder="Buy Price" required bind:value={buyPrice} step="any" className="col-span-3" />
				<FancyTextInput type="date" name="bought" required value={`${date.getFullYear()}-${(date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1)}-${(date.getDate() < 10 ? "0" : "") + date.getDate()}`} className="col-span-3" />
				<label for="sold">Product Information</label>
				<FancyTextInput type="number" name="comp" placeholder="Comp" required bind:value={comp} step="any" className="col-span-3" />
				<FancyTextInput type="number" name="sell" placeholder="Sell Price" required bind:value={sellPrice} step="any" className="col-span-3" />
				<FancyCheckbox text="Retail (should this card appear on the website?)" id="retail" className="col-span-6" />
				<hr />
				<label for="front-image" class="!col-span-3">Front Image</label>
				<label for="back-image" class="!col-span-3">Back Image</label>
				<FancyTextInput type="file" name="front" required bind:value={frontImage} accept="image/*" className="col-span-3" />
				<FancyTextInput type="file" name="back" required bind:value={backImage} accept="image/*" className="col-span-3" />
				<p>Both images should be oriented properly and cropped along the border of the mag / slab / card</p>
				<FancyButton text="Add Card" onclick={submitNewCardForm} disabled={[brand, year, set, player, comp, buyPrice, sellPrice, frontImage, backImage].some((e) => e == null || e == "")} className="bg-accent/60 justify-center mt-4 col-span-6" />
				<hr class="sm:hidden" />
			</div>
		</form>
	</article>
</section>
