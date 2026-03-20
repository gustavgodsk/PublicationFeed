<script lang="ts">
	import DecisionDetailsPanel from '$lib/components/decision/DecisionDetailsPanel.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const backHref = $derived(data.backQueryString ? `/?${data.backQueryString}` : '/');
</script>

<main class="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:px-6">
	<div class="flex items-center justify-between">
		<Button href={backHref} variant="outline" size="sm">Tilbage til feed</Button>
		<Badge variant="outline">{data.decision.id}</Badge>
	</div>

	<DecisionDetailsPanel decision={data.decision} />
</main>
