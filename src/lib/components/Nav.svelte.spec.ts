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

	it('opens to reveal the route links', async () => {
		render(Nav, { current: '/' });
		await page.getByRole('link', { name: 'open menu' }).first().click();
		expect(nav.open).toBe(true);
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
});
