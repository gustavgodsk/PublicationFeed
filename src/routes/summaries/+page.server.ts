import { readdir } from 'node:fs/promises';
import path from 'node:path';

export async function load() {
	const summariesPath = path.join(process.cwd(), 'static', 'summaries');
	const files = await readdir(summariesPath);

	const pdfFiles = files
		.filter((file) => file.toLowerCase().endsWith('.pdf'))
		.toSorted((a, b) => b.localeCompare(a));

	return {
		summaries: pdfFiles
	};
}
