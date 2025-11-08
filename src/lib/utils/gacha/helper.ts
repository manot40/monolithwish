import type { RecruitWithRate, RecruitHistory } from '$lib/types/common';

import { debounce } from 'perfect-debounce';

export function getRandomValue<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function distribute(pool: RecruitWithRate[]): RecruitWithRate[] {
	const totalChance = pool.reduce((acc, item) => acc + item.rate, 0);
	const distributedChance = (1 - totalChance) / pool.length;
	return pool.map((item) => ({ ...item, rate: item.rate + distributedChance }));
}

export function pull(pool: RecruitWithRate[]): RecruitWithRate | undefined {
	const [randomInt] = crypto.getRandomValues(new Uint32Array(1));
	const roll = randomInt / (0xffffffff + 1);

	let cumulativeChance = 0;
	for (const item of pool) {
		cumulativeChance += item.rate;
		if (roll < cumulativeChance) return item;
	}

	const item = pool.at(-1);
	if (item) return item;
}

export function handleSRPityHit(
	srPool: RecruitWithRate[],
	ssrPool: RecruitWithRate[],
	SSR_CHANCE: number
): RecruitWithRate {
	const seed = Math.random();
	const isSSR = seed <= SSR_CHANCE;
	const result = pull(distribute(isSSR ? ssrPool : srPool));

	if (result) return result;

	throw new Error('No recruit found');
}

export const persistHistory = debounce((key: string, value: RecruitHistory[]) => {
	localStorage.setItem(key, JSON.stringify(value));
}, 0);
