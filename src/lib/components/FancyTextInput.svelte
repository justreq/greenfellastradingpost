<script lang="ts">
	export let className: string = "";

	export let type: string = "text";
	export let name: string;
	export let placeholder: string = "";
	export let required: boolean = false;
	export let iconPath: string;
</script>

<div class={className}>
	<div class="relative">
		{#if iconPath != ""}
			<img src={iconPath} alt="" draggable="false" class="absolute h-1/2 left-3 top-1/2 -translate-y-1/2" />
		{/if}
		<input {type} {name} id={name} {placeholder} class:pl-11={iconPath != ""} autocomplete="off" class="w-full" />
	</div>
	{#if required}
		<p class="text-red-500 text-sm mt-1">*This field is required</p>
	{/if}
</div>
