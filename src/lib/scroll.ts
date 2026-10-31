import { pushState } from '$app/navigation';
import { resolve } from '$app/paths';
import type { Section } from '$lib/content';

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

let stopCurrent: (() => void) | undefined;

/**
 * Glide the page to a section and put its #hash in the URL. Native
 * `scroll-behavior: smooth` can't be slowed or eased, so this animates the
 * window itself: ease-in-out, ~1.4s per screen of travel (2.4s cap), and
 * instant under prefers-reduced-motion. Any wheel/touch/key input hands
 * control straight back to the user.
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

	const duration = Math.min(2400, 1000 + (400 * Math.abs(distance)) / innerHeight);
	const start = performance.now();
	const stop = () => {
		cancelAnimationFrame(frame);
		for (const type of ['wheel', 'touchstart', 'keydown']) removeEventListener(type, stop);
		stopCurrent = undefined;
	};
	let frame = requestAnimationFrame(function step(now) {
		const t = Math.min((now - start) / duration, 1);
		scrollTo(0, from + distance * easeInOutCubic(t));
		if (t < 1) frame = requestAnimationFrame(step);
		else stop();
	});
	for (const type of ['wheel', 'touchstart', 'keydown']) {
		addEventListener(type, stop, { passive: true });
	}
	stopCurrent = stop;
}
