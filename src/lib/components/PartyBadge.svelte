<script lang="ts">
	import { findPartyBrand } from '$lib/data/party-branding';

	let { partyName, compact = false }: { partyName: string; compact?: boolean } = $props();
	const brand = $derived(findPartyBrand(partyName));
</script>

<div
	class="inline-flex items-center gap-2 rounded-full border px-2 py-1"
	style={`border-color:${brand.color}33;background:${brand.soft};color:${brand.text};`}
	title={partyName}
>
	<span
		class="grid size-5 place-content-center rounded-full text-[11px] font-bold"
		style={`background:${brand.color};color:white;`}
	>
		{brand.letter}
	</span>
	{#if !compact}
		<span class="max-w-36 truncate text-xs font-semibold">{partyName}</span>
	{/if}
</div>
