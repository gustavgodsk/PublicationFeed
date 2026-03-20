<script lang="ts">
	import { findPartyBrand } from '$lib/data/party-branding';

	let { partyName, compact = false }: { partyName: string; compact?: boolean } = $props();
	const brand = $derived(findPartyBrand(partyName));
</script>

<div
	class={`party-tone-${brand.toneId} party-chip inline-flex items-center gap-2 rounded-full border px-2 py-1`}
	title={partyName}
>
	<span class="party-chip__dot grid size-5 place-content-center rounded-full text-[11px] font-bold">
		{brand.letter}
	</span>
	{#if !compact}
		<span class="max-w-36 truncate text-xs font-semibold">{partyName}</span>
	{/if}
</div>
