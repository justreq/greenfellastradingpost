import { page } from "$app/state";
import { writable, type Writable } from "svelte/store";

export type popupState = "none" | "headernav" | "profile" | "signup" | "login" | "sorts" | "filters" | "createbreakspot" | "breakspots" | "checkout" | "psaform";

export const superUsers = ["2b5c3202-96ca-4ce2-b9dc-b4c4661e6f7b", "52097e7f-c34b-4fa7-afa2-c432085d26b2", "ca860e56-c5ae-4cb2-8b47-7195c5ee17f4", "d7f62e3e-9dad-4551-9aff-5ad5e24c3577"];
export const globalPopupState: Writable<popupState> = writable("none");

export const filtersList: Writable<{ [key: string]: { name: string; value: string }[] }> = writable({});

export const cartContents: Writable<string[]> = writable([]);
export const breakIDToShowSpots: Writable<string | null> = writable(null);

export const checkout = async (singleID: string | null = null) => {
	let cart: { product_ids: string[] } = { product_ids: [] };

	if (singleID != null) cart.product_ids = [singleID];
	else if (localStorage.getItem("cart") != null) {
		cart = JSON.parse(localStorage.getItem("cart") as string);
	} else return;

	let cartContents = cart.product_ids.map((e: any) => {
		let productData = page.data.products.find((c: { id: any }) => c.id == e);
		let cardData = page.data.cards.find((c: { id: any }) => c.id == productData.item_id);

		return {
			name: getCardName(cardData),
			price: cardData.sell_price,
		};
	});

	const data = await fetch("/checkout", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ cart: cartContents }),
	}).then((data) => data.json());

	window.location.replace(data.url);
};

export const getCardName = (data: any) => {
	return [data.number || "", data.grade || "", data.player || "", data.year || "", data.brand || "", data.set || ""]
		.map((e) => e.trim())
		.filter((e) => e != "")
		.join(" ");
};
