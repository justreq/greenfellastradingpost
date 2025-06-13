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
	let displayName = $state("");
	let password = $state("");
	let confirmPassword = $state("");
	let dontIncludeInEmailBlast = $state(false);
	let acceptedTerms = $state(false);

	let errorText = $state("0");

	const tryCreateAccount = async () => {
		if (password != confirmPassword) {
			errorText = "Passwords do not match";
			return;
		} else if (displayName.length < 6 || displayName.length > 20) {
			errorText = "Display name must be 5 - 20 characters long";
			return;
		} else errorText = "0";

		let { data, error } = await supabase.auth.signUp({ email: email, password: password, options: { data: { displayName: displayName, includeInEmailBlast: !dontIncludeInEmailBlast } } });
		if (error) {
			switch (error.code) {
				case "validation_failed":
					errorText = "Incorrect email format";
					break;
				case "weak_password":
					errorText = "Weak password";
					break;
				default:
					errorText = "0";
					break;
			}

			throw error;
		} else {
			const { error } = await supabase.from("users").insert({ id: (data.user as User).id, email: (data.user as User).email, display_name: (data.user as User).user_metadata.displayName, includeInEmailBlast: (data.user as User).user_metadata.includeInEmailBlast });
			if (error) throw error;

			if (localStorage.getItem("cart") == null || !page.route.id?.includes("marketplace")) {
				location.reload();
				return;
			}

			let cart = JSON.parse(localStorage.getItem("cart") as string);
			cart.owner_id = (data.user as User).id;

			$globalPopupState = "checkout";
		}
	};

	const trySignIn = async (provider: Provider | "email") => {
		if (provider == "email") {
			let { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password });
			if (error) {
				switch (error.code) {
					case "invalid_credentials":
						errorText = "Invalid credentials";
						break;
					default:
						errorText = "0";
						break;
				}

				throw error;
			}

			if (localStorage.getItem("cart") == null || !page.route.id?.includes("marketplace")) {
				location.reload();
				return;
			}

			let cart = JSON.parse(localStorage.getItem("cart") as string);
			cart.owner_id = (data.user as User).id;

			$globalPopupState = "checkout";

			return;
		}

		let { error } = await supabase.auth.signInWithOAuth({ provider: provider as Provider });
		if (error) throw error;
	};
</script>

<form
	method="POST"
	onsubmit={(event) => {
		event.preventDefault();
		authType == "signup" ? tryCreateAccount() : trySignIn("email");
	}}
	class="flex flex-col gap-4"
>
	<p class="text-center">
		{authType == "signup" ? "Already have an account? " : "Don't have an account? "}
		<span><button type="button" class="text-accent uppercase" onclick={() => ($globalPopupState = authType == "signup" ? "login" : "signup")}>{authType == "signup" ? "Log In" : "Sign Up"}</button></span>
	</p>
	{#if authType == "signup"}
		<FancyTextInput bind:value={displayName} name="auth-display-name" placeholder="Display Name" required={authType == "signup"} iconPath="/icons/user.svg" />
	{/if}
	<FancyTextInput bind:value={email} name="auth-email" placeholder="Email" required={authType == "signup"} iconPath="/icons/email.svg" />
	<FancyTextInput bind:value={password} type="password" name="auth-password" placeholder="Password" required={authType == "signup"} iconPath="/icons/lock.svg" />
	{#if authType == "signup"}
		<FancyTextInput bind:value={confirmPassword} type="password" name="auth-confirm-password" placeholder="Confirm Password" required iconPath="/icons/lock.svg" />
		<FancyCheckbox bind:value={acceptedTerms}>
			You agree to the terms and conditions set forth by our
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<span onclick={() => ($globalPopupState = "none")}><a href="/legal" class="underline border-none">Legal Notice</a></span>
		</FancyCheckbox>
		<FancyCheckbox bind:value={dontIncludeInEmailBlast}>You want occasional emails about news, updates, offers, coupons, etc., to be sent anywhere but to your email.</FancyCheckbox>
	{/if}
	<p class:!block={errorText != "0"} class="text-red-500 hidden">{errorText}</p>
	<FancyButton disabled={authType == "signup" ? email.length == 0 || password.length == 0 || displayName.length == 0 || !acceptedTerms : email.length == 0 || password.length == 0} type="submit" text={authType == "signup" ? "Sign Up" : "Log In"} className="fancy-anchor fancy-anchor-on !transition-all md:hover:scale-105 flex justify-center cursor-pointer disabled:bg-text/20" />
	<!-- <hr class="h-1 border-none bg-tertiary rounded-full" />
	<p class="text-center">or sign in via</p>
	<div class="flex gap-4 justify-center [&>button]:h-12 [&>button]:aspect-square [&>button]:bg-secondary [&>button]:rounded-full [&>button]:transition-transform [&>button]:duration-200 [&>button:hover]:scale-110 [&>button>img]:w-2/3 [&>button>img]:h-2/3 [&>button>img]:m-auto">
		<button type="button" onclick={() => trySignIn("google")}><img src="/icons/google.svg" alt="Sign In With Google" /></button>
		<button type="button" onclick={() => trySignIn("discord")}><img src="/icons/discord.svg" alt="Sign In With Discord" /></button>
	</div> -->
</form>
