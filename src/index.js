require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  ignorePatterns: ['dist', 'node_modules', '!.eslintrc.js'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    }
  },
  env: {
    es6: true,
    es2017: true,
    es2020: true,
    es2021: true,
  },
  overrides: [
    {
      files: ['*.{ts,tsx,mts,cts}'],

      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: {
        project: ['**/tsconfig.json'],
        projectFolderIgnoreList: ['**/node_modules/**'],
      },

      plugins: [
        '@typescript-eslint',
        'react',
        'react-hooks',
      ],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:react-hooks/recommended',
        require.resolve('eslint-config-prettier'),
      ],

      rules: {
        eqeqeq: ['error', 'smart'],
        'no-undef': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/explicit-member-accessibility': 'error',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/require-await': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        'react/self-closing-comp': [
          'error', {
            component: true,
            html: false,
          }
        ]
      },
    },

    {
      files: ['*.{js,mjs,cjs}'],

      parser: require.resolve('@babel/eslint-parser'),
      parserOptions: {
        requireConfigFile: false,
      },

      extends: [
        'eslint:recommended',
        require.resolve('eslint-config-prettier'),
      ],

      rules: {
        eqeqeq: ['error', 'smart'],
        'no-undef': 'off',
      },
    },

    {
      files: ['.eslintrc.js', '.prettierrc.js', 'jest.config.js', 'node-libs/**'],
      env: {
        node: true,
      },
    },
  ],
};
