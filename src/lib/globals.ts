import { page } from "$app/state";
import { PUBLIC_BASE } from "$env/static/public";
import { writable, type Writable } from "svelte/store";

export type popupState = "none" | "headernav" | "profile" | "signup" | "login" | "sorts" | "filters" | "createbreakspot" | "breakspots" | "checkout" | "psaform";

export const superUsers = ["2b5c3202-96ca-4ce2-b9dc-b4c4661e6f7b", "52097e7f-c34b-4fa7-afa2-c432085d26b2", "ca860e56-c5ae-4cb2-8b47-7195c5ee17f4", "d7f62e3e-9dad-4551-9aff-5ad5e24c3577"];
export const globalPopupState: Writable<popupState> = writable("none");

export const filtersList: Writable<{ [key: string]: { name: string; value: string }[] }> = writable({});

export const serviceInfo: { [key: string]: { [key: string]: string | any[] } } = {
	singles: {
		heading: "Single cards starting at $1",
		subheading: "Score your dream cards in our singles auctions.",
		ctaText: "Next stream",
		badges: [],
		overviewTitle: "What are singles streams?",
		overview: "Catch us live during a Magdonald's or Slabby Sunday stream, during which we auction all kinds of soccer cards, all starting at $1.\n\nMagdonald's streams feature a curated collection of cards in magnetic cases with a custom GTP sticker.\n\nSlabby Sunday streams feature a curated collection of graded cards.",
	},
	repacks: {
		heading: "High-value repacks starting at $1",
		subheading: "Get your hands on a high-value card (raw, magged, or graded)",
		ctaText: "Next stream",
		badges: [],
		overviewTitle: "Repacks explained",
		overview: "Repack streams feature a collection of carefully put-together repacks, all starting at $1. Each repack contains a high-value card of any type.\n\nWhen you win a repack, you get to watch us open a repack box of your choice live. You keep everything we pull from your chosen repack box, except the box itself.",
	},
	breaks: {
		heading: "Experience quality breaks",
		subheading: "Find our next break and secure your spot before it's gone!",
		ctaText: "Get Spots",
		badges: [],
		overviewTitle: "Breaks explained",
		overview: "During a breaking stream, you get to watch as we open card hobby cases.\n\nEveryone who purchases a spot gets to keep all of the affiliated cards from that break, which are delivered after the stream ends.\n\nSpots are available for purchase before a break, but each spot can only go to one person.",
	},
	psa: {
		heading: "Grade your cards faster than ever",
		subheading: "Skip PSA's waiting times when you grade your cards with us!",
		ctaText: "Submit Form",
		badges: [
			{ text: "Optional\ncleaning", icon: "shiny-card" },
			{ text: "Fast\ndelivery", icon: "box-deliver" },
			{ text: "Straight\nto grading", icon: "box-transfer" },
		],
		overviewTitle: "How does it work?",
		overview: "You can access the PSA submission form above. You'll need to provide basic information about each card you want to submit.\n\nOnce you submit the form, you'll be shown an address to ship your cards to. When we receive your cards, we will hand-deliver them to PSA, ensuring they skip processing and go straight to grading.\n\nWhen we receive your cards back from PSA, we will ship them to the address you provided when submitting the form.\n\nPricing can be found below.",
	},
	consignments: {
		heading: "Consign your cards with GTP",
		subheading: "Use our platform to sell your cards.",
		ctaText: "Submit Form",
		overviewTitle: "How to consign",
		overview: "You can access our consignment submission form above. It takes a few seconds to fill out, after which you will be prompted to sign our consignment waiver."
	}
};

export const cartContents: Writable<string[]> = writable([]);
export const breakIDToShowSpots: Writable<string | null> = writable(null);

export const checkout = async (singleID: string | null = null) => {
	let cart: { product_ids: string[] } = { product_ids: [] };

	if (singleID != null) {
		cart.product_ids = [singleID];
		localStorage.setItem("singleItemCart", JSON.stringify({ id: singleID, owner_id: null }));
	} else if (localStorage.getItem("cart") != null) {
		cart = JSON.parse(localStorage.getItem("cart") as string);
	} else return;

	let cartContents = cart.product_ids.map((e: any) => {
		let cardData = page.data.cards.find((c: { id: any }) => c.id == e);

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

export const email = async (to: string, title: string, body: string) => {
	await fetch("/email", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ to, title, body }),
	});
	window.location.href = PUBLIC_BASE + (localStorage.getItem("redirect-route") ?? "");
};

export const getCardName = (data: any) => {
	if (data.custom_name != "") return data.custom_name;

	return [data.number || "", data.grade || "", data.player || "", data.year || "", data.brand || "", data.set || ""]
		.map((e) => e.trim())
		.filter((e) => e != "")
		.join(" ");
};
