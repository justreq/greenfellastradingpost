<svelte:head>
	<title>Log In - Greenfellas' Trading Post</title>
</svelte:head>

<div class="w-1/2 m-auto flex gap-4 flex-col">
		<h2 class="bg-primary w-max mx-auto px-4 py-2 rounded-xl text-2xl text-center">Log Into An Existing Account</h2>
	<form action="POST" class="flex flex-col">
		<input type="email" name="loginEmail" id="login-email" autocomplete="email" placeholder="Email" />
		<input type="password" name="loginPassword" id="login-password" autocomplete="current-password" placeholder="Password" />
		<button type="submit" disabled>Log In</button>
	</form>
</div>
