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
	const isSpot = url.searchParams.get("spot") == null ? false : true;
	const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
	const checkoutContents = await stripe.checkout.sessions.listLineItems(sessionId);
	const customerDetails = checkoutSession.customer_details as Stripe.Checkout.Session.CustomerDetails;

	email(
		"greenfellastradingpost@gmail.com",
		`${isPsa ? "PSA " : isSpot ? "Break Spot " : ""}Order Recieved - ${customerDetails.email}`,
		`<h1>Order Contents:</h1>
		${checkoutContents.data.map((i) => i.description).join("<br>")}<br><br>Shipping / Billing Address: ${customerDetails.address?.line1 ?? "Check Stripe"} ${customerDetails.address?.line2 ?? ""}`
	);

	if (isPsa) {
		email(customerDetails.email as string, "PSA Order Processed!", `<h1>Thank you for shopping with us! We have recieved your PSA submission order for:</h1>${checkoutContents.data.map((i) => i.description).join("<br>")}.<br><br>Whenever you are ready, please ship your cards to this address: 2412 East 65th St, Brooklyn NY 11234.<br><br>Once we recieve your cards, we will take them straight to the PSA grading bin. We are not in control of how long the grading process takes, but your cards will skip normal processing times, ensuring faster results.<br><br>When we recieve your graded cards, we will ship them back to you. If you have any concerns or questions, feel free to reach out to us by email: greenfellastradingpost@gmail.com.`);
	} else if (isSpot) {
		email(customerDetails.email as string, "Break Spot Order Processed!", `<h1>Thank you for shopping with us! We have recieved your order of:</h1>${checkoutContents.data.map((i) => i.description).join("<br>")}.<br><br>You will recieve your spot's contents after the stream ends. You are not charged for shipping when buying a break spot, only after the break. Even if your spot doesn't get hits, you can purchase a shipping label with us for some base cards.<br><br>Shipping times are not determined by us and can be affected by several factors, but we will have your order shipped out in the next few business days. If you have any concerns or questions, feel free to reach out to us by email: greenfellastradingpost@gmail.com.`);
	} else {
		email(customerDetails.email as string, "Order Processed!", `<h1>Thank you for shopping with us! We have recieved your order of:</h1>${checkoutContents.data.map((i) => i.description).join("<br>")}.<br><br>You will recieve your order soon. Shipping times are not determined by us and can be affected by several factors, but we will have your order shipped out in the next few business days. If you have any concerns or questions, feel free to reach out to us by email: greenfellastradingpost@gmail.com.`);
	}

	return {};
}) satisfies PageServerLoad;
