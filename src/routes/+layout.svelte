<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { page } from "$app/state";
	import { supabase } from "$lib/supabaseClient";
	let { children } = $props();

	const greenfellas = ["cfd7da8d-4ef0-4130-9978-451df6a5498f", "ca860e56-c5ae-4cb2-8b47-7195c5ee17f4", "d7f62e3e-9dad-4551-9aff-5ad5e24c3577"];
</script>

<svelte:head>
	<title>Greenfellas Trading Post</title>
	<meta name="description" content="Get the highest quality soccer trading cards. Mags, slabs, repacks, breaks, and more available here!" />
</svelte:head>

<div class="w-screen h-screen fixed -z-10 blur-sm [&>img]:absolute">
	<img src="/images/bg-1.png" alt="" class="w-full h-full object-cover" />
	<img src="/images/bg-2.png" alt="" class="mt-64 h-full object-cover" />
</div>
<Header></Header>
<main class="w-screen pt-24 pb-32 min-h-[calc(100vh-9rem)] lg:min-h-[calc(100vh-10rem)]">
	{#await supabase.auth.getUser() then { data }}
		{#if (data.user && greenfellas.includes(data.user.id)) || page.route.id?.includes("login") || page.route.id?.includes("signup")}
			{@render children()}
		{:else}
			<div class="flex flex-col justify-center [&>*]:text-center px-8 md:px-16 lg:px-0">
				<h2>Coming Soon...</h2>
				<p class="text-lg lg:text-xl">Create an account with us to stay up to date with GTP's latest machinations...</p>
				<a href="/signup" class="fancy-button w-fit mx-auto mt-4">Sign Up</a>
			</div>
		{/if}
	{/await}
</main>
<Footer></Footer>
