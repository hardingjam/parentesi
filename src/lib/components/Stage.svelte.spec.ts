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

	it('renders the content snippet and the default photo credit', async () => {
		render(Stage, { children: content });
		await expect.element(page.getByText('stage content')).toBeVisible();
		await expect.element(page.getByText('Photos: Fredericke Alma Sauerbrey')).toBeVisible();
	});

	it('shows a custom credit and corner note', async () => {
		render(Stage, {
			credit: 'Photos: Fredericke Alma Sauerbrey, Zoe Spawton',
			corner: 'Berlin',
			children: content
		});
		await expect
			.element(page.getByText('Photos: Fredericke Alma Sauerbrey, Zoe Spawton'))
			.toBeVisible();
		await expect.element(page.getByText('Berlin')).toBeInTheDocument();
	});

	it('dims the content while the nav is open', async () => {
		render(Stage, { children: content });
		await expect.element(page.getByText('stage content')).toBeVisible();
		nav.open = true;
		await expect.poll(() => Boolean(document.querySelector('.content.dimmed'))).toBe(true);
	});
});
