import { get, type Writable } from 'svelte/store';
import type {
	BannerData,
	Featured,
	Recruit,
	RecruitHistory,
	RecruitWithRate
} from '$lib/types/common';

import { browser } from '$app/environment';
import { RecruitTypeEnum } from '$lib/types/common';

import lowRarity from '$lib/data/gacha-pools/low_rarity.json' with { type: 'json' };
import permaDisc from '$lib/data/gacha-pools/disc.json' with { type: 'json' };
import permaTrekker from '$lib/data/gacha-pools/trekker.json' with { type: 'json' };

import { getRandomValue, handleSRPityHit, persistHistory, pull } from './helper';

export class Banner {
	static readonly BASE_SR_CHANCE = 0.08;
	static readonly BASE_SSR_CHANCE = 0.02;
	static readonly SSR_PITY_THRESHOLD = 120;

	readonly pool: RecruitWithRate[];
	private readonly srPool: RecruitWithRate[];
	private readonly ssrPool: RecruitWithRate[];

	private featuredSSR: RecruitWithRate | null = null;
	private pityCounter: Writable<number>;

	public config: Omit<BannerData, 'pityCounter'>;

	public get historyKey() {
		const { featured, type } = this.config;
		return `${featured ? 'limited-' : ''}${type}-history` as const;
	}

	private _history: RecruitHistory[] = [];
	public get history(): RecruitHistory[] {
		return this._history;
	}
	public set history(value: RecruitHistory[]) {
		if (!browser) return;
		this._history = value;
		persistHistory(this.historyKey, value);
	}

	constructor(config: BannerData) {
		const { pityCounter, ...config_ } = config;

		this.config = config_;
		this.pityCounter = pityCounter;

		const isDisc = config_.type === 'disc';
		const permaPool = <Recruit[]>(isDisc ? permaDisc.items : permaTrekker.items);

		const lrPool = lowRarity.items as Recruit[];
		const [ssrPool, srPool] = permaPool.reduce<[Recruit[], Recruit[]]>(
			(acc, item) => {
				if (config_.featured) {
					const flagFeatured = (target: Featured) => {
						const feat = toRecruit(target);
						if (feat.assetID === item.assetID) item.isFeatured = true;
					};

					if (item.rarity === 4) config_.featured.sr.forEach(flagFeatured);
					else if (item.rarity === 5) flagFeatured(config_.featured.ssr);
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

		if (config_.featured) {
			const srChance = Banner.BASE_SR_CHANCE * 0.5;
			cumSRChance -= srChance;
			const ssrChance = Banner.BASE_SSR_CHANCE * (isDisc ? 0.75 : 0.5);
			cumSSRChance -= ssrChance;

			const ssr = (this.featuredSSR = { rate: ssrChance, ...toRecruit(config_.featured.ssr) });
			this.pool.push(ssr);
			this.ssrPool.push(ssr);

			config_.featured.sr.forEach((item, _, sr) => {
				const recruit = { rate: srChance / sr.length, ...toRecruit(item) };
				this.pool.push(recruit);
				this.srPool.push(recruit);
			});
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

		const lrChance = 1 - Banner.BASE_SR_CHANCE - Banner.BASE_SSR_CHANCE;
		if (lrChance <= 0) throw new Error('Invalid chance distribution');
		lrPool.forEach((item) => this.pool.push({ rate: lrChance / lrPool.length, ...item }));

		if (browser) {
			const fromStorage = localStorage.getItem(this.historyKey)?.trim();
			if (fromStorage && /^\[.*\]$/.test(fromStorage)) this._history = JSON.parse(fromStorage);
		}
	}

	private get SRPityHit() {
		const lastNine = this.history.slice(-9);
		if (lastNine.length < 9) return false;
		return lastNine.every((item) => item.rarity === 3);
	}

	private get SSRPityHit() {
		return get(this.pityCounter) === Banner.SSR_PITY_THRESHOLD;
	}

	private toRecruitHistory(item: RecruitWithRate, isPity = false): RecruitHistory {
		// eslint-disable-next-line
		const { rate: _1, name: _2, type, ...recruit } = item;
		const data = { ...recruit, isPity, time: Date.now(), type: RecruitTypeEnum[type] };
		const isEarlyLuck = recruit.rarity === 5 && (!this.featuredSSR || recruit.isFeatured);

		if (isEarlyLuck) this.pityCounter.set(0);
		else this.pityCounter.set(get(this.pityCounter) + 1);

		this.history = [...this.history, data];
		return data;
	}

	roll(): RecruitHistory {
		if (this.SSRPityHit) {
			this.pityCounter.set(0);
			console.info('SSR Pity Hit!');
			return this.toRecruitHistory(this.featuredSSR ?? getRandomValue(this.ssrPool), true);
		} else if (this.SRPityHit) {
			const result = handleSRPityHit(this.srPool, this.ssrPool, Banner.BASE_SSR_CHANCE);
			console.info('SR Pity Hit!', result.name);

			if (result.rarity === 5) this.pityCounter.set(0);
			return this.toRecruitHistory(result, true);
		}

		const pulled = pull(this.pool);

		if (!pulled) throw new Error('No recruit found');
		return this.toRecruitHistory(pulled);
	}

	rollMulti(): RecruitHistory[] {
		return Array(10)
			.fill(null)
			.map(() => this.roll());
	}
}
