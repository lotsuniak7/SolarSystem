import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    base: '/', // Chemin de base pour Vercel
    server: {
        hmr: {
            host: 'localhost',
            protocol: 'ws',
        },
        host: true,
        allowedHosts: ['.ngrok-free.app'],
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        rollupOptions: {
            external: [], // Ne pas externaliser 'three'
        },
    },
    publicDir: 'public',
});