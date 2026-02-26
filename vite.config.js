import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for assets
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Disable code splitting to create a single bundle
    cssCodeSplit: false,
    // Build as a library to ensure proper bundling
    lib: false,
    rollupOptions: {
      output: {
        // Use IIFE format instead of ES modules to work with file://
        format: 'iife',
        // Single file output - bundle everything
        inlineDynamicImports: true,
        // Ensure relative paths in output
        assetFileNames: 'assets/[name].[ext]',
        entryFileNames: 'assets/[name].js',
        // Global variable name for IIFE (not used but required)
        name: 'ResumeBuilder',
      },
    },
  },
})

