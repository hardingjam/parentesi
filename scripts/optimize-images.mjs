import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';

// Moody event series (site-wide/home reel) — named sources.
const photos = [
	['static/photos/( ) Cover.jpg', 'cover'],
	['static/photos/( ) Plating live.jpg', 'plating-live'],
	['static/photos/( ) Pietro steam.jpg', 'pietro-steam'],
	['static/photos/( ) Cutting.jpg', 'cutting'],
	['static/photos/( ) Pietro and Vincenzo.jpg', 'pietro-vincenzo']
];

// Food route reel — every JPG the owner drops into static/img/food/
// (portrait originals; kept out of git, only the .webp output is served).
const foodDir = 'static/img/food';
const foodSources = (await readdir(foodDir).catch(() => []))
	.filter((name) => /\.jpe?g$/i.test(name))
	.sort();
foodSources.forEach((name, i) => {
	photos.push([`${foodDir}/${name}`, `food-${String(i + 1).padStart(2, '0')}`]);
});

await mkdir('static/img', { recursive: true });
for (const [src, slug] of photos) {
	for (const width of [1080, 1920]) {
		const out = `static/img/${slug}-${width}.webp`;
		await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(out);
		console.log('wrote', out);
	}
}
