<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import PartyBadge from '$lib/components/PartyBadge.svelte';
	import { findPartyBrand } from '$lib/data/party-branding';
	import type { PageData } from './$types';

	type Decision = PageData['decisions'][number];

	let { data }: { data: PageData } = $props();

	function partiesForCard(decision: Decision): string[] {
		const names = [...(decision.party_tags ?? []), ...decision.proposers];
		return Array.from(new Set(names)).slice(0, 3);
	}

	function leadParty(decision: Decision): string {
		return partiesForCard(decision)[0] ?? decision.proposers[0] ?? 'Ukendt aktør';
	}

	function leadStyle(decision: Decision): string {
		const brand = findPartyBrand(leadParty(decision));
		return `background: linear-gradient(135deg, ${brand.soft} 0%, transparent 65%), var(--card);`;
	}

	function statusCopy(status: string): string {
		if (status === 'Passed') return 'Vedtaget';
		if (status === 'Rejected') return 'Afvist';
		return 'Sendt til udvalg';
	}

	function statusVariant(status: string): 'default' | 'destructive' | 'secondary' {
		if (status === 'Passed') return 'default';
		if (status === 'Rejected') return 'destructive';
		return 'secondary';
	}

	function isSelected(key: string, value: string): boolean {
		const params = new URLSearchParams(data.queryString);
		return params.getAll(key).includes(value);
	}

	const activeFilterCount = $derived(
		data.filters.cities.length +
			data.filters.parties.length +
			data.filters.candidates.length +
			data.filters.statuses.length +
			(data.filters.q ? 1 : 0) +
			(data.filters.sort === 'oldest' ? 1 : 0)
	);
</script>

<main class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
	<section class="bg-background/90 sticky top-[65px] z-30 rounded-xl border p-3 shadow-sm backdrop-blur md:top-[61px]">
		<form method="GET" class="flex flex-wrap items-center gap-2">
			<div class="min-w-56 flex-1">
				<Input name="q" value={data.filters.q} placeholder="Søg: Vestergade, atomkraft, bolig..." />
			</div>

			<details class="group relative">
				<summary class="border-input bg-background hover:bg-accent list-none rounded-md border px-3 py-2 text-sm">
					By {#if data.filters.cities.length > 0}({data.filters.cities.length}){/if}
				</summary>
				<div class="bg-popover absolute left-0 z-40 mt-2 max-h-72 w-64 space-y-2 overflow-auto rounded-md border p-3 shadow-lg">
					{#each data.facets.cities as city}
						<label class="flex items-center gap-2 text-sm">
							<input type="checkbox" name="city" value={city} checked={isSelected('city', city)} />
							<span>{city}</span>
						</label>
					{/each}
				</div>
			</details>

			<details class="group relative">
				<summary class="border-input bg-background hover:bg-accent list-none rounded-md border px-3 py-2 text-sm">
					Parti {#if data.filters.parties.length > 0}({data.filters.parties.length}){/if}
				</summary>
				<div class="bg-popover absolute left-0 z-40 mt-2 max-h-72 w-72 space-y-2 overflow-auto rounded-md border p-3 shadow-lg">
					{#each data.facets.parties as party}
						<label class="flex items-center gap-2 text-sm">
							<input type="checkbox" name="party" value={party} checked={isSelected('party', party)} />
							<span>{party}</span>
						</label>
					{/each}
				</div>
			</details>

			<details class="group relative">
				<summary class="border-input bg-background hover:bg-accent list-none rounded-md border px-3 py-2 text-sm">
					Kandidat {#if data.filters.candidates.length > 0}({data.filters.candidates.length}){/if}
				</summary>
				<div class="bg-popover absolute left-0 z-40 mt-2 max-h-72 w-72 space-y-2 overflow-auto rounded-md border p-3 shadow-lg">
					{#if data.facets.candidates.length === 0}
						<p class="text-muted-foreground text-sm">Ingen kandidater i datasættet endnu.</p>
					{:else}
						{#each data.facets.candidates as candidate}
							<label class="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									name="candidate"
									value={candidate}
									checked={isSelected('candidate', candidate)}
								/>
								<span>{candidate}</span>
							</label>
						{/each}
					{/if}
				</div>
			</details>

			<details class="group relative">
				<summary class="border-input bg-background hover:bg-accent list-none rounded-md border px-3 py-2 text-sm">
					Status {#if data.filters.statuses.length > 0}({data.filters.statuses.length}){/if}
				</summary>
				<div class="bg-popover absolute left-0 z-40 mt-2 max-h-72 w-64 space-y-2 overflow-auto rounded-md border p-3 shadow-lg">
					{#each data.facets.statuses as status}
						<label class="flex items-center gap-2 text-sm">
							<input type="checkbox" name="status" value={status} checked={isSelected('status', status)} />
							<span>{statusCopy(status)}</span>
						</label>
					{/each}
				</div>
			</details>

			<select name="sort" class="border-input bg-background rounded-md border px-3 py-2 text-sm">
				<option value="newest" selected={data.filters.sort === 'newest'}>Nyeste først</option>
				<option value="oldest" selected={data.filters.sort === 'oldest'}>Ældste først</option>
			</select>

			<Button type="submit" size="sm">Opdater</Button>
			<Button href="/" variant="ghost" size="sm">Nulstil</Button>
		</form>

		{#if activeFilterCount > 0}
			<div class="mt-3 flex items-center gap-2">
				<Badge variant="outline">{activeFilterCount} aktive filtre</Badge>
			</div>
		{/if}
	</section>

	<section class="space-y-4">
		<div class="flex items-center justify-between">
			<p class="text-muted-foreground text-sm">{data.decisions.length} beslutninger</p>
		</div>

		{#if data.decisions.length === 0}
			<Card>
				<CardContent class="text-muted-foreground py-10 text-center text-sm">
					Ingen beslutninger matcher det, du har valgt.
				</CardContent>
			</Card>
		{:else}
			<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{#each data.decisions as decision}
					<a href={`/decision/${decision.id}?${data.queryString}`}>
						<Card
							class="hover:shadow-primary/15 hover:-translate-y-[2px] h-full transition-all duration-200"
							style={leadStyle(decision)}
						>
							<CardContent class="flex h-full flex-col gap-4 pt-6">
								<div class="flex items-center justify-between gap-2">
									<Badge variant={statusVariant(decision.status)}>{statusCopy(decision.status)}</Badge>
									<span class="text-muted-foreground text-xs">{decision.date}</span>
								</div>

								<h2 class="text-base leading-snug font-semibold">{decision.title}</h2>
								<p class="text-muted-foreground text-sm [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
									{decision.summary}
								</p>

								<div class="mt-auto space-y-3">
									<div class="flex flex-wrap gap-2">
										{#each partiesForCard(decision) as party}
											<PartyBadge partyName={party} compact={true} />
										{/each}
									</div>
									<div class="flex items-center justify-between">
										<Badge variant="outline">{decision.city}</Badge>
										<span class="text-primary text-sm font-semibold">Se hvad der blev besluttet</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</a>
				{/each}
			</div>
		{/if}
	</section>
</main>
