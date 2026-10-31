import { pushState } from '$app/navigation';
import { resolve } from '$app/paths';
import type { Section } from '$lib/content';

// Asymmetric ease-in-out: cubic ease-in over the first 30% of the time,
// cubic ease-out over the remaining 70% (velocity-matched at the joint).
// Paired with 0.8× the symmetric curve's duration, the landing is
// identical to a symmetric ease-in-out cubic; only the start is quicker.
const ACCEL = 0.3;
const ease = (t: number) => (t < ACCEL ? t ** 3 / ACCEL ** 2 : 1 - (1 - t) ** 3 / (1 - ACCEL) ** 2);

let stopCurrent: (() => void) | undefined;

/** True while a glide is moving the page (the nav label and reel wait). */
export const glide = $state({ active: false });

/**
 * Glide the page to a section and put its #hash in the URL. Native
 * `scroll-behavior: smooth` can't be slowed or eased, so this animates the
 * window itself: quick start, slow landing, ~1.1s for one screen (1.9s
 * cap), and instant under prefers-reduced-motion. Any wheel/touch/key
 * input hands control straight back to the user.
 */
export function glideTo(id: Section) {
	stopCurrent?.();
	if (location.hash !== `#${id}`) {
		// A same-page #hash on the resolved base path; the rule only accepts
		// a bare resolve() call, which can't carry a fragment.
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		pushState(`${resolve('/')}#${id}`, {});
	}

	const target = document.getElementById(id);
	if (!target) return;
	const from = scrollY;
	const distance = target.getBoundingClientRect().top;
	if (Math.abs(distance) < 1) return;
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
		scrollTo(0, from + distance);
		return;
	}

	const duration = Math.min(1920, 800 + (320 * Math.abs(distance)) / innerHeight);
	const start = performance.now();
	const stop = () => {
		cancelAnimationFrame(frame);
		for (const type of ['wheel', 'touchstart', 'keydown']) removeEventListener(type, stop);
		stopCurrent = undefined;
		glide.active = false;
	};
	let frame = requestAnimationFrame(function step(now) {
		const t = Math.min((now - start) / duration, 1);
		scrollTo(0, from + distance * ease(t));
		if (t < 1) frame = requestAnimationFrame(step);
		else stop();
	});
	for (const type of ['wheel', 'touchstart', 'keydown']) {
		addEventListener(type, stop, { passive: true });
	}
	stopCurrent = stop;
	glide.active = true;
}
