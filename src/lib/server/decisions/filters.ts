import type { DecisionFilters, DecisionStatus } from './types';

export function parseFilters(searchParams: URLSearchParams): DecisionFilters {
	const sort = searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
	const statuses = searchParams
		.getAll('status')
		.filter(
			(status): status is DecisionStatus =>
				status === 'Passed' || status === 'Rejected' || status === 'Sent to Committee'
		);

	return {
		sort,
		cities: searchParams.getAll('city').filter(Boolean),
		parties: searchParams.getAll('party').filter(Boolean),
		candidates: searchParams.getAll('candidate').filter(Boolean),
		statuses,
		q: searchParams.get('q')?.trim() ?? ''
	};
}
