<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import type { Provider, User } from "@supabase/supabase-js";
	import FancyButton from "./FancyButton.svelte";
	import FancyTextInput from "./FancyTextInput.svelte";
	import { goto } from "$app/navigation";
	import FancyCheckbox from "./FancyCheckbox.svelte";

	export var authType: "signup" | "login";

	var email = "";
	var displayName = "";
	var password = "";
	var confirmPassword = "";
	var dontIncludeInEmailBlast = false;
	var acceptedTerms = false;

	var errorText = "0";

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
		}
	};

	const trySignIn = async (provider: Provider | "email") => {
		if (provider == "email") {
			let { error } = await supabase.auth.signInWithPassword({ email: email, password: password });
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

			return;
		}

		let { error } = await supabase.auth.signInWithOAuth({ provider: provider as Provider });
		if (error) throw error;
	};

	// supabase.auth.signOut();
</script>

<article class="w-[90vw] sm:w-[32rem] mx-auto flex flex-col gap-2">
	<h2 class="text-center">{authType == "signup" ? "Create a new account" : "Log into your account"}</h2>
	<p class="text-center">
		{authType == "signup" ? "Already have an account? " : "Don't have an account? "}
		<span><a href="/{authType == 'signup' ? 'login' : 'signup'}" class="text-accent border-0">{authType == "signup" ? "Log In" : "Sign Up"}</a></span>
	</p>
	<div class="w-full mx-auto sm:p-4 lg:p-8 !pb-4 flex flex-col gap-4 sm:bg-glass-sm rounded-lg">
		<form
			method="POST"
			onsubmit={(event) => {
				event.preventDefault();
				authType == "signup" ? tryCreateAccount() : trySignIn("email");
			}}
			class="flex flex-col gap-4"
		>
			{#if authType == "signup"}
				<FancyTextInput bind:value={displayName} name="auth-display-name" placeholder="Display Name" required={authType == "signup"} iconPath="/icons/user.svg" />
			{/if}
			<FancyTextInput bind:value={email} name="auth-email" placeholder="Email" required={authType == "signup"} iconPath="/icons/email.svg" />
			<FancyTextInput bind:value={password} type="password" name="auth-password" placeholder="Password" required={authType == "signup"} iconPath="/icons/lock.svg" />
			{#if authType == "signup"}
				<FancyTextInput bind:value={confirmPassword} type="password" name="auth-confirm-password" placeholder="Confirm Password" required iconPath="/icons/lock.svg" />
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="flex cursor-pointer"
					onclick={() => {
						acceptedTerms = !acceptedTerms;
					}}
				>
					<FancyCheckbox bind:value={acceptedTerms} />
					<p>
						By checking this, you agree to the terms and conditions set forth by our <span><a href="/legal" class="underline border-none">Legal Notice</a></span>
					</p>
				</div>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="flex cursor-pointer"
					onclick={() => {
						dontIncludeInEmailBlast = !dontIncludeInEmailBlast;
					}}
				>
					<FancyCheckbox bind:value={dontIncludeInEmailBlast} />
					<p>I want occasional emails about news, updates, offers, coupons, etc., to be sent anywhere but to my email.</p>
				</div>
			{/if}
			<p class:!block={errorText != "0"} class="text-red-500 hidden">{errorText}</p>
			<FancyButton disabled={authType == "signup" ? email.length == 0 || password.length == 0 || displayName.length == 0 || !acceptedTerms : email.length == 0 || password.length == 0} type="submit" text={authType == "signup" ? "Sign Up" : "Log In"} className="fancy-anchor fancy-anchor-on !transition-all md:hover:scale-105 flex justify-center cursor-pointer" />
		</form>
		<div class="hidden">
			<hr class="h-1 border-none bg-tertiary rounded-full" />
			<p class="text-center">or sign in via</p>
			<div class="flex gap-4 justify-center [&>button]:h-12 [&>button]:aspect-square [&>button]:bg-secondary [&>button]:rounded-full [&>button]:transition-transform [&>button]:duration-200 [&>button:hover]:scale-110 [&>button>img]:w-2/3 [&>button>img]:h-2/3 [&>button>img]:m-auto">
				<button type="button" onclick={() => trySignIn("google")}><img src="/icons/google.svg" alt="Sign In With Google" /></button>
				<button type="button" onclick={() => trySignIn("discord")}><img src="/icons/discord.svg" alt="Sign In With Discord" /></button>
			</div>
		</div>
	</div>
</article>
