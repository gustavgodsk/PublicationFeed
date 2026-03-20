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

export interface DecisionsPageData {
	decisions: DecisionRecord[];
	facets: DecisionFacets;
	filters: DecisionFilters;
	queryString: string;
}
