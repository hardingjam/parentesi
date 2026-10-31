import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { nav } from '$lib/nav.svelte';
import Nav from './Nav.svelte';

describe('Nav.svelte', () => {
	beforeEach(() => {
		nav.open = false;
	});

	it('names the section in view between the parens when closed', async () => {
		render(Nav, { current: 'music' });
		await expect
			.element(page.getByRole('button', { name: 'music', includeHidden: true }))
			.toBeVisible();
	});

	it('shows only the mark when closed', async () => {
		render(Nav, { current: 'home' });
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

	it('opens on hover and reveals the section links', async () => {
		// The test browser is hover-capable, so entering the nav opens it.
		render(Nav, { current: 'home' });
		await page.getByRole('link', { name: 'open menu' }).first().hover();
		await expect.poll(() => nav.open).toBe(true);
		// Non-current destinations rest dimmed at .55 (full opacity on
		// hover/focus; the current section rests at full opacity).
		await expect
			.element(page.getByRole('link', { name: 'food' }))
			.toHaveStyle({ visibility: 'visible', opacity: '0.55' });
		await expect
			.element(page.getByRole('link', { name: 'music' }))
			.toHaveStyle({ visibility: 'visible', opacity: '0.55' });
		await expect
			.element(page.getByRole('link', { name: 'contact' }))
			.toHaveStyle({ visibility: 'visible', opacity: '0.55' });
	});

	it('links home to the top of the page', async () => {
		nav.open = true;
		render(Nav, { current: 'food' });
		// The text link, not the parens (which are also labelled "home").
		await expect.element(page.getByText('home', { exact: true })).toHaveAttribute('href', '#home');
	});

	it('closes when the pointer leaves the nav', async () => {
		nav.open = true;
		render(Nav, { current: 'home' });
		const el = document.querySelector('nav');
		el?.dispatchEvent(new MouseEvent('mouseleave'));
		await expect.poll(() => nav.open).toBe(false);
	});

	it('shows the section in view at full opacity, non-interactive', async () => {
		nav.open = true;
		render(Nav, { current: 'food' });
		const food = page.getByRole('link', { name: 'food' });
		await expect.element(food).toHaveAttribute('aria-current', 'location');
		await expect.element(food).toHaveStyle({ opacity: '1', pointerEvents: 'none' });
	});

	it('closes on Escape', async () => {
		nav.open = true;
		render(Nav, { current: 'home' });
		await expect
			.element(page.getByRole('link', { name: 'food' }))
			.toHaveStyle({ visibility: 'visible' });
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		await expect.poll(() => nav.open).toBe(false);
	});

	it('closes when the closing paren is clicked while open', async () => {
		nav.open = true;
		render(Nav, { current: 'home' });
		const closingParen = page.getByRole('link', { name: 'home' }).last();
		await expect.element(closingParen).toBeInTheDocument();
		// Clicking it while open also carries a real href="#home" jump (the
		// spec'd "tap either paren while open -> go home and close").
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
