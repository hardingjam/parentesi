import { describe, expect, it } from 'vitest';
import { crossfadeKeyframes, cycleSeconds, photoDelaySeconds } from './crossfade';

describe('cycleSeconds', () => {
	it('is 6s per photo (5s display + 1s dissolve)', () => {
		expect(cycleSeconds(3)).toBe(18);
		expect(cycleSeconds(4)).toBe(24);
	});
});

describe('crossfadeKeyframes', () => {
	it('holds 5s and dissolves over 1s for n=4', () => {
		const kf = crossfadeKeyframes(4);
		expect(kf.map((k) => k.opacity)).toEqual([0, 0, 1, 1, 0, 0]);
		const offsets = kf.map((k) => k.offset as number);
		expect(offsets[0]).toBe(0);
		// fade-in starts at 6s of the 24s cycle, is full 1s later, and the
		// photo is released once the next one covers it at 13s
		expect(offsets[1]).toBeCloseTo(6 / 24, 4);
		expect(offsets[2]).toBeCloseTo(7 / 24, 4);
		expect(offsets[3]).toBeCloseTo(13 / 24, 4);
		expect(offsets[4]).toBeCloseTo(13 / 24 + 0.0006, 4);
		expect(offsets[5]).toBe(1);
	});

	it('keeps the same absolute times for n=3', () => {
		const offsets = crossfadeKeyframes(3).map((k) => k.offset as number);
		expect(offsets[1]).toBeCloseTo(6 / 18, 4);
		expect(offsets[2]).toBeCloseTo(7 / 18, 4);
		expect(offsets[3]).toBeCloseTo(13 / 18, 4);
	});

	it('rejects stacks smaller than 3', () => {
		expect(() => crossfadeKeyframes(2)).toThrow();
	});
});

describe('photoDelaySeconds', () => {
	it('offsets each photo by -6s starting mid-hold at -3s', () => {
		expect(photoDelaySeconds(0)).toBe(-3);
		expect(photoDelaySeconds(1)).toBe(-9);
		expect(photoDelaySeconds(3)).toBe(-21);
	});
});
