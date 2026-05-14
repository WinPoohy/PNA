import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: 'index.html',
                design: 'design.html',
                about: 'about.html',
                calc: 'calc.html'
            }
        }
    }
});
