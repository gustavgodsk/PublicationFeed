<script lang="ts">
	import { goto } from '$app/navigation';
	import DecisionFeedGrid from '$lib/components/feed/DecisionFeedGrid.svelte';
	import FeedFilterBar from '$lib/components/feed/FeedFilterBar.svelte';
	import { toDecisionCardModel } from '$lib/decision-presentation';
	import type { DecisionFilters } from '$lib/server/decisions/types';
	import type { PageData } from './$types';

	type FilterMenu = 'city' | 'party' | 'candidate' | 'status' | null;

	let { data }: { data: PageData } = $props();
	let openMenu = $state<FilterMenu>(null);
	let searchDebounce: ReturnType<typeof setTimeout> | undefined;

	const cardModels = $derived(data.decisions.map((decision) => toDecisionCardModel(decision, data.queryString)));
	const activeFilterCount = $derived(
		data.filters.cities.length +
			data.filters.parties.length +
			data.filters.candidates.length +
			data.filters.statuses.length +
			(data.filters.q ? 1 : 0) +
			(data.filters.sort === 'oldest' ? 1 : 0)
	);

	function navigateWithParams(params: URLSearchParams): void {
		const query = params.toString();
		const href = query ? `/?${query}` : '/';
		void goto(href, { keepFocus: true, noScroll: true, replaceState: true });
	}

	function toggleValue(key: 'city' | 'party' | 'candidate' | 'status', value: string): void {
		const params = new URLSearchParams(data.queryString);
		const values = params.getAll(key);
		const isSelected = values.includes(value);

		params.delete(key);
		for (const currentValue of values) {
			if (!(isSelected && currentValue === value)) {
				params.append(key, currentValue);
			}
		}

		if (!isSelected) {
			params.append(key, value);
		}

		navigateWithParams(params);
	}

	function setSort(sort: DecisionFilters['sort']): void {
		const params = new URLSearchParams(data.queryString);
		if (sort === 'newest') {
			params.delete('sort');
		} else {
			params.set('sort', 'oldest');
		}
		navigateWithParams(params);
	}

	function setSearch(q: string): void {
		if (searchDebounce) {
			clearTimeout(searchDebounce);
		}
		searchDebounce = setTimeout(() => {
			const params = new URLSearchParams(data.queryString);
			if (q.trim()) {
				params.set('q', q.trim());
			} else {
				params.delete('q');
			}
			navigateWithParams(params);
		}, 280);
	}

	function clearAll(): void {
		navigateWithParams(new URLSearchParams());
	}
</script>

<main class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
	<FeedFilterBar
		facets={data.facets}
		filters={data.filters}
		{activeFilterCount}
		{openMenu}
		onOpenMenu={(menu) => (openMenu = menu)}
		onToggleValue={toggleValue}
		onSetSort={setSort}
		onSetSearch={setSearch}
		onClearAll={clearAll}
	/>

	<DecisionFeedGrid decisions={cardModels} />
</main>
