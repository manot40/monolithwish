import type { RecruitType } from '$lib/types/common';

export const assets: Record<string, string> = import.meta.glob(
	'$lib/assets/images/*.{png,avif,webp}',
	{ eager: true, query: '?url', import: 'default' }
);

export const result: Record<string, string> = import.meta.glob('$lib/assets/images/recruit/*.png', {
	eager: true,
	query: '?url',
	import: 'default'
});

export const splashAssets: Record<string, string> = import.meta.glob('$lib/assets/videos/*.mp4', {
	eager: true,
	query: 'url',
	import: 'default'
});

const ASSET_BASE_PATH = '/src/lib/assets';

export const getVideo = (key: string) => splashAssets[`${ASSET_BASE_PATH}/videos/${key}.mp4`];
export const getAsset = (key: string, ext = 'png' as 'png' | 'avif' | 'webp') =>
	assets[`${ASSET_BASE_PATH}/images/${key}.${ext}`];
export const getRecruit = (type: RecruitType, id: number) =>
	result[`${ASSET_BASE_PATH}/images/recruit/${type}_${id}.png`];
