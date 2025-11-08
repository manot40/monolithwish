import type { Writable } from 'svelte/store';

export type AssetID = number;
export type Featured = Recruit | AssetID;
export type RecruitType = keyof typeof RecruitTypeEnum;

export enum RecruitTypeEnum {
	trekker = 0,
	disc = 1
}

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
	type: 0 | 1;
	isPity: boolean;
};

export type BannerData = {
	type: RecruitType;
	name: string;
	cover?: string;
	featured?: { sr: Featured[]; ssr: Featured };
	pityCounter: Writable<number>;
};
