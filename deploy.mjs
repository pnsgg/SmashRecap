import path from 'path';
import { bundle } from '@remotion/bundler';

const serveUrl = await bundle({
  // If you have a webpack override in remotion.config.ts, pass it here as well.
  entryPoint: path.join(process.cwd(), './src/remotion/index.ts'),
  publicDir: path.join(process.cwd(), './static'),
  outDir: path.join(process.cwd(), './remotion-bundle'),
  webpackOverride: (config) => config,
  onProgress: (progress) => console.log(`Webpack bundling progress: ${progress}%`)
});

console.log(`Bundle created at ${serveUrl}`);
