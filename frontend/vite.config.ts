import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        viteTsconfigPaths(),
        svgr({
            include: '**/*.svg?react',
        }),
        wasm(),
        topLevelAwait(),
    ],
    optimizeDeps: {
        exclude: ['@aleohq/wasm', '@aleohq/sdk'],
    },
    server: {},
});
