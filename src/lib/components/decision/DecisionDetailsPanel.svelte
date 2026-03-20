<script lang="ts">
	import PartyBadge from '$lib/components/PartyBadge.svelte';
	import { statusCopy, statusVariant, leadPartyName } from '$lib/decision-presentation';
	import { getPartyToneId } from '$lib/data/party-branding';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import type { DecisionRecord } from '$lib/server/decisions/types';

	let { decision }: { decision: DecisionRecord } = $props();
	const toneId = $derived(getPartyToneId(leadPartyName(decision)));
</script>

<Card class={`party-tone-${toneId} party-card-tint`}>
	<CardHeader class="space-y-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outline">{decision.city}</Badge>
			<Badge variant={statusVariant(decision.status)}>{statusCopy(decision.status)}</Badge>
			<span class="text-muted-foreground text-xs">{decision.date}</span>
		</div>
		<CardTitle class="text-2xl leading-snug">{decision.title}</CardTitle>
	</CardHeader>
	<CardContent class="space-y-6">
		<section class="space-y-2">
			<h2 class="text-base font-semibold">Kort resumé</h2>
			<p class="text-sm leading-6">{decision.summary}</p>
		</section>

		<Separator />

		<section class="space-y-2">
			<h2 class="text-base font-semibold">Forslagsstillere</h2>
			<div class="flex flex-wrap gap-2">
				{#each decision.proposers as proposer}
					<PartyBadge partyName={proposer} />
				{/each}
			</div>
		</section>

		<Separator />

		<section class="grid gap-4 md:grid-cols-3">
			<div class="space-y-2">
				<h3 class="text-sm font-semibold">Stemte for ({decision.votes_for.length})</h3>
				<div class="flex flex-wrap gap-2">
					{#if decision.votes_for.length === 0}
						<span class="text-muted-foreground text-sm">Ingen registreret</span>
					{:else}
						{#each decision.votes_for as vote}
							<PartyBadge partyName={vote} compact={true} />
						{/each}
					{/if}
				</div>
			</div>

			<div class="space-y-2">
				<h3 class="text-sm font-semibold">Stemte imod ({decision.votes_against.length})</h3>
				<div class="flex flex-wrap gap-2">
					{#if decision.votes_against.length === 0}
						<span class="text-muted-foreground text-sm">Ingen registreret</span>
					{:else}
						{#each decision.votes_against as vote}
							<PartyBadge partyName={vote} compact={true} />
						{/each}
					{/if}
				</div>
			</div>

			<div class="space-y-2">
				<h3 class="text-sm font-semibold">Undlod ({decision.votes_abstain.length})</h3>
				<div class="flex flex-wrap gap-2">
					{#if decision.votes_abstain.length === 0}
						<span class="text-muted-foreground text-sm">Ingen registreret</span>
					{:else}
						{#each decision.votes_abstain as vote}
							<Badge variant="outline">{vote}</Badge>
						{/each}
					{/if}
				</div>
			</div>
		</section>

		{#if decision.topic_tags?.length}
			<Separator />
			<section class="space-y-2">
				<h2 class="text-base font-semibold">Emner</h2>
				<div class="flex flex-wrap gap-2">
					{#each decision.topic_tags as topic}
						<Badge variant="outline">{topic}</Badge>
					{/each}
				</div>
			</section>
		{/if}

		{#if decision.source_summary_file}
			<Separator />
			<section class="space-y-2">
				<h2 class="text-base font-semibold">Kilde</h2>
				<a
					class="text-primary text-sm underline underline-offset-4"
					href={`/summaries/${decision.source_summary_file}`}
					target="_blank"
					rel="noreferrer"
				>
					Åbn mødesummary ({decision.source_meeting_date ?? decision.date})
				</a>
			</section>
		{/if}
	</CardContent>
</Card>
