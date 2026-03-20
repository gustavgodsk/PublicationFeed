<script lang="ts">
	import DecisionCard from '$lib/components/feed/DecisionCard.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { DecisionCardModel } from '$lib/decision-presentation';

	let { decisions }: { decisions: DecisionCardModel[] } = $props();
</script>

<section class="space-y-4">
	<div class="flex items-center justify-between">
		<p class="text-muted-foreground text-sm">{decisions.length} beslutninger</p>
	</div>

	{#if decisions.length === 0}
		<Card>
			<CardContent class="text-muted-foreground py-10 text-center text-sm">
				Ingen beslutninger matcher det, du har valgt.
			</CardContent>
		</Card>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{#each decisions as model}
				<DecisionCard {model} />
			{/each}
		</div>
	{/if}
</section>
