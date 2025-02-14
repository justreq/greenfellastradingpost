<script lang="ts">
	import FancyTextInput from "$lib/components/FancyTextInput.svelte";

	const tryLogIn = async () => {
		console.log(new FormData(document.getElementById("login-form") as HTMLFormElement));
	};
</script>

<svelte:head>
	<title>Log In - Greenfellas' Trading Post</title>
</svelte:head>

<form on:submit={tryLogIn} id="login-form" class="flex flex-col gap-8 mx-auto w-1/2">
	<FancyTextInput type="email" name="login-email" placeholder="Email" required iconPath="/icons/user.svg" />
	<FancyTextInput type="password" name="login-password" placeholder="Password" required iconPath="/icons/lock.svg" />
	<button type="submit" class="mt-8">Log In</button>
</form>
