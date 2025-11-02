import { Banner } from '$lib/utils/gacha';

export type { Banner };
export type BannerKey = keyof typeof banners;

export const banners = {
	shia: new Banner({
		type: 'trekker',
		name: 'Tide to The Full Moon',
		cover: 'bg_gacha_10155',
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
