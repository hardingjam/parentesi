export interface StagePhoto {
	readonly slug: string;
	readonly alt: string;
}

/** Per-route treatment of the shared photo reel — never the photos themselves. */
export interface StageSpec {
	/** Full CSS background values for the scrim layer. */
	scrimDesktop: string;
	scrimMobile: string;
	/** Optional CSS filter applied to every photo (music route). */
	filter?: string;
}

const scrim = (shape: string, inner: number, outer: number) =>
	`radial-gradient(ellipse ${shape}, rgba(11,10,8,${inner}) 0%, rgba(11,10,8,${outer}) 100%)`;

export const srcset = (slug: string) =>
	`/img/${slug}-1080.webp 1080w, /img/${slug}-1920.webp 1920w`;

/**
 * The single site-wide photo reel. It lives in the layout and crossfades
 * continuously — navigating between routes must never restart or change it.
 */
export const stagePhotos: readonly StagePhoto[] = [
	{
		slug: 'cover',
		alt: 'The parentesi kitchen at dusk, seen through a window reflecting a brick courtyard'
	},
	{
		slug: 'plating-live',
		alt: 'Chefs plating dishes in front of guests at a candlelit dinner'
	},
	{
		slug: 'pietro-steam',
		alt: 'Steam rising under a pendant lamp while chefs cook'
	},
	{
		slug: 'cutting',
		alt: 'Hands slicing spring onions on a wooden board'
	}
];

export const stages: Record<'home' | 'food' | 'music' | 'contact', StageSpec> = {
	home: {
		scrimDesktop: scrim('80% 70% at 50% 45%', 0.18, 0.62),
		scrimMobile: scrim('110% 70% at 50% 45%', 0.22, 0.66)
	},
	food: {
		scrimDesktop: scrim('80% 70% at 50% 45%', 0.3, 0.72),
		scrimMobile: scrim('110% 70% at 50% 45%', 0.34, 0.76)
	},
	music: {
		filter: 'brightness(.6) saturate(.8)',
		scrimDesktop: scrim('70% 60% at 50% 50%', 0.45, 0.85),
		scrimMobile: scrim('100% 60% at 50% 50%', 0.5, 0.88)
	},
	contact: {
		scrimDesktop: scrim('80% 70% at 50% 45%', 0.25, 0.68),
		scrimMobile: scrim('110% 70% at 50% 45%', 0.28, 0.72)
	}
};
