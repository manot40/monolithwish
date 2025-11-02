export const assets: Record<string, string> = import.meta.glob('$lib/images/*.png', {
	eager: true,
	query: '?url',
	import: 'default'
});

export const result: Record<string, string> = import.meta.glob('$lib/images/recruit/*.png', {
	eager: true,
	query: '?url',
	import: 'default'
});

export const splashAssets: Record<string, string> = import.meta.glob('$lib/videos/*.mp4', {
	eager: true,
	query: 'url',
	import: 'default'
});

export const getAsset = (key: string) => assets[`/src/lib/images/${key}.png`];

export const getRecruit = (type: 'disc' | 'trekker', id: number) =>
	result[`/src/lib/images/recruit/${type}_${id}.png`];

export const getVideo = (key: string) => splashAssets[`/src/lib/videos/${key}.mp4`];
