<script lang="ts">
    import DecisionCard from '$lib/components/feed/DecisionCard.svelte';
    import { Card, CardContent } from '$lib/components/ui/card';
    import type { DecisionCardModel } from '$lib/decision-presentation';

    let { decisions }: { decisions: DecisionCardModel[] } = $props();

    interface DecisionGroup {
        date: string;
        formattedDate: string;
        items: DecisionCardModel[];
    }

    const dateFormatter = new Intl.DateTimeFormat('da-DK', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    function formatDecisionDate(rawDate: string): string {
        const parsedDate = new Date(rawDate);
        if (Number.isNaN(parsedDate.getTime())) {
            return rawDate;
        }
        return dateFormatter.format(parsedDate);
    }

    const decisionGroups = $derived.by(() => {
        const groups: DecisionGroup[] = [];
        const groupsByDate = new Map<string, DecisionGroup>();

        for (const decision of decisions) {
            let group = groupsByDate.get(decision.date);
            if (!group) {
                group = {
                    date: decision.date,
                    formattedDate: formatDecisionDate(decision.date),
                    items: []
                };
                groupsByDate.set(decision.date, group);
                groups.push(group);
            }
            group.items.push(decision);
        }

        return groups;
    });
</script>

<section class="space-y-4">
    <div class="flex items-center justify-between">
        <p class="text-sm text-muted-foreground">{decisions.length} beslutninger</p>
    </div>

    {#if decisions.length === 0}
        <Card>
            <CardContent class="py-10 text-center text-sm text-muted-foreground">
                Ingen beslutninger matcher det, du har valgt.
            </CardContent>
        </Card>
    {:else}
        <div class="space-y-6">
            {#each decisionGroups as group (group.date)}
                <section class="space-y-2">
                    <h2 class="text-sm font-semibold tracking-wide text-muted-foreground">
                        {group.formattedDate}
                    </h2>
                    <div class="flex flex-col gap-2">
                        {#each group.items as model (model.id)}
                            <DecisionCard {model} />
                        {/each}
                    </div>
                </section>
            {/each}
        </div>
    {/if}
</section>
