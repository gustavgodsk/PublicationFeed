# Plan for Civic Decisions Feed POC

## 1. Goal and Scope
Build a SvelteKit 5 proof of concept where citizens can:
- Browse a timeline feed of local political decisions.
- See title, summary, status, date, city, and proposer(s).
- Open a detail page at /decision/[id] with full voting breakdown.
- Filter and sort decisions by practical facets (date, city, party, candidate, status, text query).

This phase uses mock data from src/lib/data/mock_decisions.json.
Future phase will replace mock storage with a database and add semantic query support.

## 2. Current Baseline in This Repository
- SvelteKit 5, TypeScript, Tailwind v4 are already configured.
- shadcn-svelte configuration already exists (components.json).
- The root page currently renders a simple list from mock JSON.
- Summary PDFs are available in static/summaries.

## 3. Product Requirements for the POC
- Feed page:
  - Timeline style listing.
  - Each item shows date, city, title, short summary, status, proposer party.
  - Click item to open /decision/[id].
- Detail page:
  - Full title and metadata.
  - Full summary.
  - Proposers.
  - Votes for, against, abstain.
- Filter and sort:
  - Sort by time (newest and oldest).
  - Filter by city.
  - Filter by party.
  - Filter by candidate.
  - Filter by status.
  - Text query for quick keyword search.

## 4. Data Model Plan
Keep existing fields and add optional metadata for better filtering and future AI search.

Add optional fields to each decision record:
- party_tags: string[]
- candidate_tags: string[]
- topic_tags: string[]
- source_summary_file: string
- source_meeting_date: string

Computed helper field at runtime (not required to persist now):
- search_text: string

search_text should combine:
- title
- summary
- proposers
- votes_for
- votes_against
- votes_abstain
- tags

Reason:
- Makes keyword filtering simpler and consistent.
- Prepares data for semantic ranking later.

## 5. Architecture Plan (POC but upgrade-ready)
Introduce a lightweight repository boundary now.

Create:
- src/lib/server/decisions/types.ts
- src/lib/server/decisions/repository.ts
- src/lib/server/decisions/mock-repository.ts

Principle:
- Route loaders call repository methods, not raw JSON directly.
- Current implementation reads mock JSON.
- Future implementation can swap to database without changing UI pages.

Suggested repository methods:
- listDecisions(filters): Decision[]
- getDecisionById(id): Decision | null
- getFilterFacets(currentFilters): facet values for city/party/candidate/status

## 6. UI and Component Plan (shadcn-svelte)
Suggested components to install first:
- Card
- Badge
- Button
- Input
- Select
- Checkbox
- Separator
- Accordion
- Empty
- Skeleton

CLI usage pattern:
- bun x shadcn-svelte@latest add <componentName>

Feed UI:
- Vertical timeline with decision cards.
- Status badge color mapping:
  - Passed: positive
  - Rejected: destructive
  - Sent to Committee: neutral
- Filter panel at top (desktop) and collapsible on mobile.

Detail UI:
- Header card with status and metadata.
- Separate sections for summary, proposers, and votes.
- Source link to matching summary PDF if mapped.

## 7. Routing and URL Strategy
Routes:
- / (feed)
- /decision/[id] (detail)

Use URL query parameters on feed for all filters:
- sort=newest|oldest
- city=<value>
- party=<value>
- candidate=<value>
- status=<value>
- q=<text>

Why:
- Sharable links.
- Browser refresh keeps state.
- Easy migration to server-side or DB-backed filtering.

## 8. Filtering and Ranking Logic
Server-side filtering in +page.server.ts:
1. Parse query parameters.
2. Build normalized filter object.
3. Get filtered data from repository.
4. Return records plus facet options.

Filter semantics:
- city/status: exact match (case-insensitive normalization).
- party/candidate: include if any selected value matches tags or proposer list.
- q: case-insensitive contains over search_text.

Sorting:
- newest: descending by date
- oldest: ascending by date

## 9. Mock Data Enrichment Plan
Enhance src/lib/data/mock_decisions.json with realistic optional fields.

Examples of improvements:
- Add candidate_tags where candidate names are known.
- Add topic_tags such as traffic, housing, energy, culture.
- Map each item to source_summary_file from static/summaries when possible.

This helps:
- Candidate filter become usable now.
- Better future semantic experiments.

## 10. Future Semantic Query Plan (Post-POC)
Target user queries:
- What did party X do in my city in the last year?
- What are candidate Y most important subjects?
- Show all decisions about a specific road in my city.

Planned approach:
1. Keep structured filters as first-stage narrowing.
2. Add semantic search service with fallback to keyword ranking.
3. Later integrate Semantic Kernel functions for retrieval and synthesis.
4. Add citations in answers (decision id and source summary file).

Recommended abstractions to define early:
- searchByKeywords(filters, q)
- searchSemantically(question, filters)
- summarizeByPartyOrCandidate(entity, city, period)

## 11. Delivery Phases
Phase A (MVP feature-complete):
1. Add repository/types files.
2. Build feed timeline cards.
3. Add filters and sorting with URL sync.
4. Build detail route /decision/[id].

Phase B (quality and UX):
1. Loading and empty states.
2. Better mobile filter ergonomics.
3. Basic tests for filter logic and route behavior.

Phase C (AI-ready foundation):
1. Search service contract and keyword implementation.
2. Semantic-ready data preparation.
3. Database-backed repository implementation.

## 12. Definition of Done for Phase A
- Home page shows timeline feed from mock data.
- Users can sort by date and apply city/party/candidate/status/text filters.
- Filter state is represented in URL and survives refresh.
- Clicking a decision opens /decision/[id].
- Detail page shows summary, proposers, votes for/against/abstain.
- Missing id returns not-found behavior.
- Project passes type checks for touched code.

## 13. Risks and Mitigations
Risk: candidate data is incomplete in mock source.
Mitigation: add candidate_tags now and mark unknowns explicitly.

Risk: filtering logic becomes duplicated in routes.
Mitigation: centralize in repository or dedicated filter utility.

Risk: future semantic features require data reshaping.
Mitigation: add optional tags and source mapping now.

## 14. Immediate Next Step
Implement Phase A end-to-end in this repository, starting with data types and repository abstraction, then feed UI, then detail route.