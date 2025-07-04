import type { Stripe } from "stripe";
import { stripe } from "../stripe";
import type { PageServerLoad } from "./$types";

export const load = (async ({ url, fetch }) => {
	const email = async (to: string, title: string, body: string) => {
		await fetch("/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ to, title, body }),
		});
	};

	const sessionId = url.searchParams.get("session_id") as string;
	const isPsa = url.searchParams.get("psa") == null ? false : true;
	const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
	const checkoutContents = await stripe.checkout.sessions.listLineItems(sessionId);
	const customerDetails = checkoutSession.customer_details as Stripe.Checkout.Session.CustomerDetails;

	email(
		"greenfellastradingpost@gmail.com",
		`${isPsa ? "PSA " : ""}Order Recieved - ${customerDetails.email}`,
		`<h1>Order Contents:</h1>
		${checkoutContents.data.map((i) => i.description).join("<br>")}<br><br>Shipping / Billing Address: ${customerDetails.address?.line1} ${customerDetails.address?.line2 ?? ""}`
	);

	email(customerDetails.email as string, `${isPsa ? "PSA " : ""}Order Processed!`, `<h1>Thank you for shopping with us! We have recieved your order of:</h1>${checkoutContents.data.map((i) => i.description).join("<br>")}.<br><br>${isPsa ? "Whenever you are ready, please ship your cards to this address: 2412 East 65th St, Brooklyn NY 11234.<br><br>Once we recieve your cards, we will take them straight to the PSA grading bin. We are not in control of how long the grading process takes, but your cards will skip normal processing times, ensuring faster results.<br><br>When we recieve your graded cards, we will ship them back to you" : "You will recieve your order soon. Shipping times are not determined by us and can be affected by several factors, but we will have your order shipped out in the next few business days"}. If you have any concerns or questions, feel free to reach out to us by email: greenfellastradingpost@gmail.com.`);

	return {};
}) satisfies PageServerLoad;
