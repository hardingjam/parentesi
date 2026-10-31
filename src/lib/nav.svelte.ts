export const nav = $state({ open: false });

export function toggleNav() {
	nav.open = !nav.open;
}

export function closeNav() {
	nav.open = false;
}
