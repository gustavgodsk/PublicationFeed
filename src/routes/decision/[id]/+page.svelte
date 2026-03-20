<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import type { BadgeVariant } from '$lib/components/ui/badge';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function statusVariant(status: string): BadgeVariant {
		if (status === 'Passed') return 'default';
		if (status === 'Rejected') return 'destructive';
		return 'secondary';
	}

	const backHref = $derived(data.backQueryString ? `/?${data.backQueryString}` : '/');
</script>

<main class="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:px-6">
	<div class="flex items-center justify-between">
		<Button href={backHref} variant="outline" size="sm">Tilbage til feed</Button>
		<Badge variant="outline">{data.decision.id}</Badge>
	</div>

	<Card>
		<CardHeader class="space-y-3">
			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="outline">{data.decision.city}</Badge>
				<Badge variant={statusVariant(data.decision.status)}>{data.decision.status}</Badge>
				<span class="text-muted-foreground text-xs">{data.decision.date}</span>
			</div>
			<CardTitle class="text-2xl leading-snug">{data.decision.title}</CardTitle>
		</CardHeader>
		<CardContent class="space-y-6">
			<section class="space-y-2">
				<h2 class="text-base font-semibold">Kort resumé</h2>
				<p class="text-sm leading-6">{data.decision.summary}</p>
			</section>

			<Separator />

			<section class="space-y-2">
				<h2 class="text-base font-semibold">Forslagsstillere</h2>
				<div class="flex flex-wrap gap-2">
					{#each data.decision.proposers as proposer}
						<Badge variant="secondary">{proposer}</Badge>
					{/each}
				</div>
			</section>

			<Separator />

			<section class="grid gap-4 md:grid-cols-3">
				<div class="space-y-2">
					<h3 class="text-sm font-semibold">Stemte for ({data.decision.votes_for.length})</h3>
					<ul class="text-sm">
						{#if data.decision.votes_for.length === 0}
							<li class="text-muted-foreground">Ingen registreret</li>
						{:else}
							{#each data.decision.votes_for as vote}
								<li>{vote}</li>
							{/each}
						{/if}
					</ul>
				</div>

				<div class="space-y-2">
					<h3 class="text-sm font-semibold">Stemte imod ({data.decision.votes_against.length})</h3>
					<ul class="text-sm">
						{#if data.decision.votes_against.length === 0}
							<li class="text-muted-foreground">Ingen registreret</li>
						{:else}
							{#each data.decision.votes_against as vote}
								<li>{vote}</li>
							{/each}
						{/if}
					</ul>
				</div>

				<div class="space-y-2">
					<h3 class="text-sm font-semibold">Undlod ({data.decision.votes_abstain.length})</h3>
					<ul class="text-sm">
						{#if data.decision.votes_abstain.length === 0}
							<li class="text-muted-foreground">Ingen registreret</li>
						{:else}
							{#each data.decision.votes_abstain as vote}
								<li>{vote}</li>
							{/each}
						{/if}
					</ul>
				</div>
			</section>

			{#if data.decision.topic_tags?.length}
				<Separator />
				<section class="space-y-2">
					<h2 class="text-base font-semibold">Emner</h2>
					<div class="flex flex-wrap gap-2">
						{#each data.decision.topic_tags as topic}
							<Badge variant="outline">{topic}</Badge>
						{/each}
					</div>
				</section>
			{/if}

			{#if data.decision.source_summary_file}
				<Separator />
				<section class="space-y-2">
					<h2 class="text-base font-semibold">Kilde</h2>
					<a
						class="text-primary text-sm underline underline-offset-4"
						href={`/summaries/${data.decision.source_summary_file}`}
						target="_blank"
						rel="noreferrer"
					>
						Åbn mødesummary ({data.decision.source_meeting_date ?? data.decision.date})
					</a>
				</section>
			{/if}
		</CardContent>
	</Card>
</main>
