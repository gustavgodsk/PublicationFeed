import type { BadgeVariant } from '$lib/components/ui/badge';
import type { DecisionRecord } from '$lib/server/decisions/types';

export interface DecisionCardModel {
    id: string;
    headline: string;
    impact: string;
    date: string;
    city: string;
    status: DecisionRecord['status'];
    statusText: string;
    statusVariant: BadgeVariant;
    statusToneClass: 'status-card-passed' | 'status-card-rejected' | 'status-card-committee';
    votesFor: string[];
    votesAgainst: string[];
    votesAbstain: string[];
    votesForCount: number;
    votesAgainstCount: number;
    votesAbstainCount: number;
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

function statusToneClass(status: DecisionRecord['status']): DecisionCardModel['statusToneClass'] {
    if (status === 'Passed') return 'status-card-passed';
    if (status === 'Rejected') return 'status-card-rejected';
    return 'status-card-committee';
}

export function leadPartyName(decision: DecisionRecord): string {
    return decision.party_tags?.[0] ?? decision.proposers[0] ?? 'Ukendt aktør';
}

export function toDecisionCardModel(decision: DecisionRecord, queryString: string): DecisionCardModel {
    const fallbackHeadline = decision.title;
    const fallbackImpact = decision.summary;

    return {
        id: decision.id,
        headline: decision.citizen_headline ?? fallbackHeadline,
        impact: decision.citizen_impact_short ?? fallbackImpact,
        date: decision.date,
        city: decision.city,
        status: decision.status,
        statusText: statusCopy(decision.status),
        statusVariant: statusVariant(decision.status),
        statusToneClass: statusToneClass(decision.status),
        votesFor: decision.votes_for,
        votesAgainst: decision.votes_against,
        votesAbstain: decision.votes_abstain,
        votesForCount: decision.votes_for.length,
        votesAgainstCount: decision.votes_against.length,
        votesAbstainCount: decision.votes_abstain.length,
        href: `/decision/${decision.id}?${queryString}`
    };
}
