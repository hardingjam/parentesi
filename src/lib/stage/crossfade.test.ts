import { describe, expect, it } from 'vitest';
import {
	DECAY_MS,
	crossfadeKeyframes,
	cycleSeconds,
	decayedRate,
	photoDelaySeconds,
	rateFromDelta
} from './crossfade';

describe('cycleSeconds', () => {
	it('is 7s per photo', () => {
		expect(cycleSeconds(3)).toBe(21);
		expect(cycleSeconds(4)).toBe(28);
	});
});

describe('crossfadeKeyframes', () => {
	it('matches the reference offsets for n=4', () => {
		const kf = crossfadeKeyframes(4);
		expect(kf.map((k) => k.opacity)).toEqual([0, 0, 1, 1, 0, 0]);
		const offsets = kf.map((k) => k.offset as number);
		expect(offsets[0]).toBe(0);
		expect(offsets[1]).toBeCloseTo(0.25, 4);
		expect(offsets[2]).toBeCloseTo(0.3214, 3);
		expect(offsets[3]).toBeCloseTo(0.5714, 3);
		expect(offsets[4]).toBeCloseTo(0.572, 3);
		expect(offsets[5]).toBe(1);
	});

	it('matches the reference offsets for n=3', () => {
		const offsets = crossfadeKeyframes(3).map((k) => k.offset as number);
		expect(offsets[1]).toBeCloseTo(0.3333, 3);
		expect(offsets[2]).toBeCloseTo(0.4286, 3);
		expect(offsets[3]).toBeCloseTo(0.7619, 3);
	});

	it('rejects stacks smaller than 3', () => {
		expect(() => crossfadeKeyframes(2)).toThrow();
	});
});

describe('photoDelaySeconds', () => {
	it('offsets each photo by -7s starting at -3.5s', () => {
		expect(photoDelaySeconds(0)).toBe(-3.5);
		expect(photoDelaySeconds(1)).toBe(-10.5);
		expect(photoDelaySeconds(3)).toBe(-24.5);
	});
});

describe('rateFromDelta', () => {
	it('maps wheel delta to playback rate, capped at 7', () => {
		expect(rateFromDelta(0)).toBe(1);
		expect(rateFromDelta(120)).toBe(2);
		expect(rateFromDelta(-120)).toBe(2);
		expect(rateFromDelta(100000)).toBe(7);
	});
});

describe('decayedRate', () => {
	it('starts at the boosted rate and returns to 1 after DECAY_MS', () => {
		expect(decayedRate(5, 0)).toBe(5);
		expect(decayedRate(5, DECAY_MS)).toBe(1);
		expect(decayedRate(5, DECAY_MS * 2)).toBe(1);
	});

	it('decays monotonically', () => {
		const samples = [0, 300, 600, 900, 1200, 1500].map((t) => decayedRate(4, t));
		for (let i = 1; i < samples.length; i++) expect(samples[i]).toBeLessThanOrEqual(samples[i - 1]);
	});
});
