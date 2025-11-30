const parser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const unicorn = require('eslint-plugin-unicorn');
const nPlugin = require('eslint-plugin-n');
const promisePlugin = require('eslint-plugin-promise');
const prettierPlugin = require('eslint-plugin-prettier');


module.exports = [

  {
    files: ['**/*.{js,ts}'],
    ignores: ['dist/**', 'node_modules/**', '.turbo/**', 'coverage/**', '.next/**', '*.log', 'pnpm-lock.yaml', '*.local'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      unicorn,
      n: nPlugin,
      promise: promisePlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // General JS rules
      'curly': ['error', 'all'],
      'brace-style': ['error', '1tbs'],

      // import ordering
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
        },
      ],
      'n/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
      'n/no-unpublished-import': [
        'error',
        { allowModules: ['@faker-js/faker', 'mercurius-codegen', 'query-string'] },
      ],

      // Prettier plugin as error
      'prettier/prettier': 'error',

      // Unicorn rules
      // NOTE: filename-case rule removed — newer unicorn versions may not provide this rule.
      // You can re-add a filename rule when a supported rule is available or install an older plugin.
      // 'unicorn/import-style' removed — this rule isn't available in some plugin versions.
      // removed 'unicorn/numeric-separators-style' and 'unicorn/prevent-abbreviations' due to plugin rule mismatch across versions

      // TypeScript rules
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Promise rules
      'promise/always-return': 'error',
    },

    settings: {
      node: { tryExtensions: ['.js', '.json', '.node', '.ts'] },
      'import/resolver': { typescript: {} },
    },
  },

  // Test files (jest/mocha) - relax envs
  {
    files: ['**/*.{spec,test}.{ts,js}'],
    languageOptions: { globals: { jest: true, describe: true, it: true, beforeEach: true, afterEach: true } },
    rules: {},
  },

  // JS-only variations
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];
