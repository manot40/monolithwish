import { get, type Writable } from 'svelte/store';
import type {
	BannerData,
	Featured,
	Recruit,
	RecruitHistory,
	RecruitWithRate
} from '$lib/types/common';

import { browser } from '$app/environment';

import lowRarity from '$lib/data/gacha-pools/low_rarity.json' with { type: 'json' };
import permaDisc from '$lib/data/gacha-pools/disc.json' with { type: 'json' };
import permaTrekker from '$lib/data/gacha-pools/trekker.json' with { type: 'json' };

import { destr } from 'destr';
import { getRandomValue, handleSRPityHit, persistHistory, pull } from './helper';

export class Banner {
	static readonly BASE_SR_CHANCE = 0.08;
	static readonly BASE_SSR_CHANCE = 0.02;
	static readonly SSR_PITY_THRESHOLD = 120;

	private readonly pool: RecruitWithRate[];
	private readonly srPool: RecruitWithRate[];
	private readonly ssrPool: RecruitWithRate[];

	private pityCounter = 0;
	private counterStore: Writable<number>;
	private featuredSSR: RecruitWithRate | null = null;

	public config: Omit<BannerData, 'pityCounter' | 'featured'>;

	public get historyKey() {
		const { type } = this.config;
		return `${this.featuredSSR ? 'limited-' : ''}${type}-history` as const;
	}

	#history: RecruitHistory[] = [];
	get history(): RecruitHistory[] {
		return this.#history;
	}
	set history(value: RecruitHistory[]) {
		if (!browser) return;
		this.#history = value;
		persistHistory(this.historyKey, value);
	}

	constructor(config: BannerData) {
		const { pityCounter, featured, ...cfg } = config;

		this.config = cfg;
		(this.counterStore = pityCounter).subscribe((value) => {
			this.pityCounter = value;
		});

		const isDisc = cfg.type === 'disc';
		const permaPool = <Recruit[]>(isDisc ? permaDisc.items : permaTrekker.items);

		const lrPool = lowRarity.items as Recruit[];
		const [ssrPool, srPool] = permaPool.reduce<[Recruit[], Recruit[]]>(
			(acc, item) => {
				if (featured) {
					const flagFeatured = (target: Featured) => {
						const feat = toRecruit(target);
						if (feat.id === item.id) item.isFeatured = true;
					};

					if (item.rarity === 4) featured.sr.forEach(flagFeatured);
					else if (item.rarity === 5) flagFeatured(featured.ssr);
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
			if (typeof item != 'number') {
				item.isFeatured = true;
				return item;
			} else {
				const id = item;
				const recruit = permaPool.find((item) => item.id === id);

				if (!recruit) throw new Error(`Recruit not found for ID: ${item}`);

				recruit.isFeatured = true;
				return recruit;
			}
		}

		if (featured) {
			const srChance = Banner.BASE_SR_CHANCE * 0.5;
			cumSRChance -= srChance;
			const ssrChance = Banner.BASE_SSR_CHANCE * (isDisc ? 0.75 : 0.5);
			cumSSRChance -= ssrChance;

			const ssr = (this.featuredSSR = { rate: ssrChance, ...toRecruit(featured.ssr) });
			this.pool.push(ssr);
			this.ssrPool.push(ssr);

			featured.sr.forEach((item, _, sr) => {
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
			if (fromStorage && /^\[.*\]$/.test(fromStorage)) {
				const history = (this.history = destr<RecruitHistory[]>(fromStorage) ?? []);
				const checkRange = history.slice(-Banner.SSR_PITY_THRESHOLD).reverse();
				const pityIdx = checkRange.findIndex((item) => {
					if (featured) return item.id === toRecruit(featured.ssr).id;
					else return item.rarity === 5;
				});

				if (pityIdx !== -1) this.counterStore.set(pityIdx);
			}
		}
	}

	private get SRPityHit() {
		const lastNine = this.history.slice(-9);
		if (lastNine.length < 9) return false;
		return lastNine.every((item) => item.rarity === 3);
	}

	private get SSRPityHit() {
		return this.pityCounter === Banner.SSR_PITY_THRESHOLD;
	}

	private toRecruitHistory(item: RecruitWithRate, isPity = false): RecruitHistory {
		// eslint-disable-next-line
		const { rate: _1, name: _2, isFeatured, ...recruit } = item;
		const isEarlyLuck = recruit.rarity === 5 && (!this.featuredSSR || isFeatured);

		if (isEarlyLuck) this.counterStore.set(0);
		else this.counterStore.set(this.pityCounter + 1);

		const data = { ...recruit, time: Date.now(), isPity: isPity || undefined };
		this.history = [...this.history, data];
		return data;
	}

	roll(): RecruitHistory {
		if (this.SSRPityHit) {
			this.counterStore.set(0);
			console.info('SSR Pity Hit!');
			return this.toRecruitHistory(this.featuredSSR ?? getRandomValue(this.ssrPool), true);
		} else if (this.SRPityHit) {
			const result = handleSRPityHit(this.srPool, this.ssrPool, Banner.BASE_SSR_CHANCE);
			console.info('SR Pity Hit!', result.name);

			if (result.rarity === 5) this.counterStore.set(0);
			return this.toRecruitHistory(result, true);
		}

		return this.toRecruitHistory(pull(this.pool));
	}

	rollMulti(): RecruitHistory[] {
		return Array(10)
			.fill(null)
			.map(() => this.roll());
	}
}
