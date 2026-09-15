export const HOLD_SECONDS = 5;
export const DISSOLVE_SECONDS = 1;
export const SECONDS_PER_PHOTO = HOLD_SECONDS + DISSOLVE_SECONDS;
const RELEASE_EPSILON = 0.0006;

export function cycleSeconds(count: number): number {
	return SECONDS_PER_PHOTO * count;
}

/**
 * Opacity keyframes for one photo in an n-photo endless crossfade: each
 * photo displays for HOLD_SECONDS, then the next dissolves in over
 * DISSOLVE_SECONDS. The photo fades in over the current one and is
 * released (cut to 0) only once the next photo fully covers it — no
 * flash of the base.
 */
export function crossfadeKeyframes(count: number): Keyframe[] {
	if (count < 3) throw new Error(`crossfade needs at least 3 photos, got ${count}`);
	const cycle = cycleSeconds(count);
	const fadeInStart = SECONDS_PER_PHOTO / cycle;
	const fullAt = (SECONDS_PER_PHOTO + DISSOLVE_SECONDS) / cycle;
	const releaseAt = (2 * SECONDS_PER_PHOTO + DISSOLVE_SECONDS) / cycle;
	return [
		{ opacity: 0, offset: 0 },
		{ opacity: 0, offset: fadeInStart },
		{ opacity: 1, offset: fullAt },
		{ opacity: 1, offset: releaseAt },
		{ opacity: 0, offset: releaseAt + RELEASE_EPSILON },
		{ opacity: 0, offset: 1 }
	];
}

/** Negative delay so photo i is mid-hold at t=0 and exactly one photo is visible. */
export function photoDelaySeconds(index: number): number {
	return -(SECONDS_PER_PHOTO / 2 + SECONDS_PER_PHOTO * index);
}
