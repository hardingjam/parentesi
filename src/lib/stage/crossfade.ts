/**
 * Reel timing (owner decision): each photo displays for HOLD_MS, then the
 * next dissolves in over FADE_MS. Keep PhotoStack.svelte's CSS
 * transition-duration in sync with FADE_MS.
 */
export const HOLD_MS = 5000;
export const FADE_MS = 1000;
