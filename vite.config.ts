import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'

// Plugin that ships individual CSS files AND a combined index.css so consumers
// can either `import 'wss3-forge/styles'` (everything) or pick sub-paths.
const copyStyles = () => ({
  name: 'copy-styles',
  closeBundle() {
    const stylesDir = resolve(__dirname, 'dist/styles')
    if (!existsSync(stylesDir)) {
      mkdirSync(stylesDir, { recursive: true })
    }
    const parts: string[] = []
    for (const file of ['animations.css', 'motion.css']) {
      const src = resolve(__dirname, 'src/styles', file)
      const dest = resolve(stylesDir, file)
      copyFileSync(src, dest)
      parts.push(`/* ${file} */\n${readFileSync(src, 'utf8')}\n`)
    }
    writeFileSync(resolve(stylesDir, 'index.css'), parts.join('\n'), 'utf8')
  }
})

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*'],
      outDir: 'dist',
      rollupTypes: true
    }),
    copyStyles()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'WebbaForge',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true
  }
})
