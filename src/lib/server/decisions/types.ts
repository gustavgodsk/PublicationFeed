export type DecisionStatus = 'Passed' | 'Rejected' | 'Sent to Committee';

export interface DecisionRecord {
	id: string;
	date: string;
	city: string;
	title: string;
	summary: string;
	proposers: string[];
	status: DecisionStatus;
	votes_for: string[];
	votes_against: string[];
	votes_abstain: string[];
	proposal_headline?: string;
	citizen_headline?: string;
	citizen_impact_short?: string;
	affected_groups?: string[];
	impact_type?: string;
	impact_horizon?: 'now' | 'soon' | 'long-term';
	language_confidence?: 'low' | 'medium' | 'high';
	summary_source?: 'human' | 'ai-reviewed' | 'ai-draft';
	party_tags?: string[];
	candidate_tags?: string[];
	topic_tags?: string[];
	source_summary_file?: string;
	source_meeting_date?: string;
}

export interface DecisionFilters {
	sort: 'newest' | 'oldest';
	cities: string[];
	parties: string[];
	candidates: string[];
	statuses: DecisionStatus[];
	q: string;
}

export interface DecisionFacets {
	cities: string[];
	parties: string[];
	candidates: string[];
	statuses: DecisionStatus[];
}

export interface DecisionRepository {
	listDecisions(filters: DecisionFilters): DecisionRecord[];
	getDecisionById(id: string): DecisionRecord | null;
	getFacets(): DecisionFacets;
}

export interface DecisionsPageData {
	decisions: DecisionRecord[];
	facets: DecisionFacets;
	filters: DecisionFilters;
	queryString: string;
}
