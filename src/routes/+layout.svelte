<script lang="ts">
	import '../app.css';

	import { dev } from '$app/environment';
	import { getAsset } from '$lib/utils/assets-glob';

	let { children } = $props();
	let ready = $state(false);

	if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
		function updateReadiness(this: ServiceWorker, payload: Event | true) {
			const isReady = this?.state === 'installed' || this?.state === 'activated';
			if (isReady || payload === true) {
				ready = true;
				this.removeEventListener('statechange', updateReadiness);
			}
		}

		navigator.serviceWorker.ready.then(function ({ active: sw }) {
			if (sw?.state === 'installing') sw.addEventListener('statechange', updateReadiness);
			else if (sw) updateReadiness.bind(sw)(true);
		});
	}
</script>

{#if dev || ready}
	{@render children()}
{:else}
	<div
		class="loading size-screen"
		style="background: url('{getAsset('loading', 'avif')}') no-repeat center/cover;"
	></div>
{/if}
