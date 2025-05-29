import { BASE } from "$env/static/private";
import { stripe } from "../stripe";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
	return new Response();
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const cart = data.cart;

	const lineItems = cart.map((item: { name: any; price: number }) => {
		return {
			price_data: {
				currency: "USD",
				product_data: {
					name: item.name,
					images: [],
				},
				unit_amount: item.price * 100,
			},
			quantity: 1,
		};
	});

	const session = await stripe.checkout.sessions.create({
		line_items: lineItems,
		shipping_address_collection: {
			allowed_countries: ["US"],
		},
		mode: "payment",
		success_url: `${BASE}/success`,
		cancel_url: `${BASE}/cancel`,
	});

	return new Response(JSON.stringify({ url: session.url }), { status: 200, headers: { "Content-Type": "application/json" } });
};
