<script lang="ts">
	import { parseFormData } from "$lib/utilities";
	import { supabase } from "$lib/supabaseClient";
	import FancyTextInput from "$lib/components/FancyTextInput.svelte";
	import { goto } from "$app/navigation";

	let emailMissing = false;
	let passwordMissing = false;
	let invalidCredentials = false;

	const tryLogIn = async (event: Event) => {
		let formData = parseFormData(event.target as HTMLElement);

		invalidCredentials = false;
		emailMissing = formData["login-email"] == "";
		passwordMissing = formData["login-password"] == "";
		const { data, error } = await supabase.auth.signInWithPassword({ email: formData["login-email"], password: formData["login-password"] });

		if (emailMissing || passwordMissing) {
			event.preventDefault();
			return;
		}

		if (error && error.code == "invalid_credentials") {
			invalidCredentials = true;
			event.preventDefault();
			return;
		}

		goto("/");
	};
</script>

<svelte:head>
	<title>Log In - Greenfellas' Trading Post</title>
</svelte:head>

<form on:submit={tryLogIn} id="login-form" class="flex flex-col gap-2 mx-auto w-1/2">
	<FancyTextInput type="email" name="login-email" placeholder="Email" required showRequired={emailMissing} iconPath="/icons/user.svg" />
	<FancyTextInput type="password" name="login-password" placeholder="Password" required showRequired={passwordMissing} iconPath="/icons/lock.svg" />
	<button type="submit" class="mt-8">Log In</button>
	<p class:!text-red-500={invalidCredentials} class="text-transparent">Invalid email or password</p>
</form>
