import path from 'node:path'
import { fileURLToPath } from 'node:url'

import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import { fixupPluginRules } from '@eslint/compat'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import { includeIgnoreFile } from '@eslint/compat'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Ignores configuration
  includeIgnoreFile(gitignorePath),
  {
    ignores: [
      'node_modules',
      'build',
      'coverage',
      '.idea',
      '!**/.server',
      '!**/.client',
      'app/__generated__',
      'worker-configuration.d.ts'
    ]
  },
  pluginJs.configs.recommended,
  // General configuration
  {
    rules: {
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: ['return', 'export'] },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var']
        }
      ],
      'no-console': 'off'
    }
  },
  // React configuration
  {
    plugins: {
      react: fixupPluginRules(eslintPluginReact),
      'react-hooks': fixupPluginRules(eslintPluginReactHooks),
      'jsx-a11y': fixupPluginRules(eslintPluginJsxA11y)
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.serviceworker
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      formComponents: ['Form'],
      linkComponents: [
        { name: 'Link', linkAttribute: 'to' },
        { name: 'NavLink', linkAttribute: 'to' }
      ],
      'import/resolver': {
        typescript: {}
      }
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginJsxA11y.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': 'warn',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true
        }
      ],
      'react/jsx-no-leaked-render': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off'
    }
  },
  // TypeScript configuration
  ...[
    ...tseslint.configs.recommended,
    {
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            args: 'after-used',
            ignoreRestSiblings: false,
            argsIgnorePattern: '^_.*?$'
          }
        ]
      }
    }
  ],
  // Prettier configuration
  ...[
    eslintPluginPrettier,
    {
      rules: {
        'prettier/prettier': [
          'warn',
          {
            printWidth: 120,
            trailingComma: 'none',
            tabWidth: 2,
            semi: false,
            singleQuote: true,
            bracketSpacing: true,
            arrowParens: 'avoid',
            endOfLine: 'auto',
            plugins: ['prettier-plugin-tailwindcss']
          }
        ]
      }
    }
  ],
  // Import configuration
  {
    plugins: {
      import: fixupPluginRules(eslintPluginImport)
    },
    settings: {
      'import/internal-regex': '^~/',
      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx']
        },
        typescript: {
          alwaysTryTypes: true
        }
      }
    },
    rules: {
      'import/no-default-export': 'off',
      'import/order': [
        'warn',
        {
          groups: ['type', 'builtin', 'object', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '~/**',
              group: 'external',
              position: 'after'
            }
          ],
          'newlines-between': 'always'
        }
      ]
    }
  },
  {
    files: ['**/eslint.config.mjs'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
]
