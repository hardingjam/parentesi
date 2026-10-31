import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import { nav } from '$lib/nav.svelte';
import Stage from './Stage.svelte';

const content = createRawSnippet(() => ({
	render: () => '<p>stage content</p>'
}));

describe('Stage.svelte', () => {
	beforeEach(() => {
		nav.open = false;
	});

	it('renders the content snippet without a photo credit', async () => {
		render(Stage, { id: 'home', children: content });
		await expect.element(page.getByText('stage content')).toBeVisible();
		expect(document.body.textContent).not.toContain('Photos:');
	});

	it('dims the content while the nav is open', async () => {
		render(Stage, { id: 'home', children: content });
		await expect.element(page.getByText('stage content')).toBeVisible();
		nav.open = true;
		await expect.poll(() => Boolean(document.querySelector('#home.dimmed'))).toBe(true);
	});
});
