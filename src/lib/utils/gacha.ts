import type {
	BannerData,
	Featured,
	Recruit,
	RecruitHistory,
	RecruitWithRate
} from '$lib/types/common';

import lowRarity from '$lib/data/gacha-pools/low_rarity.json' with { type: 'json' };
import permaDisc from '$lib/data/gacha-pools/disc.json' with { type: 'json' };
import permaTrekker from '$lib/data/gacha-pools/trekker.json' with { type: 'json' };

export class Banner {
	static readonly BASE_SR_CHANCE = 0.08;
	static readonly BASE_SSR_CHANCE = 0.02;
	static readonly SSR_PITY_THRESHOLD = 120;

	readonly pool: RecruitWithRate[];
	private readonly srPool: RecruitWithRate[];
	private readonly ssrPool: RecruitWithRate[];
	private featuredSSR: RecruitWithRate | null = null;

	public history = [] as RecruitHistory[];
	public pityCount = 0;

	constructor(public config: BannerData) {
		const isDisc = config.type === 'disc';
		const permaPool = <Recruit[]>(isDisc ? permaDisc.items : permaTrekker.items);

		const lrPool = lowRarity.items as Recruit[];
		const [ssrPool, srPool] = permaPool.reduce<[Recruit[], Recruit[]]>(
			(acc, item) => {
				if (config.featured) {
					if (item.rarity === 4) {
						const isSkip = config.featured.sr.some((sr) => toRecruit(sr).assetID === item.assetID);
						if (isSkip) return acc;
					} else if (item.rarity === 5) {
						const isSkip = toRecruit(config.featured.ssr).assetID == item.assetID;
						if (isSkip) return acc;
					}
				}

				const [ssr, sr] = acc;
				if (item.rarity === 5) ssr.push(item);
				else sr.push(item);
				return acc;
			},
			[[], []]
		);

		this.pool = [];
		this.srPool = [];
		this.ssrPool = [];
		let cumSRChance = Banner.BASE_SR_CHANCE;
		let cumSSRChance = Banner.BASE_SSR_CHANCE;

		function toRecruit(item: Featured): Recruit {
			if (typeof item != 'number') return item;
			const id = item;
			const recruit = permaPool.find((item) => item.assetID === id);
			if (!recruit) throw new Error(`Recruit not found for ID: ${item}`);
			return recruit;
		}

		if (config.featured) {
			const srChance = Banner.BASE_SR_CHANCE * 0.5;
			cumSRChance -= srChance;
			const ssrChance = Banner.BASE_SSR_CHANCE * (isDisc ? 0.75 : 0.5);
			cumSSRChance -= ssrChance;

			this.featuredSSR = { rate: ssrChance, ...toRecruit(config.featured.ssr) };
			this.pool.push(this.featuredSSR);
			config.featured.sr.forEach((item, _, sr) =>
				this.pool.push({ rate: srChance / sr.length, ...toRecruit(item) })
			);
		}

		srPool.forEach((item) => {
			const recruit = { rate: cumSRChance / srPool.length, ...item };
			this.pool.push(recruit);
			this.srPool.push(recruit);
		});

		ssrPool.forEach((item) => {
			const recruit = { rate: cumSSRChance / ssrPool.length, ...item };
			this.pool.push(recruit);
			this.ssrPool.push(recruit);
		});

		const restChance = 1 - Banner.BASE_SR_CHANCE - Banner.BASE_SSR_CHANCE;
		if (restChance <= 0) throw new Error('Invalid chance distribution');

		lrPool.forEach((item) => this.pool.push({ rate: restChance / lrPool.length, ...item }));
	}

	private get SRPityHit() {
		if (this.history.length < 9) return false;
		return this.history.slice(-9).every((item) => item.rarity === 3);
	}

	roll(): RecruitHistory {
		const toRecruit = (item: RecruitWithRate, isPity = false): RecruitHistory => {
			// eslint-disable-next-line
			const { rate: _, ...recruit } = item;
			const data = { ...recruit, isPity, time: Date.now() };

			this.history.push(data);
			if (recruit.rarity !== 5) this.pityCount++;
			else if (!this.featuredSSR || this.featuredSSR.assetID === recruit.assetID)
				this.pityCount = 0;

			return data;
		};

		if (this.pityCount === Banner.SSR_PITY_THRESHOLD) {
			console.info('SSR Pity Hit');
			this.pityCount = 0;
			return toRecruit(this.featuredSSR || getRandom(this.ssrPool), true);
		}

		if (this.SRPityHit) {
			console.info('SR Pity Hit');
			return toRecruit(getRandom(this.srPool), true);
		}

		const [randomInt] = crypto.getRandomValues(new Uint32Array(1));
		const roll = randomInt / (0xffffffff + 1);

		let cumulativeChance = 0;
		for (const item of this.pool) {
			cumulativeChance += item.rate;
			if (roll < cumulativeChance) return toRecruit(item);
		}

		const item = this.pool.at(-1);
		if (item) return toRecruit(item);

		throw new Error('No recruit found');
	}

	rollMulti(): RecruitHistory[] {
		return Array(10)
			.fill(null)
			.map(() => this.roll());
	}
}

function getRandom<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}
