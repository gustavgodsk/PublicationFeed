<script lang="ts">
    import {
        Accordion,
        AccordionContent,
        AccordionItem,
        AccordionTrigger
    } from '$lib/components/ui/accordion';
    import { Badge } from '$lib/components/ui/badge';
    import type { BadgeVariant } from '$lib/components/ui/badge';
    import { Button } from '$lib/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { Input } from '$lib/components/ui/input';
    import { Separator } from '$lib/components/ui/separator';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    const facetKeys = {
        city: 'city',
        party: 'party',
        candidate: 'candidate',
        status: 'status'
    } as const;

    function statusVariant(status: string): BadgeVariant {
        if (status === 'Passed') return 'default';
        if (status === 'Rejected') return 'destructive';
        return 'secondary';
    }

    function withToggledParam(key: string, value: string): string {
        const params = new URLSearchParams(data.queryString);
        const values = params.getAll(key);
        const isSelected = values.includes(value);

        params.delete(key);
        for (const currentValue of values) {
            if (!(isSelected && currentValue === value)) {
                params.append(key, currentValue);
            }
        }

        if (!isSelected) {
            params.append(key, value);
        }

        const query = params.toString();
        return query ? `/?${query}` : '/';
    }

    function withClearedParam(key: string): string {
        const params = new URLSearchParams(data.queryString);
        params.delete(key);
        const query = params.toString();
        return query ? `/?${query}` : '/';
    }

    function withRemovedParamValue(key: string, value: string): string {
        const params = new URLSearchParams(data.queryString);
        const values = params.getAll(key);
        params.delete(key);

        let removed = false;
        for (const currentValue of values) {
            if (!removed && currentValue === value) {
                removed = true;
                continue;
            }
            params.append(key, currentValue);
        }

        const query = params.toString();
        return query ? `/?${query}` : '/';
    }

    function withClearedSearch(): string {
        const params = new URLSearchParams(data.queryString);
        params.delete('q');
        const query = params.toString();
        return query ? `/?${query}` : '/';
    }

    function withNewestSort(): string {
        const params = new URLSearchParams(data.queryString);
        params.delete('sort');
        const query = params.toString();
        return query ? `/?${query}` : '/';
    }

    function isSelected(key: string, value: string): boolean {
        const params = new URLSearchParams(data.queryString);
        return params.getAll(key).includes(value);
    }

    const activeFilters = $derived([
        ...data.filters.cities.map((value) => ({ key: facetKeys.city, value, label: `By: ${value}` })),
        ...data.filters.parties.map((value) => ({ key: facetKeys.party, value, label: `Parti: ${value}` })),
        ...data.filters.candidates.map((value) => ({ key: facetKeys.candidate, value, label: `Kandidat: ${value}` })),
        ...data.filters.statuses.map((value) => ({ key: facetKeys.status, value, label: `Status: ${value}` })),
        ...(data.filters.q ? [{ key: 'q', value: data.filters.q, label: `Søgning: ${data.filters.q}` }] : []),
        ...(data.filters.sort === 'oldest'
            ? [{ key: 'sort', value: 'oldest', label: 'Sortering: Ældste først' }]
            : [])
    ]);
</script>

<main class="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-6">
    <header class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">Byrådsbeslutninger</h1>
        <p class="text-muted-foreground max-w-3xl text-sm md:text-base">
            Følg de seneste beslutninger, se hvem der foreslog dem, og få et hurtigt overblik over hvem der stemte
            for eller imod.
        </p>
    </header>

    <Card>
        <CardHeader>
            <CardTitle>Filtre</CardTitle>
            <CardDescription>Filtrer på by, parti, kandidat, status eller søg i beslutningsteksten.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
            <form method="GET" class="grid gap-3 md:grid-cols-[1fr_180px_auto]">
                <Input name="q" value={data.filters.q} placeholder="Søg f.eks. Vestergade eller atomkraft" />
                <select
                    name="sort"
                    class="border-input bg-background rounded-md border px-3 py-2 text-sm"
                    value={data.filters.sort}
                >
                    <option value="newest">Nyeste først</option>
                    <option value="oldest">Ældste først</option>
                </select>
                <Button type="submit">Anvend</Button>

                {#each data.filters.cities as city}
                    <input type="hidden" name="city" value={city} />
                {/each}
                {#each data.filters.parties as party}
                    <input type="hidden" name="party" value={party} />
                {/each}
                {#each data.filters.candidates as candidate}
                    <input type="hidden" name="candidate" value={candidate} />
                {/each}
                {#each data.filters.statuses as status}
                    <input type="hidden" name="status" value={status} />
                {/each}
            </form>

            {#if activeFilters.length > 0}
                <div class="bg-muted/40 space-y-3 rounded-lg border p-3">
                    <div class="flex items-center justify-between gap-2">
                        <h2 class="text-sm font-semibold">Aktive filtre ({activeFilters.length})</h2>
                        <Button href="/" variant="ghost" size="xs">Nulstil alle</Button>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        {#each activeFilters as filter}
                            {#if filter.key === 'q'}
                                <Badge href={withClearedSearch()} variant="secondary">{filter.label}</Badge>
                            {:else if filter.key === 'sort'}
                                <Badge href={withNewestSort()} variant="secondary">{filter.label}</Badge>
                            {:else}
                                <Badge href={withRemovedParamValue(filter.key, filter.value)} variant="secondary">{filter.label}</Badge>
                            {/if}
                        {/each}
                    </div>
                </div>
            {/if}

            <div class="hidden grid-cols-2 gap-6 md:grid">
                <div class="space-y-4">
                    <div class="flex items-center justify-between gap-2">
                        <h2 class="text-sm font-semibold">By</h2>
                        <a class="text-muted-foreground text-xs hover:underline" href={withClearedParam(facetKeys.city)}>Ryd</a>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        {#each data.facets.cities as city}
                            <Badge
                                href={withToggledParam(facetKeys.city, city)}
                                variant={isSelected(facetKeys.city, city) ? 'default' : 'outline'}
                            >
                                {city}
                            </Badge>
                        {/each}
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="flex items-center justify-between gap-2">
                        <h2 class="text-sm font-semibold">Status</h2>
                        <a class="text-muted-foreground text-xs hover:underline" href={withClearedParam(facetKeys.status)}>Ryd</a>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        {#each data.facets.statuses as status}
                            <Badge
                                href={withToggledParam(facetKeys.status, status)}
                                variant={isSelected(facetKeys.status, status) ? 'default' : 'outline'}
                            >
                                {status}
                            </Badge>
                        {/each}
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="flex items-center justify-between gap-2">
                        <h2 class="text-sm font-semibold">Parti</h2>
                        <a class="text-muted-foreground text-xs hover:underline" href={withClearedParam(facetKeys.party)}>Ryd</a>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        {#each data.facets.parties as party}
                            <Badge
                                href={withToggledParam(facetKeys.party, party)}
                                variant={isSelected(facetKeys.party, party) ? 'default' : 'outline'}
                            >
                                {party}
                            </Badge>
                        {/each}
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="flex items-center justify-between gap-2">
                        <h2 class="text-sm font-semibold">Kandidat</h2>
                        <a class="text-muted-foreground text-xs hover:underline" href={withClearedParam(facetKeys.candidate)}>Ryd</a>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        {#if data.facets.candidates.length === 0}
                            <p class="text-muted-foreground text-sm">Ingen kandidatdata i det aktuelle datasæt endnu.</p>
                        {:else}
                            {#each data.facets.candidates as candidate}
                                <Badge
                                    href={withToggledParam(facetKeys.candidate, candidate)}
                                    variant={isSelected(facetKeys.candidate, candidate) ? 'default' : 'outline'}
                                >
                                    {candidate}
                                </Badge>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>

            <Accordion type="multiple" class="md:hidden">
                <AccordionItem value="cities">
                    <AccordionTrigger class="py-2 text-sm font-semibold">By</AccordionTrigger>
                    <AccordionContent>
                        <div class="space-y-3">
                            <a class="text-muted-foreground text-xs hover:underline" href={withClearedParam(facetKeys.city)}>Ryd byfilter</a>
                            <div class="flex flex-wrap gap-2">
                                {#each data.facets.cities as city}
                                    <Badge
                                        href={withToggledParam(facetKeys.city, city)}
                                        variant={isSelected(facetKeys.city, city) ? 'default' : 'outline'}
                                    >
                                        {city}
                                    </Badge>
                                {/each}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="parties">
                    <AccordionTrigger class="py-2 text-sm font-semibold">Parti</AccordionTrigger>
                    <AccordionContent>
                        <div class="space-y-3">
                            <a class="text-muted-foreground text-xs hover:underline" href={withClearedParam(facetKeys.party)}>Ryd partifilter</a>
                            <div class="flex flex-wrap gap-2">
                                {#each data.facets.parties as party}
                                    <Badge
                                        href={withToggledParam(facetKeys.party, party)}
                                        variant={isSelected(facetKeys.party, party) ? 'default' : 'outline'}
                                    >
                                        {party}
                                    </Badge>
                                {/each}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="candidates">
                    <AccordionTrigger class="py-2 text-sm font-semibold">Kandidat</AccordionTrigger>
                    <AccordionContent>
                        <div class="space-y-3">
                            <a class="text-muted-foreground text-xs hover:underline" href={withClearedParam(facetKeys.candidate)}>Ryd kandidatfilter</a>
                            <div class="flex flex-wrap gap-2">
                                {#if data.facets.candidates.length === 0}
                                    <p class="text-muted-foreground text-sm">Ingen kandidatdata i det aktuelle datasæt endnu.</p>
                                {:else}
                                    {#each data.facets.candidates as candidate}
                                        <Badge
                                            href={withToggledParam(facetKeys.candidate, candidate)}
                                            variant={isSelected(facetKeys.candidate, candidate) ? 'default' : 'outline'}
                                        >
                                            {candidate}
                                        </Badge>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="statuses">
                    <AccordionTrigger class="py-2 text-sm font-semibold">Status</AccordionTrigger>
                    <AccordionContent>
                        <div class="space-y-3">
                            <a class="text-muted-foreground text-xs hover:underline" href={withClearedParam(facetKeys.status)}>Ryd statusfilter</a>
                            <div class="flex flex-wrap gap-2">
                                {#each data.facets.statuses as status}
                                    <Badge
                                        href={withToggledParam(facetKeys.status, status)}
                                        variant={isSelected(facetKeys.status, status) ? 'default' : 'outline'}
                                    >
                                        {status}
                                    </Badge>
                                {/each}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div class="flex justify-end">
                <Button href="/" variant="outline">Nulstil alle filtre</Button>
            </div>
        </CardContent>
    </Card>

    <section class="space-y-4">
        <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Beslutninger</h2>
            <p class="text-muted-foreground text-sm">{data.decisions.length} resultater</p>
        </div>

        {#if data.decisions.length === 0}
            <Card>
                <CardContent class="text-muted-foreground py-8 text-center text-sm">
                    Ingen beslutninger matcher de valgte filtre.
                </CardContent>
            </Card>
        {:else}
            <div class="space-y-4">
                {#each data.decisions as decision}
                    <Card class="hover:border-primary/30 transition-colors">
                        <CardHeader class="space-y-3">
                            <div class="flex flex-wrap items-center gap-2">
                                <Badge variant="outline">{decision.city}</Badge>
                                <Badge variant={statusVariant(decision.status)}>{decision.status}</Badge>
                                <span class="text-muted-foreground text-xs">{decision.date}</span>
                            </div>
                            <CardTitle class="text-xl leading-snug">
                                <a class="hover:underline" href={`/decision/${decision.id}?${data.queryString}`}>{decision.title}</a>
                            </CardTitle>
                            <CardDescription>
                                Foreslået af: {decision.proposers.join(', ') || 'Ukendt'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <p class="text-sm leading-6">{decision.summary}</p>
                            <div class="flex items-center justify-end">
                                <Button href={`/decision/${decision.id}?${data.queryString}`} variant="outline" size="sm"
                                    >Se detaljer</Button
                                >
                            </div>
                        </CardContent>
                    </Card>
                {/each}
            </div>
        {/if}
    </section>
</main>
