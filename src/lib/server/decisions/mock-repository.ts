import rawDecisions from '$lib/data/mock_decisions.json';
import type { DecisionFacets, DecisionFilters, DecisionRecord, DecisionStatus } from './types';
import type { DecisionRepository } from './repository';

const decisions = rawDecisions as DecisionRecord[];

function normalize(value: string): string {
	return value.trim().toLowerCase();
}

function stripCandidateSuffix(value: string): string {
	return value.replace(/\s*\(.*\)\s*$/, '').trim();
}

function collectParties(decision: DecisionRecord): string[] {
	const inferred = [
		...decision.proposers,
		...decision.votes_for,
		...decision.votes_against,
		...decision.votes_abstain.map(stripCandidateSuffix)
	];
	return Array.from(new Set([...(decision.party_tags ?? []), ...inferred]));
}

function collectCandidates(decision: DecisionRecord): string[] {
	const inferredFromAbstain = decision.votes_abstain
		.map((entry) => {
			const match = entry.match(/\(([^)]+)\)/);
			return match?.[1]?.trim() ?? '';
		})
		.filter(Boolean);
	return Array.from(new Set([...(decision.candidate_tags ?? []), ...inferredFromAbstain]));
}

function buildSearchText(decision: DecisionRecord): string {
	return [
		decision.id,
		decision.city,
		decision.title,
		decision.summary,
		decision.citizen_headline ?? '',
		decision.citizen_impact_short ?? '',
		...(decision.affected_groups ?? []),
		decision.impact_type ?? '',
		...decision.proposers,
		...decision.votes_for,
		...decision.votes_against,
		...decision.votes_abstain,
		...(decision.party_tags ?? []),
		...(decision.candidate_tags ?? []),
		...(decision.topic_tags ?? [])
	]
		.join(' ')
		.toLowerCase();
}

function includesAny(source: string[], wanted: string[]): boolean {
	if (wanted.length === 0) {
		return true;
	}
	const sourceSet = new Set(source.map(normalize));
	return wanted.some((value) => sourceSet.has(normalize(value)));
}

function byDate(a: DecisionRecord, b: DecisionRecord): number {
	return new Date(a.date).getTime() - new Date(b.date).getTime();
}

const mockDecisionRepository: DecisionRepository = {
	listDecisions(filters) {
		const rows = decisions.filter((decision) => {
			const parties = collectParties(decision);
			const candidates = collectCandidates(decision);
			const searchText = buildSearchText(decision);

			if (filters.cities.length > 0 && !includesAny([decision.city], filters.cities)) {
				return false;
			}
			if (filters.statuses.length > 0 && !includesAny([decision.status], filters.statuses)) {
				return false;
			}
			if (filters.parties.length > 0 && !includesAny(parties, filters.parties)) {
				return false;
			}
			if (filters.candidates.length > 0 && !includesAny(candidates, filters.candidates)) {
				return false;
			}
			if (filters.q && !searchText.includes(normalize(filters.q))) {
				return false;
			}
			return true;
		});

		return rows.toSorted((a, b) => (filters.sort === 'oldest' ? byDate(a, b) : byDate(b, a)));
	},
	getDecisionById(id) {
		return decisions.find((decision) => decision.id === id) ?? null;
	},
	getFacets() {
		const cities = new Set<string>();
		const parties = new Set<string>();
		const candidates = new Set<string>();
		const statuses = new Set<DecisionStatus>();

		for (const decision of decisions) {
			cities.add(decision.city);
			statuses.add(decision.status);
			for (const party of collectParties(decision)) {
				parties.add(party);
			}
			for (const candidate of collectCandidates(decision)) {
				candidates.add(candidate);
			}
		}

		return {
			cities: Array.from(cities).sort((a, b) => a.localeCompare(b)),
			parties: Array.from(parties).sort((a, b) => a.localeCompare(b)),
			candidates: Array.from(candidates).sort((a, b) => a.localeCompare(b)),
			statuses: Array.from(statuses).sort((a, b) => a.localeCompare(b))
		};
	}
};

export function parseFilters(searchParams: URLSearchParams): DecisionFilters {
	const sort = searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
	const statuses = searchParams
		.getAll('status')
		.filter((status): status is DecisionStatus =>
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

export default mockDecisionRepository;
