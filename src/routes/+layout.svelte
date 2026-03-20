<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import { ModeWatcher } from 'mode-watcher';
    import { page } from '$app/state';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import { Button } from '$lib/components/ui/button';

    let { children } = $props();

    const tabs = [
        { name: 'Feed', href: '/' },
        { name: 'Summaries', href: '/summaries' },
        { name: 'About', href: '/about' }
    ];

    function isActive(href: string): boolean {
        const pathname = page.url.pathname;
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    }
</script>

<ModeWatcher />

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="from-background via-background to-muted/30 min-h-screen bg-gradient-to-b">
    <header class="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
        <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
            <a href="/" class="flex items-center gap-2">
                <div class="bg-primary text-primary-foreground grid size-8 place-content-center rounded-md text-xs font-bold">
                    POC
                </div>
                <div>
                    <p class="text-sm font-semibold">Civic Decisions</p>
                    <p class="text-muted-foreground text-xs">SvelteKit + shadcn-svelte</p>
                </div>
            </a>

            <nav class="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
                {#each tabs as tab}
                    <Button href={tab.href} variant={isActive(tab.href) ? 'secondary' : 'ghost'} size="sm">
                        {tab.name}
                    </Button>
                {/each}
            </nav>

            <div class="flex items-center gap-2">
                <ThemeToggle />
            </div>
        </div>

        <nav class="mx-auto flex w-full max-w-6xl gap-2 px-4 pb-3 md:hidden" aria-label="Mobile navigation">
            {#each tabs as tab}
                <Button href={tab.href} variant={isActive(tab.href) ? 'secondary' : 'ghost'} size="xs" class="flex-1">
                    {tab.name}
                </Button>
            {/each}
        </nav>
    </header>

    {@render children()}

    <footer class="border-t">
        <div class="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm md:flex-row md:items-center md:justify-between md:px-6">
            <p>Civic Decisions POC</p>
            <p>Data source: mock dataset and city council meeting summaries</p>
        </div>
    </footer>
</div>
