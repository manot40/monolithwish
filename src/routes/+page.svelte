<script lang="ts">
	// import { NavigationMenu } from 'bits-ui';
	// import gacha from '$lib/images/btn_icon_system_Gacha.png';
	import gacha_ten from '$lib/images/btn_gacha_ten.png';
	import RecruitCardDisc from '$lib/components/RecruitCardDisc.svelte';
	import RecruitCardTrekker from '$lib/components/RecruitCardTrekker.svelte';

	type Recruit = {
		type: 'trekker' | 'disc';
		rarity: number;
		assetID: number;
		name: string;
	};

	const PERMANENT_5_STARS_TREKKERS: Recruit[] = [
		{ type: 'trekker', rarity: 5, assetID: 11901, name: 'Nanoha' },
		{ type: 'trekker', rarity: 5, assetID: 12501, name: 'Freesia' },
		{ type: 'trekker', rarity: 5, assetID: 13201, name: 'Minova' },
		{ type: 'trekker', rarity: 5, assetID: 13501, name: 'Mystique' },
		{ type: 'trekker', rarity: 5, assetID: 14101, name: 'Chixia' },
		{ type: 'trekker', rarity: 5, assetID: 14901, name: 'Gerie' },
		{ type: 'trekker', rarity: 5, assetID: 15601, name: 'Nazuna' }
	];

	const PERMANENT_4_STARS_TREKKERS: Recruit[] = [
		{ type: 'trekker', rarity: 4, assetID: 10301, name: 'Amber' },
		{ type: 'trekker', rarity: 4, assetID: 10701, name: 'Tilia' },
		{ type: 'trekker', rarity: 4, assetID: 10801, name: 'Kasimira' },
		{ type: 'trekker', rarity: 4, assetID: 11101, name: 'Iris' },
		{ type: 'trekker', rarity: 4, assetID: 11201, name: 'Noya' },
		{ type: 'trekker', rarity: 4, assetID: 11301, name: 'Shimiao' },
		{ type: 'trekker', rarity: 4, assetID: 11601, name: 'Ridge' },
		{ type: 'trekker', rarity: 4, assetID: 11701, name: 'Jinglin' },
		{ type: 'trekker', rarity: 4, assetID: 11801, name: 'Coronis' },
		{ type: 'trekker', rarity: 4, assetID: 12001, name: 'Canace' },
		{ type: 'trekker', rarity: 4, assetID: 12301, name: 'Ann' },
		{ type: 'trekker', rarity: 4, assetID: 12601, name: 'Flora' },
		{ type: 'trekker', rarity: 4, assetID: 12701, name: 'Teresa' },
		{ type: 'trekker', rarity: 4, assetID: 14201, name: 'Cosette' },
		{ type: 'trekker', rarity: 4, assetID: 14701, name: 'Caramel' },
		{ type: 'trekker', rarity: 4, assetID: 15001, name: 'Laru' }
	];

	const PERMANENT_5_STARS_DISCS: Recruit[] = [
		{ type: 'disc', rarity: 5, assetID: 4005, name: 'Sunlit Blossom' },
		{ type: 'disc', rarity: 5, assetID: 4006, name: "Witch's Swing" },
		{ type: 'disc', rarity: 5, assetID: 4007, name: 'Midnight Mayhem' },
		{ type: 'disc', rarity: 5, assetID: 4027, name: 'Mystic Brushstrokes' },
		{ type: 'disc', rarity: 5, assetID: 4028, name: 'Daylight Garden' },
		{ type: 'disc', rarity: 5, assetID: 4036, name: 'The Lost Pilgrim' },
		{ type: 'disc', rarity: 5, assetID: 4037, name: 'Claw the Claw' }
	];

	const PERMANENT_4_STARS_DISCS: Recruit[] = [
		{ type: 'disc', rarity: 4, assetID: 3003, name: "Scorching Night's End" },
		{ type: 'disc', rarity: 4, assetID: 3004, name: 'Twin Moon Mischief' },
		{ type: 'disc', rarity: 4, assetID: 3005, name: '★ Bam Bam Girl ★' },
		{ type: 'disc', rarity: 4, assetID: 3006, name: 'Good Night' },
		{ type: 'disc', rarity: 4, assetID: 3007, name: 'Emerald Dream' },
		{ type: 'disc', rarity: 4, assetID: 3008, name: 'Tranquil Retreat' },
		{ type: 'disc', rarity: 4, assetID: 3009, name: 'Rainy Tune' },
		{ type: 'disc', rarity: 4, assetID: 3010, name: 'Steam Syndrome' },
		{ type: 'disc', rarity: 4, assetID: 3011, name: 'Meow Rhythm' },
		{ type: 'disc', rarity: 4, assetID: 3012, name: 'Starry Night Ode' },
		{ type: 'disc', rarity: 4, assetID: 3013, name: 'Leaf Her to Me' },
		{ type: 'disc', rarity: 4, assetID: 3014, name: "The Knight's Smith" },
		{ type: 'disc', rarity: 4, assetID: 3015, name: 'Unknown Fragrance' },
		{ type: 'disc', rarity: 4, assetID: 3016, name: 'Cage of Roses' },
		{ type: 'disc', rarity: 4, assetID: 3017, name: '★ Rolling Life ★' },
		{ type: 'disc', rarity: 4, assetID: 3018, name: 'Soda Shopping' },
		{ type: 'disc', rarity: 4, assetID: 3019, name: 'Delusion' },
		{ type: 'disc', rarity: 4, assetID: 3020, name: 'The Shining' }
	];

	const PERMANENT_3_STARS_DISCS: Recruit[] = [
		{ type: 'disc', rarity: 3, assetID: 1001, name: 'Crisp Morning' },
		{ type: 'disc', rarity: 3, assetID: 1002, name: 'Sunny Breeze' },
		{ type: 'disc', rarity: 3, assetID: 1003, name: 'Indigo Sunset' },
		{ type: 'disc', rarity: 3, assetID: 1004, name: 'Pink Dream' },
		{ type: 'disc', rarity: 3, assetID: 1005, name: 'Lonely Dunes' },
		{ type: 'disc', rarity: 3, assetID: 1006, name: 'Sweet Creek' },
		{ type: 'disc', rarity: 3, assetID: 1007, name: 'Starlit Hope' },
		{ type: 'disc', rarity: 3, assetID: 1008, name: 'Homeward Path' },
		{ type: 'disc', rarity: 3, assetID: 2001, name: 'Grand Feast' },
		{ type: 'disc', rarity: 3, assetID: 2002, name: 'Whoopla' },
		{ type: 'disc', rarity: 3, assetID: 2003, name: 'Elysium' },
		{ type: 'disc', rarity: 3, assetID: 2005, name: 'Flare Frenzy' },
		{ type: 'disc', rarity: 3, assetID: 2006, name: 'Auspicious Glow' },
		{ type: 'disc', rarity: 3, assetID: 2007, name: 'Brave the Wind' },
		{ type: 'disc', rarity: 3, assetID: 2008, name: 'Bubbles' },
		{ type: 'disc', rarity: 3, assetID: 2009, name: 'Eclipse' },
		{ type: 'disc', rarity: 3, assetID: 2010, name: 'Fortitude' }
	];

	// eslint-disable-next-line
	const TIDE_TO_THE_FULL_MOON_RATE_UP: Recruit[] = [
		{ type: 'trekker', rarity: 5, assetID: 15501, name: 'Shia' },
		{ type: 'trekker', rarity: 4, assetID: 10701, name: 'Tilia' },
		{ type: 'trekker', rarity: 4, assetID: 10801, name: 'Kasimira' }
	];

	// eslint-disable-next-line
	const BLADES_BENEATH_THE_MOON_RATE_UP: Recruit[] = [
		{ type: 'trekker', rarity: 5, assetID: 14401, name: 'Chitose' },
		{ type: 'trekker', rarity: 4, assetID: 11701, name: 'Jinglin' },
		{ type: 'trekker', rarity: 4, assetID: 12701, name: 'Teresa' }
	];

	// eslint-disable-next-line
	const OCEAN_MEETS_THE_SKY_RATE_UP: Recruit[] = [
		{ type: 'disc', rarity: 5, assetID: 4038, name: 'Ripples of Nostalgia' },
		{ type: 'disc', rarity: 4, assetID: 3004, name: 'Twin Moon Mischief' },
		{ type: 'disc', rarity: 4, assetID: 3006, name: 'Good Night' }
	];

	// eslint-disable-next-line
	const MOON_UPON_STILL_WATERS_RATE_UP: Recruit[] = [
		{ type: 'disc', rarity: 5, assetID: 4026, name: 'Sword Against Stream' },
		{ type: 'disc', rarity: 4, assetID: 3005, name: '★ Bam Bam Girl ★' },
		{ type: 'disc', rarity: 4, assetID: 3009, name: 'Rainy Tune' }
	];

	const RATE_UP_5_STARS_TREKKERS: Recruit[] = [
		{ type: 'trekker', rarity: 5, assetID: 15501, name: 'Shia' }
	];
	const RATE_UP_4_STARS_TREKKERS: Recruit[] = [
		{ type: 'trekker', rarity: 4, assetID: 10701, name: 'Tilia' },
		{ type: 'trekker', rarity: 4, assetID: 10801, name: 'Kasimira' }
	];
	const RATE_UP_5_STARS_DISCS: Recruit[] = [];
	const RATE_UP_4_STARS_DISCS: Recruit[] = [];

	const FLOATING_POINT_ADJUSTMENT = 1e12;

	let activeBannerType: 'trekker' | 'disc' = $state('trekker');
	let trekkerTotalRecruits = $state(0); // eslint-disable-line
	let trekkerPityCounter = $state(0);
	let discPityCounter = $state(0);
	let trekkerRecruitsSinceLast4StarOrBetter = $state(0);
	let discRecruitsSinceLast4StarOrBetter = $state(0);
	let trekkerRecruitHistory: Recruit[] = $state([]);

	function roll5StarTrekker() {
		const seed = Math.random() * FLOATING_POINT_ADJUSTMENT;
		const result =
			seed < 0.5 * FLOATING_POINT_ADJUSTMENT || trekkerPityCounter === 159
				? RATE_UP_5_STARS_TREKKERS[Math.floor(Math.random() * RATE_UP_5_STARS_TREKKERS.length)]
				: PERMANENT_5_STARS_TREKKERS[Math.floor(Math.random() * PERMANENT_5_STARS_TREKKERS.length)];

		trekkerTotalRecruits++;
		if (result.name === 'Shia') {
			trekkerPityCounter = 0;
		} else {
			trekkerPityCounter += 1;
		}
		trekkerRecruitsSinceLast4StarOrBetter = 0;

		return result;
	}

	function roll4StarTrekker() {
		const OFF_RATE_4_STARS_TREKKERS = PERMANENT_4_STARS_TREKKERS.filter(
			(trekker) => !RATE_UP_4_STARS_TREKKERS.includes(trekker)
		);
		const seed = Math.random() * FLOATING_POINT_ADJUSTMENT;
		const result =
			seed < 0.5 * FLOATING_POINT_ADJUSTMENT
				? RATE_UP_4_STARS_TREKKERS[Math.floor(Math.random() * RATE_UP_4_STARS_TREKKERS.length)]
				: OFF_RATE_4_STARS_TREKKERS[Math.floor(Math.random() * OFF_RATE_4_STARS_TREKKERS.length)];

		trekkerTotalRecruits++;
		trekkerPityCounter += 1;
		trekkerRecruitsSinceLast4StarOrBetter = 0;

		return result;
	}

	function roll5StarDisc() {
		const OFF_RATE_5_STARS_DISCS = PERMANENT_5_STARS_DISCS.filter(
			(disc) => !RATE_UP_5_STARS_DISCS.includes(disc)
		);
		const seed = Math.random() * FLOATING_POINT_ADJUSTMENT;
		const result =
			seed < 0.75 * FLOATING_POINT_ADJUSTMENT
				? RATE_UP_5_STARS_DISCS[Math.floor(Math.random() * RATE_UP_5_STARS_DISCS.length)]
				: OFF_RATE_5_STARS_DISCS[Math.floor(Math.random() * OFF_RATE_5_STARS_DISCS.length)];

		discPityCounter = 0;
		discRecruitsSinceLast4StarOrBetter = 0;

		return result;
	}

	function roll4StarDisc() {
		const OFF_RATE_4_STARS_DISCS = PERMANENT_4_STARS_DISCS.filter(
			(disc) => !RATE_UP_4_STARS_DISCS.includes(disc)
		);
		const seed = Math.random() * FLOATING_POINT_ADJUSTMENT;
		let result;

		switch (activeBannerType) {
			case 'trekker':
				result =
					PERMANENT_4_STARS_DISCS[Math.floor(Math.random() * PERMANENT_4_STARS_DISCS.length)];

				trekkerTotalRecruits++;
				trekkerPityCounter += 1;
				trekkerRecruitsSinceLast4StarOrBetter = 0;
				break;
			case 'disc':
				result =
					seed < 0.5 * FLOATING_POINT_ADJUSTMENT
						? RATE_UP_4_STARS_DISCS[Math.floor(Math.random() * RATE_UP_4_STARS_DISCS.length)]
						: OFF_RATE_4_STARS_DISCS[Math.floor(Math.random() * OFF_RATE_4_STARS_DISCS.length)];

				discPityCounter++;
				discRecruitsSinceLast4StarOrBetter = 0;
				break;
		}

		return result;
	}

	function roll3StarDisc() {
		const result =
			PERMANENT_3_STARS_DISCS[Math.floor(Math.random() * PERMANENT_3_STARS_DISCS.length)];

		switch (activeBannerType) {
			case 'trekker':
				trekkerTotalRecruits++;
				trekkerPityCounter += 1;
				trekkerRecruitsSinceLast4StarOrBetter++;
				break;
			case 'disc':
				discPityCounter++;
				discRecruitsSinceLast4StarOrBetter++;
				break;
		}

		return result;
	}

	function recruitTrekkerBanner() {
		const seed = Math.random() * FLOATING_POINT_ADJUSTMENT;

		if (seed < 0.02 * FLOATING_POINT_ADJUSTMENT || trekkerPityCounter === 159) {
			return roll5StarTrekker();
		} else if (
			seed < 0.1 * FLOATING_POINT_ADJUSTMENT ||
			trekkerRecruitsSinceLast4StarOrBetter === 9
		) {
			const seedFor4Star = Math.random() * FLOATING_POINT_ADJUSTMENT;

			if (seedFor4Star < 0.5 * FLOATING_POINT_ADJUSTMENT) {
				return roll4StarTrekker();
			} else {
				return roll4StarDisc();
			}
		} else {
			return roll3StarDisc();
		}
	}

	function recruitDiscBanner() {
		const seed = Math.random() * FLOATING_POINT_ADJUSTMENT;

		if (seed < 0.02 * FLOATING_POINT_ADJUSTMENT || discPityCounter === 119) {
			return roll5StarDisc();
		} else if (seed < 0.1 * FLOATING_POINT_ADJUSTMENT || discRecruitsSinceLast4StarOrBetter === 9) {
			return roll4StarDisc();
		} else {
			return roll3StarDisc();
		}
	}

	function recruit() {
		switch (activeBannerType) {
			case 'trekker':
				return recruitTrekkerBanner();
			case 'disc':
				return recruitDiscBanner();
		}
	}

	function recruit10() {
		trekkerRecruitHistory.length = 0;
		for (let i = 0; i < 10; i++) {
			trekkerRecruitHistory.push(recruit());
		}
	}
</script>

<svelte:head>
	<title>Monolith Wish | Home</title>
</svelte:head>

<!-- <NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Link href="/"><img src={gacha} alt="Home logo" /></NavigationMenu.Link>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root> -->

<!-- <button onclick={recruit}>Recruit</button> -->

<!-- <p>{trekkerPityCounter}</p> -->
<section class="result">
	{#each trekkerRecruitHistory as { type, rarity, assetID }, i (i + assetID.toString())}
		{#if type === 'trekker'}
			<RecruitCardTrekker {rarity} {assetID} />
		{:else}
			<RecruitCardDisc {rarity} {assetID} />
		{/if}
	{/each}
</section>
<button onclick={recruit10}
	><img src={gacha_ten} alt="" />
	<div>Recruit x10</div></button
>

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
</style>
