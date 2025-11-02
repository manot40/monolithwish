export type AssetID = number;
export type Featured = Recruit | AssetID;
export type RecruitType = 'trekker' | 'disc';

export type Recruit = {
	type: RecruitType;
	rarity: 3 | 4 | 5;
	assetID: AssetID;
	name: string;
};

export type RecruitWithRate = Recruit & {
	rate: number;
};

export type RecruitHistory = Recruit & {
	time: number;
	isPity: boolean;
};

export type BannerData = {
	type: RecruitType;
	name: string;
	cover?: string;
	featured?: { sr: Featured[]; ssr: Featured };
};
