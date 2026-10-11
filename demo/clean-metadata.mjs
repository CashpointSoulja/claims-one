import { execFileSync } from 'node:child_process';
import { rename } from 'node:fs/promises';

const output = 'output/claims-one-walkthrough.mp4';
const clean = 'output/claims-one-walkthrough.clean.mp4';
// Stream-copy, so no image/audio re-encoding or changes to the edited timing.
execFileSync('ffmpeg', [
  '-y', '-v', 'error', '-i', output, '-map', '0', '-c', 'copy',
  '-map_metadata', '-1', '-metadata', 'comment=', '-movflags', '+faststart', clean,
], { stdio: 'inherit' });
const metadata = JSON.parse(execFileSync('ffprobe', [
  '-v', 'error', '-show_entries', 'format_tags', '-of', 'json', clean,
], { encoding: 'utf8' }));
if (metadata.format?.tags?.comment) {
  throw new Error('Unexpected delivery metadata comment');
}
await rename(clean, output);
console.log('Delivery metadata cleared; video and audio stream-copied.');
