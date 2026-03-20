import type { PageServerLoad } from './$types';
import decisionRepository from '$lib/server/decisions/mock-repository';
import { parseFilters } from '$lib/server/decisions/filters';

export const load: PageServerLoad = async ({ url }) => {
	const filters = parseFilters(url.searchParams);

	return {
		decisions: decisionRepository.listDecisions(filters),
		facets: decisionRepository.getFacets(),
		filters,
		queryString: url.searchParams.toString()
	};
};
