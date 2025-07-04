import { PUBLIC_BASE, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
	return new Response();
};

export const OPTIONS: RequestHandler = async () => {
	return new Response("ok", {
		headers: {
			"Access-Control-Allow-Origin": PUBLIC_BASE,
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "authorization, content-type, apikey",
		},
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	const response = await fetch("https://stcebbhxlmcaweulagty.supabase.co/functions/v1/resend", {
		method: "POST",
		credentials: "include",
		mode: "cors",
		body: JSON.stringify({
			from: "donotreply@updates.greenfellastradingpost.com",
			to: data.to,
			title: data.title,
			body: data.body,
		}),
		headers: {
			"Access-Control-Allow-Origin": PUBLIC_BASE,
			"Content-Type": "application/json",
		},
	});

	return response;
};
