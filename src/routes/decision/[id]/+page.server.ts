import { error } from '@sveltejs/kit';
import decisionRepository from '$lib/server/decisions/mock-repository';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const decision = decisionRepository.getDecisionById(params.id);

	if (!decision) {
		throw error(404, 'Decision not found');
	}

	return {
		decision,
		backQueryString: url.searchParams.toString()
	};
};
