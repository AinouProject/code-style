const { spawn } = require('child_process')
const fs = require('fs')

spawn('yarn', [
  'add',
  '-D',
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

fs.writeFileSync('.vscode/settings.json', JSON.stringify(settings, null, 2))

fs.writeFileSync('.prettierrc', `{
  "singleQuote": true,
  "trailingComma": "all",
  "semi": false
}`)

fs.writeFileSync('.eslintrc.js', `module.exports = {
  root: true,
  extends: '@ainou/code-style',
  parserOptions: {
    // tsconfigRootDir: __dirname,
    // project: ['./tsconfig.eslint.json'],
  }
}`)
