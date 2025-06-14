<script lang="ts">
	import { page } from "$app/state";
	import FancyButton from "$lib/components/FancyButton.svelte";
	import FancyTextInput from "$lib/components/FancyTextInput.svelte";
	import { email } from "$lib/globals";
	import { onMount } from "svelte";
	let { user } = $derived(page.data);

	let contactEmail = $state("");
	let contactTitle = $state("");
	let contactBody = $state("");

	onMount(() => {
		if (user && !user.is_anonymous) contactEmail = user.email;
	});
</script>

<section class="px-2 mx-auto mt-4 w-screen md:w-[40rem] 2xl:mx-auto">
	<h2 class="text-center mb-8">Contact Us</h2>
	<form
		method="POST"
		class="flex flex-col gap-2 xl:gap-4 [&>*]:w-full"
		onsubmit={async (event: Event) => {
			event.preventDefault();
            email(contactEmail, contactTitle, contactBody)
		}}
	>
		<FancyTextInput placeholder="Email" type="email" bind:value={contactEmail} required />
		<FancyTextInput placeholder="Message Title" bind:value={contactTitle} required />
		<textarea bind:value={contactBody} placeholder="Message Body" required class="h-[14rem] min-h-[8rem] max-h-[24rem] mb-8"></textarea>
		<FancyButton disabled={contactEmail == "" || contactTitle == "" || contactBody == ""} type="submit" text="Submit" className="fancy-anchor fancy-anchor-on !transition-all [&:not(:disabled)]:md:hover:scale-105 flex justify-center cursor-pointer disabled:bg-text/20" />
	</form>
</section>
