<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { page } from "$app/state";
	import { supabase } from "$lib/supabaseClient";
	let { children } = $props();
</script>

<div class="w-screen h-screen fixed -z-10 blur-sm [&>div]:absolute [&>div]:w-full [&>div]:h-full [&>div]:bg-cover [&>div]:bg-no-repeat">
	<div id="bg-1" class="bg-[url(/images/bg-1.png)]"></div>
	<div id="bg-2" class="bg-[url(/images/bg-2.png)] bg-[0_150px]"></div>
</div>
<Header></Header>
<main class="w-screen pt-24 pb-32 min-h-[calc(100vh-10rem)]">
	{#await supabase.auth.getUser() then { data }}
		{#if (data.user && ["cfd7da8d-4ef0-4130-9978-451df6a5498f", "ca860e56-c5ae-4cb2-8b47-7195c5ee17f4"].includes(data.user.id)) || page.route.id?.includes("login") || page.route.id?.includes("signup")}
			{@render children()}
		{:else}
			<h2 class="text-5xl text-center">Coming Soon...</h2>
			<p class="mt-4 text-xl text-center">Create an account with us to stay up to date with GTP's latest machinations...</p>
		{/if}
	{/await}
</main>
<Footer></Footer>
