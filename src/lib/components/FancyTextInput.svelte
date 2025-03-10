<script lang="ts">
	export let type: string = "text";
	export let name: string;
	export let placeholder: string = "";
	export let required: boolean = false;
	export let iconPath: string = "";

	let showRequired: boolean = required;
	let value: string = "";
</script>

<div class="w-fit">
	<div class="relative">
		{#if iconPath != ""}
			<img src={iconPath} alt="" draggable="false" class="absolute h-1/2 left-3 top-1/2 -translate-y-1/2" />
		{/if}
		<input
			{type}
			{name}
			id={name}
			{placeholder}
			autocomplete="new-password"
			bind:value={
				() => {
					showRequired = required && value == "";
					return value;
				},
				(v) => (value = v)
			}
			class:pl-11={iconPath != ""}
			class="w-full"
		/>
	</div>
	<p class:!text-red-500={required && showRequired} class="text-transparent text-sm mt-1">*This field is required</p>
</div>
