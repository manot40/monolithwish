import type { Writable } from 'svelte/store';

export type AssetID = number;
export type Featured = Recruit | AssetID;
export type RecruitType = 'trekker' | 'disc';

export type Recruit = {
	name: string;
	type: RecruitType;
	rarity: 3 | 4 | 5;
	assetID: AssetID;
	isFeatured?: boolean;
};

export type RecruitWithRate = Recruit & {
	rate: number;
};

export type RecruitHistory = Omit<Recruit, 'name' | 'type'> & {
	time: number;
	isPity: boolean;
};

export type BannerData = {
	type: RecruitType;
	name: string;
	cover?: string;
	featured?: { sr: Featured[]; ssr: Featured };
	pityCounter: Writable<number>;
};
