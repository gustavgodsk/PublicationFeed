<script lang="ts">
    import decisions from '$lib/data/mock_decisions.json';
    // let { decisions } = $props();

    $effect(() => console.log(decisions));
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#each decisions as decision, i}
    <p>{i + 1}: {decision.title}</p>
{/each}
