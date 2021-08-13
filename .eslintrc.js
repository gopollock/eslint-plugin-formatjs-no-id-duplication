module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      modules: true
    }
  },
  env: {
    node: true,
  },
  settings: {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.ts'],
      },
      'typescript': {
        // Makes types only containing library visible
        "alwaysTryTypes": true,
      }
    }
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    'semi': ["error", "always"],
    'arrow-body-style': [2, 'as-needed'],
    'comma-dangle': [2, 'always-multiline'],
    'max-len': [
      2,
      {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'no-console': 1,
    'prefer-template': 2,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'js': 'never',
        'ts': 'never',
      },
    ],
    'import/no-dynamic-require': 1,
    'import/no-unresolved': 2,
    'import/no-extraneous-dependencies': ['error', { 'packageDir': './' }],
    'import/no-webpack-loader-syntax': 1,
    'import/prefer-default-export': 0,
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 1,
    // Allow to define variables after use:
    '@typescript-eslint/no-use-before-define': ['error', { variables: false }],
    '@typescript-eslint/unbound-method': 'error',
    '@typescript-eslint/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }],
    '@typescript-eslint/strict-boolean-expressions': [1, { allowNullableObject: false }],
    "@typescript-eslint/no-unused-vars": "off"
  },
};
