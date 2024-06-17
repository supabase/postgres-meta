import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'lib',
    entry: {
      index: './src/lib/index.ts',
      base: './src/lib/base.ts',
    },

    format: ['cjs', 'esm'],
    dts: {
      compilerOptions: {
        incremental: false,
      },
    },
    sourcemap: true,
    clean: true,
    loader: {
      '.sql': 'text',
    },
    outDir: 'dist/lib',
  },
  {
    name: 'server',
    entry: {
      server: './src/server/server.ts',
    },

    format: ['esm'],
    dts: {
      compilerOptions: {
        incremental: false,
      },
    },
    sourcemap: true,
    clean: true,
    loader: {
      '.sql': 'text',
    },
    outDir: 'dist/server',
  },
])
