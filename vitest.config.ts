/// <reference types="vitest" />
import { readFile } from 'fs/promises'
import { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

function sqlLoaderPlugin(): Plugin {
  return {
    name: 'sql-loader',
    async transform(code, id) {
      if (id.endsWith('.sql')) {
        const textContent = await readFile(id, 'utf8')
        return `export default ${JSON.stringify(textContent)};`
      }
      return code
    },
  }
}

export default defineConfig({
  plugins: [sqlLoaderPlugin()],
  test: {
    maxConcurrency: 1,
    // https://github.com/vitest-dev/vitest/issues/317#issuecomment-1542319622
    pool: 'forks',
  },
})
