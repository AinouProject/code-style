#!/usr/bin/env node

const nodeVersion = '16'

const { spawnSync } = require('child_process')
const fs = require('fs')

if (fs.existsSync('.yarnrc.yml')) {
  spawnSync('yarn', ['config', 'set', 'enableTelemetry', 'false'], { stdio: 'inherit' })
  spawnSync('yarn', ['config', 'set', 'nodeLinker', 'node-modules'], { stdio: 'inherit' })
  spawnSync('yarn', ['plugin', 'import', 'typescript'], { stdio: 'inherit' })
  spawnSync('yarn', ['plugin', 'import', 'workspace-tools'], { stdio: 'inherit' })
}

spawnSync('yarn', [
  'add',
  '-D',
  'eslint',
  '@typescript-eslint/parser',
  '@typescript-eslint/eslint-plugin',
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
settings['editor.formatOnSave'] = true

fs.writeFileSync('.vscode/settings.json', JSON.stringify(settings, null, 2))

fs.writeFileSync('.prettierrc', `{
  "singleQuote": true,
  "trailingComma": "all",
  "semi": false
}`)

fs.writeFileSync('.eslintrc.js', `module.exports = {
  root: true,
  extends: require.resolve('@ainou/code-style'),
  parserOptions: {
    // tsconfigRootDir: __dirname,
    // project: ['./tsconfig.eslint.json'],
  }
}`)

if (!fs.existsSync('tsconfig.json')) {
  fs.writeFileSync('tsconfig.json', `{
    "compilerOptions": {
      "target": "esnext",
      "module": "commonjs",
      "strict": true,
      "sourceMap": true,
      "declaration": true,
      "declarationMap": true,
      "moduleResolution": "node",
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true,
      "removeComments": false,
      "forceConsistentCasingInFileNames": true,
      "outDir": "dist",
      "lib": ["ESNext"]
    },
    "include": ["src"]
  }`)
}

const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json').toString())
tsConfig.compilerOptions = tsConfig.compilerOptions || {}
tsConfig.compilerOptions.strict = true
tsConfig.compilerOptions.forceConsistentCasingInFileNames = true
if (tsConfig.compilerOptions.declaration) {
  tsConfig.compilerOptions.declarationMap = true
}

fs.writeFileSync('tsconfig.json', JSON.stringify(tsConfig, null, 2))

if (!fs.existsSync('.nvmrc')) {
  fs.writeFileSync('.nvmrc', `${nodeVersion}`)
}

if (!fs.existsSync('.gitignore')) {
  fs.writeFileSync('.gitignore', '')
}

const gitIgnores = fs.readFileSync('.gitignore').toString().split('\n')

if (gitIgnores.includes('!/.yarn/cache')) {
  gitIgnores.splice(gitIgnores.indexOf('!/.yarn/cache'), 1, '# !.yarn/cache')
}

if (gitIgnores.includes('#/.pnp.*')) {
  gitIgnores.splice(gitIgnores.indexOf('#/.pnp.*'), 1, '/.pnp.*')
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
