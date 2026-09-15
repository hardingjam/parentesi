import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const photos = [
	['static/photos/( ) Cover.jpg', 'cover'],
	['static/photos/( ) Plating live.jpg', 'plating-live'],
	['static/photos/( ) Pietro steam.jpg', 'pietro-steam'],
	['static/photos/( ) Cutting.jpg', 'cutting']
];

await mkdir('static/img', { recursive: true });
for (const [src, slug] of photos) {
	for (const width of [1080, 1920]) {
		const out = `static/img/${slug}-${width}.webp`;
		await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(out);
		console.log('wrote', out);
	}
}
