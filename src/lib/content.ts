export interface StagePhoto {
	readonly slug: string;
	readonly alt: string;
}

export interface PhotoGroup {
	readonly id: string;
	readonly photos: readonly StagePhoto[];
}

/** Page sections, top to bottom; each id is also its #hash. */
export const sections = ['home', 'food', 'music', 'contact'] as const;
export type Section = (typeof sections)[number];

/** Per-section treatment: which photo group plays, plus scrim/filter. */
export interface StageSpec {
	readonly group: PhotoGroup;
	/** Full CSS background values for the scrim layer. */
	scrimDesktop: string;
	scrimMobile: string;
	/** Optional CSS filter applied to every photo (music section). */
	filter?: string;
}

const scrim = (shape: string, inner: number, outer: number) =>
	`radial-gradient(ellipse ${shape}, rgba(11,10,8,${inner}) 0%, rgba(11,10,8,${outer}) 100%)`;

export const srcset = (slug: string) =>
	`/img/${slug}-1080.webp 1080w, /img/${slug}-1920.webp 1920w`;

/** Moody candlelit event series by Fredericke Alma Sauerbrey. */
const moody: PhotoGroup = {
	id: 'moody',
	photos: [
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
	]
};

/**
 * Plate photography for the food section (daylight series + Zoe Spawton's
 * documentary set). Portrait originals from static/img/food, processed by
 * scripts/optimize-images.mjs in sorted filename order.
 */
const food: PhotoGroup = {
	id: 'food',
	photos: [
		{ slug: 'food-01', alt: 'A candlelit table set with small plates, wine and bread' },
		{ slug: 'food-02', alt: 'A plated dish on a dark wooden table' },
		{ slug: 'food-03', alt: 'A dessert plated on ceramic beside a candle' },
		{ slug: 'food-04', alt: 'A plated parentesi dish photographed from above' },
		{ slug: 'food-05', alt: 'A course from the parentesi menu on ceramic' },
		{ slug: 'food-06', alt: 'Shaved vegetables arranged on a white plate' },
		{ slug: 'food-07', alt: 'Hands finishing a plate in the kitchen' },
		{ slug: 'food-08', alt: 'A vegetable dish dressed with fresh herbs' },
		{ slug: 'food-09', alt: 'A plated course on a linen-covered table' },
		{ slug: 'food-10', alt: 'A finished dish ready for service' }
	]
};

/**
 * Home: the moody series plus Pietro and Vincenzo at the stove and one
 * plate from the food series.
 */
const home: PhotoGroup = {
	id: 'home',
	photos: [
		moody.photos[0],
		{
			slug: 'pietro-vincenzo',
			alt: 'Pietro and Vincenzo cooking under a pendant lamp, guests looking on'
		},
		...moody.photos.slice(1),
		food.photos[5] // food-06, the shaved-vegetable plate
	]
};

export const groups = { moody, home, food };

export const stages: Record<Section, StageSpec> = {
	home: {
		group: home,
		scrimDesktop: scrim('80% 70% at 50% 45%', 0.18, 0.62),
		scrimMobile: scrim('110% 70% at 50% 45%', 0.22, 0.66)
	},
	food: {
		group: food,
		scrimDesktop: scrim('80% 70% at 50% 45%', 0.3, 0.72),
		scrimMobile: scrim('110% 70% at 50% 45%', 0.34, 0.76)
	},
	music: {
		group: moody,
		filter: 'brightness(.6) saturate(.8)',
		scrimDesktop: scrim('70% 60% at 50% 50%', 0.45, 0.85),
		scrimMobile: scrim('100% 60% at 50% 50%', 0.5, 0.88)
	},
	contact: {
		group: moody,
		scrimDesktop: scrim('80% 70% at 50% 45%', 0.25, 0.68),
		scrimMobile: scrim('110% 70% at 50% 45%', 0.28, 0.72)
	}
};
