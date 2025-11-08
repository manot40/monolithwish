<script lang="ts">
	import type { RecruitHistory } from '$lib/types/common';
	import type { UserAction } from '$lib/types/svelte';

	import RecruitCard from '$lib/components/RecruitCard.svelte';
	import MultiPullBtn from '$lib/assets/images/btn_gacha_ten.png';

	import { banners, type Banner } from '$lib/data/banners';
	import { getAsset, getVideo } from '$lib/utils/assets-glob';

	let video = $state<string>();
	let gachaResult = $state.raw<RecruitHistory[]>();
	let activeBanner = $state.raw<Banner>(banners.shia);

	const loop = $derived(video?.includes('loop'));
	const bgImage = $derived.by(() => {
		if (video) return getAsset('trekker_loop', 'avif');
		return getAsset((!gachaResult && activeBanner.config.cover) || 'bg_gacha_result', 'avif');
	});
	const isRecruit = $derived.by(() => {
		const result = {} as Record<'hasSR' | 'hasSSR' | 'onlySSR', boolean>;
		if (!gachaResult) return result;

		let five = 0,
			four = 0;
		gachaResult.forEach((r) => {
			if (r.rarity === 5) {
				five++;
				result.hasSSR = true;
			} else if (r.rarity === 4) {
				four++;
				result.hasSR = true;
			}
		});

		result.onlySSR = five > 0 && four === 0;
		return result;
	});
	const bannerType = $derived(activeBanner.config.type);

	function rollMulti() {
		gachaResult = activeBanner.rollMulti();
		if (bannerType === 'trekker')
			video = getVideo(isRecruit.hasSSR ? 'trekker_initial_1_ssr' : 'trekker_initial_1');
		else video = getVideo(`disc_10_${isRecruit.hasSSR ? 'ssr_1' : 'sr'}`);
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
				if (isRecruit.hasSSR) video = getVideo(`trekker_result_ssr_${isRecruit.onlySSR ? 2 : 1}`);
				else video = getVideo(isRecruit.hasSR ? 'trekker_result_sr' : 'trekker_result');
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

<main style="background-image: url('{bgImage}');">
	{#if video}
		<div class="vid-container size-screen">
			<!-- svelte-ignore a11y_media_has_caption -->
			<video
				{loop}
				autoplay
				class="video"
				controls={false}
				onclick={handleVideoTransition}
				onended={handleVideoTransition}
			>
				<source src={video} type="video/mp4" />
			</video>
		</div>
	{:else}
		{#if gachaResult}
			<section class="results">
				{#each gachaResult as result, i (i + result.id.toString())}
					<RecruitCard {...result} />
				{/each}
			</section>
		{/if}
		<button onclick={rollMulti}>
			<img src={MultiPullBtn} alt="" />
			<div>Recruit x10</div>
		</button>
	{/if}
</main>

<style>
	main {
		height: 100dvh;
		overflow: hidden;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
	}

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

	.results {
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
