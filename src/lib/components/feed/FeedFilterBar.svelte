<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import type { DecisionFacets, DecisionFilters } from '$lib/server/decisions/types';
	import { statusCopy } from '$lib/decision-presentation';

	type FilterMenu = 'city' | 'party' | 'candidate' | 'status' | null;

	let {
		facets,
		filters,
		activeFilterCount,
		openMenu,
		onOpenMenu,
		onToggleValue,
		onSetSort,
		onSetSearch,
		onClearAll
	}: {
		facets: DecisionFacets;
		filters: DecisionFilters;
		activeFilterCount: number;
		openMenu: FilterMenu;
		onOpenMenu: (menu: FilterMenu) => void;
		onToggleValue: (key: 'city' | 'party' | 'candidate' | 'status', value: string) => void;
		onSetSort: (sort: DecisionFilters['sort']) => void;
		onSetSearch: (q: string) => void;
		onClearAll: () => void;
	} = $props();

	function toggleMenu(next: FilterMenu): void {
		onOpenMenu(openMenu === next ? null : next);
	}
</script>

<section class="bg-background/90 sticky top-[65px] z-30 rounded-xl border p-3 shadow-sm backdrop-blur md:top-[61px]" data-filter-root>
	{#if openMenu}
		<button
			type="button"
			class="fixed inset-0 z-20 bg-transparent"
			onclick={() => onOpenMenu(null)}
			aria-label="Close filters"
		></button>
	{/if}

	<div class="relative z-30 flex flex-wrap items-center gap-2">
		<div class="min-w-56 flex-1">
			<Input
				name="q"
				value={filters.q}
				placeholder="Søg: Vestergade, atomkraft, bolig..."
				oninput={(event) => onSetSearch((event.currentTarget as HTMLInputElement).value)}
			/>
		</div>

		<div class="relative">
			<Button type="button" variant="outline" size="sm" onclick={() => toggleMenu('city')}>
				By {#if filters.cities.length > 0}({filters.cities.length}){/if}
			</Button>
			{#if openMenu === 'city'}
				<div class="bg-popover absolute left-0 z-40 mt-2 max-h-72 w-64 space-y-2 overflow-auto rounded-md border p-3 shadow-lg">
					{#each facets.cities as city}
						<label class="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={filters.cities.includes(city)}
								onchange={() => {
									onToggleValue('city', city);
									onOpenMenu(null);
								}}
							/>
							<span>{city}</span>
						</label>
					{/each}
				</div>
			{/if}
		</div>

		<div class="relative">
			<Button type="button" variant="outline" size="sm" onclick={() => toggleMenu('party')}>
				Parti {#if filters.parties.length > 0}({filters.parties.length}){/if}
			</Button>
			{#if openMenu === 'party'}
				<div class="bg-popover absolute left-0 z-40 mt-2 max-h-72 w-72 space-y-2 overflow-auto rounded-md border p-3 shadow-lg">
					{#each facets.parties as party}
						<label class="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={filters.parties.includes(party)}
								onchange={() => {
									onToggleValue('party', party);
									onOpenMenu(null);
								}}
							/>
							<span>{party}</span>
						</label>
					{/each}
				</div>
			{/if}
		</div>

		<div class="relative">
			<Button type="button" variant="outline" size="sm" onclick={() => toggleMenu('candidate')}>
				Kandidat {#if filters.candidates.length > 0}({filters.candidates.length}){/if}
			</Button>
			{#if openMenu === 'candidate'}
				<div class="bg-popover absolute left-0 z-40 mt-2 max-h-72 w-72 space-y-2 overflow-auto rounded-md border p-3 shadow-lg">
					{#if facets.candidates.length === 0}
						<p class="text-muted-foreground text-sm">Ingen kandidater i datasættet endnu.</p>
					{:else}
						{#each facets.candidates as candidate}
							<label class="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									checked={filters.candidates.includes(candidate)}
									onchange={() => {
										onToggleValue('candidate', candidate);
										onOpenMenu(null);
									}}
								/>
								<span>{candidate}</span>
							</label>
						{/each}
					{/if}
				</div>
			{/if}
		</div>

		<div class="relative">
			<Button type="button" variant="outline" size="sm" onclick={() => toggleMenu('status')}>
				Status {#if filters.statuses.length > 0}({filters.statuses.length}){/if}
			</Button>
			{#if openMenu === 'status'}
				<div class="bg-popover absolute left-0 z-40 mt-2 max-h-72 w-64 space-y-2 overflow-auto rounded-md border p-3 shadow-lg">
					{#each facets.statuses as status}
						<label class="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={filters.statuses.includes(status)}
								onchange={() => {
									onToggleValue('status', status);
									onOpenMenu(null);
								}}
							/>
							<span>{statusCopy(status)}</span>
						</label>
					{/each}
				</div>
			{/if}
		</div>

		<select
			class="border-input bg-background rounded-md border px-3 py-2 text-sm"
			value={filters.sort}
			onchange={(event) => onSetSort((event.currentTarget as HTMLSelectElement).value as DecisionFilters['sort'])}
		>
			<option value="newest">Nyeste først</option>
			<option value="oldest">Ældste først</option>
		</select>

		<Button type="button" variant="ghost" size="sm" onclick={onClearAll}>Nulstil</Button>
	</div>

	{#if activeFilterCount > 0}
		<div class="relative z-30 mt-3 flex items-center gap-2">
			<Badge variant="outline">{activeFilterCount} aktive filtre</Badge>
		</div>
	{/if}
</section>
