// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

// ESLint flat config for ESLint v9
// Load ESM-only plugins dynamically and export a Promise that resolves to the config
module.exports = (async () => {
  // dynamic imports so we can load ESM plugins in CommonJS config
  const tsParserMod = await import('@typescript-eslint/parser').catch(() => null);
  const tsEslintPluginMod = await import('@typescript-eslint/eslint-plugin').catch(() => null);

  const tsParser = (tsParserMod && (tsParserMod.default || tsParserMod)) || undefined;
  const tsEslintPlugin =
    (tsEslintPluginMod && (tsEslintPluginMod.default || tsEslintPluginMod)) || undefined;

  return [
    // ignore patterns (flat config uses 'ignores')
    {
      ignores: [
        'node_modules/**',
        'dist/**',
        '.storybook/**',
        'storybook-static/**',
        '.vite/**',
        '.turbo/**',
        'build/**',
      ],
    },

    // main config for TS/JS files inside source/demo/demo-related code
    {
      files: ['src/**/*.{ts,tsx,js,jsx}'],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: 'module',
          tsconfigRootDir: __dirname,
          project: ['./tsconfig.eslint.json'],
        },
      },
      plugins: Object.assign({}, tsEslintPlugin ? { '@typescript-eslint': tsEslintPlugin } : {}),
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        // restrict imports from top-level @mui packages
        'no-restricted-imports': [
          'error',
          {
            patterns: [{ regex: '^@mui/[^/]+$' }],
          },
        ],
      },
      settings: {
        react: { version: 'detect' },
      },
    },
  ];
})();
