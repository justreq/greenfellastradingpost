<script lang="ts">
	import type { Provider, User } from "@supabase/supabase-js";
	import FancyButton from "./FancyButton.svelte";
	import FancyTextInput from "./FancyTextInput.svelte";
	import FancyCheckbox from "./FancyCheckbox.svelte";
	import { globalPopupState } from "$lib/globals";
	import { page } from "$app/state";
	let { supabase, user } = $derived(page.data);

	let { authType = "signup" } = $props();

	let email = $state("");
	let acceptedTerms = $state(false);

	const checkout = () => {};
</script>

<form
	method="POST"
	onsubmit={(event) => {
		event.preventDefault();
		checkout();
	}}
	class="flex flex-col gap-4"
>
	<FancyTextInput bind:value={email} name="auth-email" placeholder="Email" required={authType == "signup"} iconPath="/icons/email.svg" />
	<FancyButton disabled={true} type="submit" text="Submit" className="fancy-anchor fancy-anchor-on !transition-all md:hover:scale-105 flex justify-center cursor-pointer disabled:bg-text/20" />
</form>
