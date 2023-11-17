import { defineConfig, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    worker: {
        format: "es"
    },
    plugins: [
        react(),
        wasm(),
        topLevelAwait(),
        viteTsconfigPaths(),
        svgr({
            include: '**/*.svg?react',
        }),
    ],
    build: {
        target: "esnext",
        sourcemap: true,
    },
    optimizeDeps: {
        exclude: ['@aleohq/wasm', '@aleohq/sdk'],
    },
    server: {
        host: true,
        port: 3000,
        headers: {
        }
    },
});
