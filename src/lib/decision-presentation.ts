import type { BadgeVariant } from '$lib/components/ui/badge';
import { getPartyToneId } from '$lib/data/party-branding';
import type { DecisionRecord } from '$lib/server/decisions/types';

export interface DecisionCardModel {
	id: string;
	title: string;
	summary: string;
	date: string;
	city: string;
	status: DecisionRecord['status'];
	statusText: string;
	statusVariant: BadgeVariant;
	partyNames: string[];
	leadPartyTone: string;
	href: string;
}

export function statusCopy(status: string): string {
	if (status === 'Passed') return 'Vedtaget';
	if (status === 'Rejected') return 'Afvist';
	return 'Sendt til udvalg';
}

export function statusVariant(status: string): BadgeVariant {
	if (status === 'Passed') return 'default';
	if (status === 'Rejected') return 'destructive';
	return 'secondary';
}

export function partiesForDecision(decision: DecisionRecord): string[] {
	const names = [...(decision.party_tags ?? []), ...decision.proposers];
	return Array.from(new Set(names)).slice(0, 3);
}

export function leadPartyName(decision: DecisionRecord): string {
	return partiesForDecision(decision)[0] ?? decision.proposers[0] ?? 'Ukendt aktør';
}

export function toDecisionCardModel(decision: DecisionRecord, queryString: string): DecisionCardModel {
	return {
		id: decision.id,
		title: decision.title,
		summary: decision.summary,
		date: decision.date,
		city: decision.city,
		status: decision.status,
		statusText: statusCopy(decision.status),
		statusVariant: statusVariant(decision.status),
		partyNames: partiesForDecision(decision),
		leadPartyTone: getPartyToneId(leadPartyName(decision)),
		href: `/decision/${decision.id}?${queryString}`
	};
}
