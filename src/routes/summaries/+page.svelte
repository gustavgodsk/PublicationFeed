<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<main class="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
	<section class="space-y-4">
		<h1 class="text-3xl font-bold tracking-tight">Meeting Summaries</h1>
		<p class="text-muted-foreground text-sm leading-6 md:text-base">
			Open original PDF summaries from city council meetings.
		</p>
	</section>

	<section class="mt-6 grid gap-4 md:grid-cols-2">
		{#each data.summaries as fileName}
			<Card>
				<CardHeader>
					<CardTitle class="text-base break-all">{fileName}</CardTitle>
				</CardHeader>
				<CardContent class="flex justify-end">
					<Button href={`/summaries/${fileName}`} target="_blank" rel="noreferrer" variant="outline" size="sm"
						>Open PDF</Button
					>
				</CardContent>
			</Card>
		{/each}
	</section>
</main>
