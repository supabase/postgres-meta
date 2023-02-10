import { spawn } from 'node:child_process'
import { globby } from 'globby'

async function spawn_async(file) {
  const proc = spawn('npx', ['sql-formatter', '-l', 'postgresql', '--fix', file])
  return new Promise((resolve, reject) => {
    proc.on('close', resolve)
    proc.on('error', reject)
  })
}

async function main() {
  const files = await globby('{src,test}/**/*.sql')
  for (const file of files) {
    const exitCode = await spawn_async(file)
    if (exitCode) {
      console.log('Error, skipping file:', file)
    } else {
      console.log('Formatted:', file)
    }
  }
}

main()
