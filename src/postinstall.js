#!/usr/bin/env node

const { spawnSync } = require('child_process')
const fs = require('fs')

spawnSync('yarn', [
  'add',
  '-D',
  'eslint',
  '@typescript-eslint/parser',
  '@typescript-eslint/eslint-plugin',
  'prettier'
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
  fs.writeFileSync('.nvmrc', '16')
}

if (fs.existsSync('.yarnrc.yml')) {
  spawnSync('yarn', ['config', 'set', 'nodeLinker', 'node-modules'], { stdio: 'inherit' })
  spawnSync('yarn', ['plugin', 'import', 'typescript'], { stdio: 'inherit' })
  spawnSync('yarn', ['plugin', 'import', 'workspace-tools'], { stdio: 'inherit' })
}
