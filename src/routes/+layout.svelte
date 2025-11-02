<script lang="ts">
	import '../app.css';

	import { dev } from '$app/environment';
	import { getAsset } from '$lib/utils/assets-glob';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

	let { children } = $props();
	let ready = $state(false);

	useRegisterSW({
		onOfflineReady() {
			ready ||= true;
		},
		onRegistered(registration) {
			const state = registration?.active?.state;
			if (state === 'activated') ready ||= true;
		}
	});
</script>

{#if dev || ready}
	{@render children()}
{:else}
	<div
		class="loading size-screen"
		style="background: url('{getAsset('loading', 'avif')}') no-repeat center/cover;"
	></div>
{/if}
