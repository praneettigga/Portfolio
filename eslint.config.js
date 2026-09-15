import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  {
    ignores: ['dist'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        document: 'readonly',
        window: 'readonly',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      'no-undef': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react/jsx-uses-vars': 'error',
    },
  },
]
