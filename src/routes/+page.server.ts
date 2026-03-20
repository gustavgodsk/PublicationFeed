import decisionRepository, { parseFilters } from '$lib/server/decisions/mock-repository';

export async function load({ url }) {
    const filters = parseFilters(url.searchParams);

    return {
        decisions: decisionRepository.listDecisions(filters),
        facets: decisionRepository.getFacets(),
        filters,
        queryString: url.searchParams.toString()
    };
}
