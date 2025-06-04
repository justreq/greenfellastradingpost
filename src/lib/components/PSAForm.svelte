<script lang="ts">
	import FancyButton from "./FancyButton.svelte";
	import FancyTextInput from "./FancyTextInput.svelte";
	import FancyCheckbox from "./FancyCheckbox.svelte";
	import { onMount } from "svelte";

	let psaFormData: { pricing: string; cards: { name: string; clean: boolean }[] }[] = $state([]);

	const checkout = async () => {
		let cartContents: { name: string; price: number }[] = [];

		localStorage.setItem("psa-form-data", JSON.stringify(psaFormData));
		let cart = JSON.parse(localStorage.getItem("psa-form-data") as string);

		cart.forEach((e: { cards: any[]; pricing: string }) => {
			e.cards.forEach((c: { name: string; clean: any }) => {
				cartContents.push({
					name: ["Value Bulk", "Value", "Value Plus", "Value Max", "Regular", "Express", "Super Express", "Walk-Through"][parseInt(e.pricing as string)] + " - " + c.name + (c.clean ? " (clean)" : ""),
					price: Math.round(([24.99, 29.99, 44.99, 64.99, 84.99, 159.99, 314.99, 614.99][parseInt(e.pricing as string)] + (c.clean ? 2.99 : 0)) * 100) / 100,
				});
			});
		});

		localStorage.setItem("redirect-route", "/psa");

		const data = await fetch("/checkout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ cart: cartContents, message: "Thanks for doing business with us! When you are ready, please ship your cards to this address:\n\n2412 East 65th St, Brooklyn NY 11234" }),
		}).then((data) => data.json());

		window.location.replace(data.url);
	};

	const addBatch = (pricing: string = "-1", skipCard = false) => {
		psaFormData.push({ pricing: pricing, cards: skipCard ? [] : [{ name: "", clean: false }] });
	};

	const removeBatch = (batch: number) => {
		psaFormData.splice(batch - 1, 1);
	};

	const addCard = (batch: number, name: string | null = null, clean: boolean | null = null) => {
		psaFormData[batch - 1].cards.push({ name: name ?? "", clean: clean ?? false });
	};

	const removeCard = (batch: number, index: number) => {
		psaFormData[batch - 1].cards.splice(index, 1);
	};

	const updateCard = (batch: number, index: number, name: string | null, clean: boolean | null) => {
		if (name != null) psaFormData[batch - 1].cards[index].name = name;
		if (clean != null) psaFormData[batch - 1].cards[index].clean = clean;
	};

	onMount(() => {
		(document.getElementById("psa-form") as HTMLFormElement).reset();

		if (localStorage.getItem("psa-form-data") != null) {
			const data = JSON.parse(localStorage.getItem("psa-form-data") as string);

			data.forEach((e: { pricing: string; cards: any[] }, index: number) => {
				addBatch(e.pricing, true);

				e.cards.forEach((e: { name: string | null; clean: boolean | null }) => {
					addCard(index + 1, e.name, e.clean);
				});
			});
		} else {
			addBatch("-1");
		}

		localStorage.removeItem("psa-form-data");
	});
</script>

<form
	method="POST"
	onsubmit={(event) => {
		event.preventDefault();
		checkout();
	}}
	id="psa-form"
	class="flex flex-col gap-4 px-1 pt-4 sm:p-0"
>
	{#each psaFormData as batch, index}
		<h3 class="ml-2">Batch #{index + 1}</h3>
		<div class="[&>*]:w-full bg-glass-sm px-1 py-3 rounded-lg flex gap-2 flex-col">
			<select
				required
				name="psa-batch-{index + 1}"
				id="psa-batch-{index + 1}"
				class="mb-2 psa-batch"
				bind:value={psaFormData[index].pricing}
				oninput={(event: Event) => {
					psaFormData[index].pricing = (event.target as HTMLInputElement).value;

					if ((event.target as HTMLInputElement).value != "0") return;

					while (psaFormData[index].cards.length < 20) {
						addCard(index + 1);
					}
				}}
			>
				<option value="-1" disabled selected hidden>Select a pricing model</option>
				<option value="0">Value Bulk (minimum 20 cards)</option>
				<option value="1">Value</option>
				<option value="2">Value Plus</option>
				<option value="3">Value Max</option>
				<option value="4">Regular</option>
				<option value="5">Express</option>
				<option value="6">Super Express</option>
				<option value="7">Walk-Through</option>
			</select>
			<div class="flex flex-col gap-2" data-batch={index + 1}>
				{#each batch.cards as card, cardIndex}
					<div class="bg-glass-secondary-sm px-2 py-3 rounded-lg">
						<FancyTextInput placeholder="Card Name" className="mb-2 psa-input" bind:value={psaFormData[index].cards[cardIndex].name} required oninput={(event: Event) => updateCard(index + 1, cardIndex, (event.target as HTMLInputElement).value, null)} />
						<div class="flex justify-between place-items-center">
							<FancyCheckbox className="psa-clean-input" onclick={(event: Event) => updateCard(index + 1, cardIndex, null, (event.target as HTMLInputElement).checked)} bind:value={psaFormData[index].cards[cardIndex].clean}>Clean card? (+ $2.99)</FancyCheckbox>
							<button type="button" class="h-8 rounded-md aspect-square fancy-button border-none bg-red-500/80 disabled:opacity-50 [&:not(:disabled)]:md:hover:!bg-red-500" disabled={cardIndex == 0 || (batch.pricing == "0" && cardIndex < 20)} onclick={() => removeCard(index + 1, cardIndex)}>
								<img src="/icons/delete.svg" alt="Remove Card" class="h-full" />
							</button>
						</div>
					</div>{/each}
				<div class="flex gap-2 mt-2">
					<FancyButton text="Add Card" iconPath="/icons/plus.svg" className="bg-accent/80 hover:!bg-accent w-full" onclick={(event: Event) => addCard(parseInt((event.target as HTMLElement).parentElement?.parentElement?.getAttribute("data-batch") as string))} />
					<FancyButton iconPath="/icons/delete.svg" disabled={index == 0} className="fancy-button border-none bg-red-500/80 disabled:opacity-50 [&:not(:disabled)]:md:hover:!bg-red-500" onclick={() => removeBatch(index + 1)} />
				</div>
			</div>
		</div>
	{/each}
	<FancyButton text="Create New Batch" iconPath="/icons/plus.svg" className="bg-tertiary/80 hover:bg-tertiary" onclick={addBatch} />
	<FancyButton disabled={psaFormData.some((e) => e.pricing == "-1" || e.cards.some((c) => c.name.length == 0))} type="submit" text="Submit" className="fancy-anchor fancy-anchor-on !transition-all [&:not(:disabled)]:md:hover:scale-105 flex justify-center cursor-pointer disabled:bg-text/20" />
</form>
