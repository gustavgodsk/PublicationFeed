import type { DecisionFacets, DecisionFilters, DecisionRecord } from './types';

export interface DecisionRepository {
	listDecisions(filters: DecisionFilters): DecisionRecord[];
	getDecisionById(id: string): DecisionRecord | null;
	getFacets(): DecisionFacets;
}
