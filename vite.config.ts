import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import react from "@vitejs/plugin-react-swc";
import { ManifestV3Export, crx } from "@crxjs/vite-plugin";
import { viteStaticCopy } from 'vite-plugin-static-copy';

import manifestJson from "./public/manifest.json";
import path from 'path';

const manifest = manifestJson as ManifestV3Export;

// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    alias: [{ find: '@root', replacement: path.resolve(__dirname, 'src') }],
  },
  plugins: [tsconfigPaths(), react(), crx({ manifest })],
})
