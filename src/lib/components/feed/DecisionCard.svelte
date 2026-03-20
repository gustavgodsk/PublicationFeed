<script lang="ts">
	import PartyBadge from '$lib/components/PartyBadge.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { DecisionCardModel } from '$lib/decision-presentation';

	let { model }: { model: DecisionCardModel } = $props();
</script>

<a href={model.href}>
	<Card class={`hover:shadow-primary/15 hover:-translate-y-[2px] party-tone-${model.leadPartyTone} party-card-tint h-full transition-all duration-200`}>
		<CardContent class="flex h-full flex-col gap-4 pt-6">
			<div class="flex items-center justify-between gap-2">
				<Badge variant={model.statusVariant}>{model.statusText}</Badge>
				<span class="text-muted-foreground text-xs">{model.date}</span>
			</div>

			<h2 class="text-base leading-snug font-semibold">{model.title}</h2>
			<p class="text-muted-foreground text-sm [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
				{model.summary}
			</p>

			<div class="mt-auto space-y-3">
				<div class="flex flex-wrap gap-2">
					{#each model.partyNames as party}
						<PartyBadge partyName={party} compact={true} />
					{/each}
				</div>
				<div class="flex items-center justify-between">
					<Badge variant="outline">{model.city}</Badge>
					<span class="text-primary text-sm font-semibold">Se hvad der blev besluttet</span>
				</div>
			</div>
		</CardContent>
	</Card>
</a>
