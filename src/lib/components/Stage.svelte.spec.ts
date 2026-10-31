import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import Stage from './Stage.svelte';

const content = createRawSnippet(() => ({
	render: () => '<p>stage content</p>'
}));

describe('Stage.svelte', () => {
	it('renders the content snippet without a photo credit', async () => {
		render(Stage, { id: 'home', children: content });
		await expect.element(page.getByText('stage content')).toBeVisible();
		expect(document.body.textContent).not.toContain('Photos:');
	});
});
