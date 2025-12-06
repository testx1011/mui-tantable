// ESLint flat config for ESLint v9
// Load ESM-only plugins dynamically and export a Promise that resolves to the config
module.exports = (async () => {
  // dynamic imports so we can load ESM plugins in CommonJS config
  const tsParserMod = await import('@typescript-eslint/parser').catch(() => null);
  const tsEslintPluginMod = await import('@typescript-eslint/eslint-plugin').catch(() => null);
  const storybookPluginMod = await import('eslint-plugin-storybook').catch(() => null);

  const tsParser = (tsParserMod && (tsParserMod.default || tsParserMod)) || undefined;
  const tsEslintPlugin = (tsEslintPluginMod && (tsEslintPluginMod.default || tsEslintPluginMod)) || undefined;
  const storybookPlugin = (storybookPluginMod && (storybookPluginMod.default || storybookPluginMod)) || undefined;

  // try to gather recommended rules from storybook plugin if available
  const storybookRecommended = (storybookPlugin && storybookPlugin.configs && storybookPlugin.configs.recommended) || {};

  return [
    // ignore patterns (flat config uses 'ignores')
    {
      ignores: ['node_modules/**', 'dist/**', '.storybook/**', 'storybook-static/**'],
    },

    // main config for TS/JS files
    {
      files: ['**/*.{ts,tsx,js,jsx}'],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: 'module',
          tsconfigRootDir: __dirname,
          project: ['./tsconfig.eslint.json'],
        },
      },
      plugins: Object.assign(
        {},
        tsEslintPlugin ? { '@typescript-eslint': tsEslintPlugin } : {},
        storybookPlugin ? { storybook: storybookPlugin } : {}
      ),
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
      // merge recommended storybook rules if available (non-destructive)
      rules: Object.assign({}, storybookRecommended.rules || {}),
      settings: {
        react: { version: 'detect' },
      },
    },
  ];
})();
