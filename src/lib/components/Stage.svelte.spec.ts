import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import { nav } from '$lib/nav.svelte';
import { stages } from '$lib/content';
import Stage from './Stage.svelte';

const content = createRawSnippet(() => ({
	render: () => '<p>stage content</p>'
}));

describe('Stage.svelte', () => {
	beforeEach(() => {
		nav.open = false;
	});

	it('renders every photo with an alt and the content snippet', async () => {
		render(Stage, { spec: stages.home, children: content });
		await expect.element(page.getByText('stage content')).toBeVisible();
		for (const photo of stages.home.photos) {
			await expect.element(page.getByAltText(photo.alt)).toBeInTheDocument();
		}
	});

	it('shows the photo credit', async () => {
		render(Stage, {
			spec: stages.contact,
			credit: 'Photos: Fredericke Alma Sauerbrey, Zoe Spawton',
			children: content
		});
		await expect
			.element(page.getByText('Photos: Fredericke Alma Sauerbrey, Zoe Spawton'))
			.toBeVisible();
	});

	it('dims the content and raises the nav scrim while the nav is open', async () => {
		render(Stage, { spec: stages.home, children: content });
		const stageContent = page.getByText('stage content');
		await expect.element(stageContent).toBeVisible();
		nav.open = true;
		await expect
			.poll(() => {
				const dimmed = document.querySelector('.content.dimmed');
				const scrim = document.querySelector('.nav-scrim.visible');
				return Boolean(dimmed && scrim);
			})
			.toBe(true);
	});
});
