import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { nav } from '$lib/nav.svelte';
import Nav from './Nav.svelte';

describe('Nav.svelte', () => {
	beforeEach(() => {
		nav.open = false;
	});

	it('shows only the ( ) mark when closed', async () => {
		render(Nav, { current: '/' });
		// The parens are persistent <a> elements (not swapped for a <button>)
		// so their transform transition has something to animate from — see
		// Nav.svelte's onParenClick. That makes their accessible role "link".
		await expect.element(page.getByRole('link', { name: 'open menu' }).first()).toBeInTheDocument();
		// The link is correctly removed from the accessibility tree while
		// closed (visibility: hidden), so getByRole needs includeHidden to find
		// it at all. toBeVisible() here only checks offsetParent/display:none,
		// which the fade transition intentionally never uses, so assert on the
		// actual computed visibility/opacity instead.
		await expect
			.element(page.getByRole('link', { name: 'food', includeHidden: true }))
			.toHaveStyle({ visibility: 'hidden', opacity: '0' });
	});

	it('opens on hover and reveals the route links', async () => {
		// The test browser is hover-capable, so entering the nav opens it.
		render(Nav, { current: '/' });
		await page.getByRole('link', { name: 'open menu' }).first().hover();
		await expect.poll(() => nav.open).toBe(true);
		await expect
			.element(page.getByRole('link', { name: 'food' }))
			.toHaveStyle({ visibility: 'visible', opacity: '1' });
		await expect
			.element(page.getByRole('link', { name: 'music' }))
			.toHaveStyle({ visibility: 'visible', opacity: '1' });
		await expect
			.element(page.getByRole('link', { name: 'contact' }))
			.toHaveStyle({ visibility: 'visible', opacity: '1' });
	});

	it('closes when the pointer leaves the nav', async () => {
		nav.open = true;
		render(Nav, { current: '/' });
		const el = document.querySelector('nav');
		el?.dispatchEvent(new MouseEvent('mouseleave'));
		await expect.poll(() => nav.open).toBe(false);
	});

	it('marks the current route non-interactive', async () => {
		nav.open = true;
		render(Nav, { current: '/food' });
		await expect
			.element(page.getByRole('link', { name: 'food' }))
			.toHaveAttribute('aria-current', 'page');
	});

	it('closes on Escape', async () => {
		nav.open = true;
		render(Nav, { current: '/' });
		await expect
			.element(page.getByRole('link', { name: 'food' }))
			.toHaveStyle({ visibility: 'visible' });
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		await expect.poll(() => nav.open).toBe(false);
	});

	it('closes when the closing paren is clicked while open (regression: persistent element)', async () => {
		// Regression guard for the fix that made both parens single, persistent
		// <a> elements instead of swapping <a>/<button> via {#if}/{:else} — the
		// swap used to mean the CLOSING paren specifically (a fresh element
		// each toggle) had nothing for its transform transition to animate
		// from. Clicking it while open should still run onParenClick's
		// closeNav() branch.
		nav.open = true;
		render(Nav, { current: '/' });
		const closingParen = page.getByRole('link', { name: 'home' }).last();
		await expect.element(closingParen).toBeInTheDocument();
		// Clicking it while open also carries a real href="/" navigation (the
		// spec'd "tap either paren while open -> navigate home and close").
		// Stop that default action so this component-only test doesn't
		// navigate the whole test page away — Nav's own onclick still runs
		// and calls closeNav() synchronously regardless of who else is
		// listening.
		const element = closingParen.element() as HTMLAnchorElement;
		element.addEventListener('click', (e) => e.preventDefault(), { once: true, capture: true });
		element.click();
		expect(nav.open).toBe(false);
	});
});
