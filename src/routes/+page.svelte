<script lang="ts">
	import type { RecruitHistory } from '$lib/types/common';
	import type { UserAction } from '$lib/types/svelte';

	import gacha_ten from '$lib/images/btn_gacha_ten.png';
	import RecruitCard from '$lib/components/RecruitCard.svelte';

	import { Banner } from '$lib/utils/gacha';
	import { getVideo } from '$lib/utils/assets-glob';

	const banners = {
		shia: new Banner({
			type: 'trekker',
			name: 'Tide to The Full Moon',
			featured: {
				sr: [10701, 10801],
				ssr: { type: 'trekker', rarity: 5, assetID: 15501, name: 'Shia' }
			}
		}),
		shiaDisc: new Banner({
			type: 'disc',
			name: 'Ocean Meets The Sky',
			featured: {
				sr: [3004, 3006],
				ssr: { type: 'disc', rarity: 5, assetID: 4038, name: 'Ripples of Nostalgia' }
			}
		}),
		chitose: new Banner({
			type: 'trekker',
			name: 'Tide to The Full Moon',
			featured: {
				sr: [11701, 12701],
				ssr: { type: 'trekker', rarity: 5, assetID: 14401, name: 'Chitose' }
			}
		}),
		chitoseDisc: new Banner({
			type: 'disc',
			name: 'Moon Upon Still Waters',
			featured: {
				sr: [3005, 3009],
				ssr: { type: 'disc', rarity: 5, assetID: 4026, name: 'Sword Against Stream' }
			}
		}),
		trekker: new Banner({
			type: 'trekker',
			name: "Boss's Regulars"
		}),
		disc: new Banner({
			type: 'disc',
			name: 'Memories Rewind'
		})
	};

	let video = $state<string>();
	let activeBanner = $state<Banner>(banners.shia);
	let recruitWindow: RecruitHistory[] = $state([]);

	const hasSR = $derived(!!recruitWindow?.some((r) => r.rarity === 4));
	const hasSSR = $derived(!!recruitWindow?.some((r) => r.rarity === 5));
	const hasPity = $derived(!!recruitWindow?.some((r) => r.rarity === 5 && r.isPity));
	const bannerType = $derived(activeBanner.config.type);

	function rollMulti() {
		recruitWindow = activeBanner.rollMulti();
		if (bannerType === 'trekker')
			video = getVideo(hasSSR ? 'trekker_initial_1_ssr' : 'trekker_initial_1');
		else video = getVideo(`disc_10_${hasSSR ? 'ssr_1' : 'sr'}`);
	}

	function handleVideoTransition(e: UserAction<MouseEvent | Event, HTMLVideoElement>) {
		const timeout = e instanceof MouseEvent ? 0 : 450;
		if (bannerType !== 'trekker') {
			setTimeout(() => (video = undefined), timeout);
		} else if (video?.includes('initial_1')) {
			video = getVideo('trekker_initial_2');
			e.currentTarget.load();
		} else if (video?.includes('initial_2')) {
			video = getVideo('trekker_loop');
			e.currentTarget.load();
		} else if (video?.includes('loop')) {
			if (e instanceof MouseEvent) {
				if (hasSSR) video = getVideo(`trekker_result_ssr_${hasPity ? 2 : 1}`);
				else video = getVideo(hasSR ? 'trekker_result_sr' : 'trekker_result');
				e.currentTarget.load();
			}
		} else {
			setTimeout(() => (video = undefined), timeout);
		}
	}
</script>

<svelte:head>
	<title>Monolith Wish | Home</title>
</svelte:head>

{#if video}
	<div class="vid-container">
		<!-- svelte-ignore a11y_media_has_caption -->
		<video
			autoplay
			class="video"
			loop={video.includes('loop')}
			controls={false}
			onclick={handleVideoTransition}
			onended={handleVideoTransition}
		>
			<source src={video} type="video/mp4" />
		</video>
	</div>
{:else}
	<section class="result">
		{#each recruitWindow as { type, rarity, assetID }, i (i + assetID.toString())}
			<RecruitCard {type} {rarity} {assetID} />
		{/each}
	</section>

	<button onclick={rollMulti}>
		<img src={gacha_ten} alt="" />
		<div>Recruit x10</div>
	</button>
{/if}

<style>
	button {
		position: absolute;
		display: grid;
		grid-template-columns: 1fr;
		bottom: 1vw;
		right: 1vw;
		max-width: 15vw;
	}

	button img {
		grid-area: 1 / 1;
	}

	button div {
		color: white;
		grid-area: 1 /1;
		font-size: 1.5cqi;
		margin: 0.75em auto;
	}

	.result {
		padding: 5%;
		height: 100%;
		max-width: 1920px;
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		align-items: center;
		gap: 0.5em;
	}

	.vid-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100dvw;
		height: 100dvh;
		overflow: hidden;
		z-index: 1;
	}

	.vid-container video {
		min-width: 100%;
		min-height: 100%;
		width: auto;
		height: auto;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		object-fit: cover;
	}
</style>
