<script>
	import { globalPopupState } from "$lib/globals";
	import { currentUser, supabase } from "$lib/supabaseClient";
</script>

{#if $currentUser}
	<div class="pt-8 px-2 flex flex-col gap-4">
		<a href="/" class="fancy-button text-center">{$currentUser.user_metadata.displayName || $currentUser.user_metadata.full_name}</a>
		<button
			class="fancy-button border-none bg-text/40 font-bold"
			type="button"
			onclick={async () => {
				await supabase.auth.signOut();
			}}
		>
			Sign Out
		</button>
	</div>
{:else}
	<div class="pt-8 lg:p-0 px-2 flex flex-col lg:h-min lg:justify-center lg:my-auto lg:flex-row gap-4 [&>button]:lg:px-4 [&>button]:lg:h-full [&>button]:py-8 [&>button]:lg:py-3 [&>button]:font-bold [&>button]:rounded-lg [&>button]:transition-transform [&>button]:duration-200 [&>button:hover]:sm:scale-105">
		<button
			class="bg-text text-primary"
			onclick={() => {
				$globalPopupState = "login";
			}}
		>
			Log In
		</button>
		<p class="text-center lg:h-min lg:my-auto">or</p>
		<button
			class="bg-accent2/80"
			onclick={() => {
				$globalPopupState = "signup";
			}}
		>
			Sign Up
		</button>
	</div>
{/if}
