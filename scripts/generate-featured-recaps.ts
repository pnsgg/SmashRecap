import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { join, basename } from 'path';

const players = [
  { name: 'ドラ右 (Doramigi)', id: 1815290, imageUrl: '/images/recaps/ドラ右.webp' },
  { name: 'Miya', id: 1002311, imageUrl: '/images/recaps/Miya.webp' },
  { name: 'あcola (acola)', id: 1787719, imageUrl: '/images/recaps/あcola.webp' },
  { name: 'Hurt', id: 836465, imageUrl: '/images/recaps/Hurt.webp' },
  { name: 'Sparg0', id: 94369, imageUrl: '/images/recaps/Sparg0.webp' },
  { name: 'Sonix', id: 165614, imageUrl: '/images/recaps/Sonix.webp' },
  { name: 'Syrup', id: 767151, imageUrl: '/images/recaps/Syrup.webp' },
  { name: 'Zomba', id: 252388, imageUrl: '/images/recaps/Zomba.webp' },
  { name: 'カルメロ (Carmelo)', id: 2262042, imageUrl: '/images/recaps/カルメロ.webp' },
  { name: 'らる (Raru)', id: 1787715, imageUrl: '/images/recaps/らる.webp' },
  { name: 'Shuton', id: 134839, imageUrl: '/images/recaps/Shuton.webp' },
  { name: 'Tweek', id: 10213, imageUrl: '/images/recaps/Tweek.webp' },
  { name: 'Glutonny', id: 2613, imageUrl: '/images/recaps/Glutonny.webp' },
  { name: 'MkLeo', id: 41259, imageUrl: '/images/recaps/MkLeo.webp' },
  {
    name: 'たまPだいふく (TamaPDaifuku)',
    id: 1816581,
    imageUrl: '/images/recaps/たまPだいふく.webp'
  },
  { name: 'Light', id: 95011, imageUrl: '/images/recaps/Light.webp' },
  { name: 'Peabnut', id: 37364, imageUrl: '/images/recaps/Peabnut.webp' },
  { name: 'Asimo', id: 964831, imageUrl: '/images/recaps/Asimo.webp' },
  { name: 'Wrath', id: 52384, imageUrl: '/images/recaps/Wrath.webp' },
  { name: 'Tea', id: 399160, imageUrl: '/images/recaps/Tea.webp' }
];

const API_BASE = 'http://localhost:5173/api';
const OUTPUT_DIR = join(process.cwd(), 'static', 'images', 'recaps');

async function main() {
  console.log('Cleaning output directory...');
  if (existsSync(OUTPUT_DIR)) {
    for (const file of readdirSync(OUTPUT_DIR)) {
      rmSync(join(OUTPUT_DIR, file));
    }
  } else {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Starting generation for ${players.length} players...`);

  const tempPropsPath = join(process.cwd(), 'temp-props.json');

  for (const player of players) {
    const filename = basename(player.imageUrl);
    const outputPath = join(OUTPUT_DIR, filename);
    const statsUrl = `${API_BASE}/user/${player.id}/stats/pretty`;

    console.log(`\nProcessing ${player.name} (${player.id})...`);

    try {
      console.log(`\tFetching stats from ${statsUrl}...`);
      const response = await fetch(statsUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
      }

      const props = await response.json();

      console.log(`\tRendering to ${filename}...`);
      writeFileSync(tempPropsPath, JSON.stringify(props));

      const bunCmd = process.platform === 'win32' ? 'bun.cmd' : 'bun';
      const cmd = `${bunCmd} run remotion still VerticalStill "${outputPath}" --props="${tempPropsPath}" --log=error`;
      execSync(cmd, { stdio: 'inherit' });
      console.log('\tDone!');
    } catch (error) {
      console.error(`\tError processing ${player.name}:`, error);
    }
  }

  if (existsSync(tempPropsPath)) {
    rmSync(tempPropsPath);
  }

  console.log('\nAll done!');
}

main().catch(console.error);
