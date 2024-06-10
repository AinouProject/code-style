#!/usr/bin/env node

// @ts-check
/// <reference types="@types/node" />

import { spawnSync } from 'child_process'
import * as fs from 'fs'

const nodeVersion = '20'

const isPackageRoot = fs.existsSync('package.json')
let isEsm = false

if (isPackageRoot) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
  isEsm = packageJson.type === 'module'

  const isYarnBerry = fs.existsSync('.yarnrc.yml') || `${packageJson.packageManager}`.startsWith('yarn@')

  if (isYarnBerry) {
    spawnSync('yarn', ['config', 'set', 'enableTelemetry', 'false'], { stdio: 'inherit' })
    spawnSync('yarn', ['config', 'set', 'nodeLinker', 'node-modules'], { stdio: 'inherit' })
    spawnSync('yarn', ['plugin', 'import', 'typescript'], { stdio: 'inherit' })
    spawnSync('yarn', ['plugin', 'import', 'workspace-tools'], { stdio: 'inherit' })
  }

  spawnSync('yarn', [
    'add',
    '-D',
    'eslint',
    'prettier',
    'typescript',
    `@types/node@${nodeVersion}`,
  ], { stdio: 'inherit' })

  fs.mkdirSync('.vscode', { recursive: true })
  if (!fs.existsSync('.vscode/settings.json')) {
    fs.writeFileSync('.vscode/settings.json', JSON.stringify({}, null, 2))
  }

  const settings = JSON.parse(fs.readFileSync('.vscode/settings.json').toString())
  settings['typescript.tsdk'] = './node_modules/typescript/lib'
  settings['editor.codeActionsOnSave'] = { 'source.fixAll': true }
  settings['editor.defaultFormatter'] = 'esbenp.prettier-vscode'
  settings['search.exclude'] = { '.yarn/': true }
  settings['editor.formatOnSave'] = true

  fs.writeFileSync('.vscode/settings.json', JSON.stringify(settings, null, 2))

  fs.writeFileSync('.prettierrc', `{
  "singleQuote": true,
  "trailingComma": "all",
  "semi": false,
  "printWidth": 120
}
`)

  fs.writeFileSync('eslint.config.mjs', `import ainouCodeStyle from '@ainou/code-style'

  export default [...ainouCodeStyle]
`)

  if (fs.existsSync('.eslintrc.cjs')) {
    fs.unlinkSync('.eslintrc.cjs')
  }

  if (!fs.existsSync('.nvmrc')) {
    fs.writeFileSync('.nvmrc', `${nodeVersion}`)
  }
  if (!fs.existsSync('.gitignore')) {
    fs.writeFileSync('.gitignore', '')
  }

  const gitIgnores = fs.readFileSync('.gitignore').toString().split('\n')

  if (gitIgnores.includes('.vscode/*')) {
    gitIgnores.splice(gitIgnores.indexOf('.vscode/*'), 1, '# !.yarn/cache')
  }

  if (gitIgnores.includes('!.yarn/cache')) {
    gitIgnores.splice(gitIgnores.indexOf('!.yarn/cache'), 1, '# !.yarn/cache')
  }

  if (gitIgnores.includes('#.pnp.*')) {
    gitIgnores.splice(gitIgnores.indexOf('#.pnp.*'), 1, '.pnp.*')
  }

  if (gitIgnores.includes('# Swap the comments on the following lines if you don\'t wish to use zero-installs')) {
    gitIgnores.splice(gitIgnores.indexOf('# Swap the comments on the following lines if you don\'t wish to use zero-installs'), 1, '# code-style: yarn has been configured not to use zero-installs')
  }

  if (!gitIgnores.includes('node_modules')) {
    gitIgnores.push('node_modules')
  }

  if (!gitIgnores.includes('dist')) {
    gitIgnores.push('dist')
  }

  for (const line of [
    '.pnp.*',
    '.yarn/*',
    '!.yarn/patches',
    '!.yarn/plugins',
    '!.yarn/releases',
    '!.yarn/sdks',
    '!.yarn/versions'
  ]) {
    if (!gitIgnores.includes(line)) {
      gitIgnores.push(line)
    }
  }

  fs.writeFileSync('.gitignore', gitIgnores.join('\n'))
}

if (!fs.existsSync('tsconfig.json')) {
  fs.writeFileSync('tsconfig.json', `{
  "compilerOptions": {
    "target": "esnext",
    "module": "${isEsm ? 'node16' : 'commonjs'}",
    "strict": true,
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "moduleResolution": "node16",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "removeComments": false,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist",
    "lib": ["ESNext"],
    "allowUnreachableCode": true
  },
  "include": ["src"]
}`)
}

const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json').toString())
tsConfig.compilerOptions = tsConfig.compilerOptions || {}
tsConfig.compilerOptions.strict = true
tsConfig.compilerOptions.forceConsistentCasingInFileNames = true
tsConfig.compilerOptions.sourceMap = true
if (tsConfig.compilerOptions.declaration) {
  tsConfig.compilerOptions.declarationMap = true
}

fs.writeFileSync('tsconfig.json', JSON.stringify(tsConfig, null, 2))
