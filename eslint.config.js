import globals from 'globals'
import vue from 'eslint-plugin-vue'
import js from '@eslint/js'
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: ['dist/', 'node_modules/', '.husky/']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node }
    },
    plugins: {
      vue
    },
    rules: {
      ...vue.configs['flat/recommended'].rules,
      'vue/multi-word-component-names': 'off'
    }
  }
]
