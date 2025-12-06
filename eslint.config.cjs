// ESLint flat config for ESLint v9
const { FlatCompat } = require('@eslint/eslintrc');
const tsEslintPlugin = require('@typescript-eslint/eslint-plugin');

const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  // convert shareable configs (storybook) into flat config pieces
  ...compat.extends('plugin:storybook/recommended'),

  // general file-level config
  {
    ignores: ['node_modules/**', 'dist/**', '.storybook/**', 'storybook-static/**'],
  },

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.eslint.json'],
      },
      // JSX support is enabled via parser and tsconfig (no ecmaFeatures key in flat config)
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      // keep rules enabled to show project issues; we can add overrides later
    },
    settings: {
      react: { version: 'detect' },
    },
  },
];
