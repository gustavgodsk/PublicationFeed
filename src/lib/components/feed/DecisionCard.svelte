<script lang="ts">
	import PartyBadge from '$lib/components/PartyBadge.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { DecisionCardModel } from '$lib/decision-presentation';

	let { model }: { model: DecisionCardModel } = $props();
</script>

<a href={model.href}>
	<Card class={`hover:-translate-y-[2px] ${model.statusToneClass} h-full transition-all duration-200`}>
		<CardContent class="flex h-full flex-col gap-4 pt-6">
			<div class="flex items-center justify-between gap-2">
				<Badge variant={model.statusVariant}>{model.statusText}</Badge>
				<span class="text-muted-foreground text-xs">{model.date}</span>
			</div>

			<h2 class="text-base leading-snug font-semibold">{model.headline}</h2>
			<p class="text-muted-foreground text-sm [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
				{model.impact}
			</p>

			<div class="mt-auto space-y-3">
				<div class="space-y-2 rounded-lg border bg-background/60 p-2">
					<div class="flex items-start gap-2">
						<span class="w-15 shrink-0 text-xs font-semibold">For</span>
						<div class="flex flex-wrap gap-1">
							{#if model.votesForCount === 0}
								<span class="text-muted-foreground text-xs">Ingen</span>
							{:else}
								{#each model.votesFor as party}
									<PartyBadge partyName={party} compact={true} />
								{/each}
								{#if model.votesForCount > model.votesFor.length}
									<span class="text-muted-foreground text-xs">+{model.votesForCount - model.votesFor.length}</span>
								{/if}
							{/if}
						</div>
					</div>
					<div class="flex items-start gap-2">
						<span class="w-15 shrink-0 text-xs font-semibold">Imod</span>
						<div class="flex flex-wrap gap-1">
							{#if model.votesAgainstCount === 0}
								<span class="text-muted-foreground text-xs">Ingen</span>
							{:else}
								{#each model.votesAgainst as party}
									<PartyBadge partyName={party} compact={true} />
								{/each}
								{#if model.votesAgainstCount > model.votesAgainst.length}
									<span class="text-muted-foreground text-xs">+{model.votesAgainstCount - model.votesAgainst.length}</span>
								{/if}
							{/if}
						</div>
					</div>
					<div class="flex items-start gap-2">
						<span class="w-15 shrink-0 text-xs font-semibold">Undlod</span>
						<div class="flex flex-wrap gap-1">
							{#if model.votesAbstainCount === 0}
								<span class="text-muted-foreground text-xs">Ingen</span>
							{:else}
								{#each model.votesAbstain as vote}
									<Badge variant="outline">{vote}</Badge>
								{/each}
								{#if model.votesAbstainCount > model.votesAbstain.length}
									<span class="text-muted-foreground text-xs">+{model.votesAbstainCount - model.votesAbstain.length}</span>
								{/if}
							{/if}
						</div>
					</div>
				</div>
				<div class="flex items-center justify-between">
					<Badge variant="outline">{model.city}</Badge>
					<span class="text-primary text-sm font-semibold">Hvad betyder det for dig?</span>
				</div>
			</div>
		</CardContent>
	</Card>
</a>
