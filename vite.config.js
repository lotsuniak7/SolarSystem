import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    server: {
        hmr: {
            host: 'localhost',
            protocol: 'ws',
        },
        host: true,
        allowedHosts: ['.ngrok-free.app'], // или конкретный домен, например:
        // allowedHosts: ['53cc-46-193-7-195.ngrok-free.app'],
    },
});