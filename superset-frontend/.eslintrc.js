/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const packageConfig = require('./package');

const importCoreModules = [];
Object.entries(packageConfig.dependencies).forEach(([pkg]) => {
  if (/@superset-ui/.test(pkg)) {
    importCoreModules.push(pkg);
  }
});

// ignore files in production mode
let ignorePatterns = [];
if (process.env.NODE_ENV === 'production') {
  ignorePatterns = [
    '*.test.{js,ts,jsx,tsx}',
    'plugins/**/test/**/*',
    'packages/**/test/**/*',
    'packages/generator-superset/**/*',
  ];
}

const restrictedImportsRules = {
  'no-design-icons': {
    name: '@ant-design/icons',
    message:
      'Avoid importing icons directly from @ant-design/icons. Use the src/components/Icons component instead.',
  },
  'no-moment': {
    name: 'moment',
    message:
      'Please use the dayjs library instead of moment.js. See https://day.js.org',
  },
  'no-lodash-memoize': {
    name: 'lodash/memoize',
    message: 'Lodash Memoize is unsafe! Please use memoize-one instead',
  },
  'no-testing-library-react': {
    name: '@superset-ui/core/spec',
    message: 'Please use spec/helpers/testing-library instead',
  },
  'no-testing-library-react-dom-utils': {
    name: '@testing-library/react-dom-utils',
    message: 'Please use spec/helpers/testing-library instead',
  },
  'no-antd': {
    name: 'antd',
    message: 'Please import Ant components from the index of src/components',
  },
  'no-superset-theme': {
    name: '@superset-ui/core',
    importNames: ['supersetTheme'],
    message:
      'Please use the theme directly from the ThemeProvider rather than importing supersetTheme.',
  },
  'no-query-string': {
    name: 'query-string',
    message: 'Please use the URLSearchParams API instead of query-string.',
  },
};

module.exports = {
  extends: [
    'airbnb',
    'prettier',
    'prettier/react',
    'plugin:react-hooks/recommended',
    'plugin:react-prefer-function-component/recommended',
    'plugin:storybook/recommended',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    browser: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        // resolve modules from `/superset_frontend/node_modules` and `/superset_frontend`
        moduleDirectory: ['node_modules', '.'],
      },
      typescript: {
        alwaysTryTypes: true,
        project: [
          './tsconfig.json',
          './packages/superset-ui-core/tsconfig.json',
          './packages/superset-ui-chart-controls/',
          './plugins/*/tsconfig.json',
        ],
      },
    },
    // only allow import from top level of module
    'import/core-modules': importCoreModules,
    react: {
      version: 'detect',
    },
  },
  plugins: [
    'react',
    'file-progress',
    'lodash',
    'theme-colors',
    'icons',
    'i18n-strings',
    'react-prefer-function-component',
    'prettier',
  ],
  // Add this TS ESlint rule in separate `rules` section to avoid breakages with JS/TS files in /cypress-base.
  // TODO(hainenber): merge it to below `rules` section.
  rules: {
    '@typescript-eslint/prefer-optional-chain': 'error',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'airbnb',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
        'prettier/react',
      ],
      plugins: ['@typescript-eslint/eslint-plugin', 'react', 'prettier'],
      rules: {
        '@typescript-eslint/ban-ts-ignore': 0,
        '@typescript-eslint/ban-ts-comment': 0, // disabled temporarily
        '@typescript-eslint/ban-types': 0, // disabled temporarily
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'enum',
            format: ['PascalCase'],
          },
          {
            selector: 'enumMember',
            format: ['PascalCase'],
          },
        ],
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-use-before-define': 1, // disabled temporarily
        '@typescript-eslint/no-non-null-assertion': 0, // disabled temporarily
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0, // re-enable up for discussion
        '@typescript-eslint/no-unused-vars': 'warn', // downgrade to Warning severity for Jest v30 upgrade
        camelcase: 0,
        'class-methods-use-this': 0,
        'func-names': 0,
        'guard-for-in': 0,
        'import/no-cycle': 0, // re-enable up for discussion, might require some major refactors
        'import/extensions': [
          'error',
          {
            '.ts': 'always',
            '.tsx': 'always',
            '.json': 'always',
          },
        ],
        'import/no-named-as-default-member': 0,
        'import/prefer-default-export': 0,
        indent: 0,
        'jsx-a11y/anchor-is-valid': 2,
        'jsx-a11y/click-events-have-key-events': 0, // re-enable up for discussion
        'jsx-a11y/mouse-events-have-key-events': 0, // re-enable up for discussion
        'max-classes-per-file': 0,
        'new-cap': 0,
        'no-bitwise': 0,
        'no-continue': 0,
        'no-mixed-operators': 0,
        'no-multi-assign': 0,
        'no-multi-spaces': 0,
        'no-nested-ternary': 0,
        'no-prototype-builtins': 0,
        'no-restricted-properties': 0,
        'no-shadow': 0, // re-enable up for discussion
        'no-use-before-define': 0, // disabled temporarily
        'padded-blocks': 0,
        'prefer-arrow-callback': 0,
        'prefer-destructuring': ['error', { object: true, array: false }],
        'react/destructuring-assignment': 0, // re-enable up for discussion
        'react/forbid-prop-types': 0,
        'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
        'react/jsx-fragments': 1,
        'react/jsx-no-bind': 0,
        'react/jsx-props-no-spreading': 0, // re-enable up for discussion
        'react/no-array-index-key': 0,
        'react/no-string-refs': 0,
        'react/no-unescaped-entities': 0,
        'react/no-unused-prop-types': 0,
        'react/prop-types': 0,
        'react/require-default-props': 0,
        'react/sort-comp': 0, // TODO: re-enable in separate PR
        'react/static-property-placement': 0, // re-enable up for discussion
        'prettier/prettier': 'error',
        'file-progress/activate': 1,
        // delete me later: temporary rules to help with migration
        'jsx-no-useless-fragment': 0,
        'react/function-component-definition': [
          0,
          {
            namedComponents: 'arrow-function',
          },
        ],
        'default-param-last': 0,
        'react/no-unstable-nested-components': 0,
        'react/jsx-no-useless-fragment': 0,
        'react/no-unknown-property': 0,
        'no-restricted-exports': 0,
        'react/default-props-match-prop-types': 0,
        'no-unsafe-optional-chaining': 0,
        'react/state-in-constructor': 0,
        'import/no-import-module-exports': 0,
        'no-promise-executor-return': 0,
        'prefer-regex-literals': 0,
        'react/no-unused-class-component-methods': 0,
        'import/no-relative-packages': 0,
        'prefer-exponentiation-operator': 0,
        'react/react-in-jsx-scope': 0,
        'no-restricted-syntax': [
          'error',
          {
            selector:
              "ImportDeclaration[source.value='react'] :matches(ImportDefaultSpecifier, ImportNamespaceSpecifier)",
            message:
              'Default React import is not required due to automatic JSX runtime in React 16.4',
          },
          {
            // this disallows wildcard imports from modules (but allows them for local files with `./` or `src/`)
            selector:
              'ImportNamespaceSpecifier[parent.source.value!=/^(\\.|src)/]',
            message: 'Wildcard imports are not allowed',
          },
        ],
        'no-restricted-imports': [
          'error',
          {
            paths: Object.values(restrictedImportsRules).filter(Boolean),
            patterns: ['antd/*'],
          },
        ],
      },
      settings: {
        'import/resolver': {
          typescript: {},
        },
        react: {
          version: 'detect',
        },
      },
    },
    {
      files: ['packages/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              restrictedImportsRules['no-moment'],
              restrictedImportsRules['no-lodash-memoize'],
              restrictedImportsRules['no-superset-theme'],
            ],
            patterns: [],
          },
        ],
      },
    },
    {
      files: ['plugins/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              restrictedImportsRules['no-moment'],
              restrictedImportsRules['no-lodash-memoize'],
            ],
            patterns: [],
          },
        ],
      },
    },
    {
      files: ['src/components/**', 'src/theme/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: Object.values(restrictedImportsRules).filter(
              r => r.name !== 'antd',
            ),
            patterns: [],
          },
        ],
      },
    },
    {
      files: [
        '*.test.ts',
        '*.test.tsx',
        '*.test.js',
        '*.test.jsx',
        '*.stories.tsx',
        '*.stories.jsx',
        'fixtures.*',
      ],
      excludedFiles: 'cypress-base/cypress/**/*',
      plugins: ['jest', 'jest-dom', 'no-only-tests', 'testing-library'],
      env: {
        'jest/globals': true,
      },
      settings: {
        jest: {
          version: 'detect',
        },
      },
      extends: [
        'plugin:jest/recommended',
        'plugin:jest-dom/recommended',
        'plugin:testing-library/react',
      ],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'no-only-tests/no-only-tests': 'error',
        'max-classes-per-file': 0,
        // temporary rules to help with migration - please re-enable!
        'testing-library/await-async-queries': 0,
        'testing-library/await-async-utils': 0,
        'testing-library/no-await-sync-events': 0,
        'testing-library/no-render-in-lifecycle': 0,
        'testing-library/no-unnecessary-act': 0,
        'testing-library/no-wait-for-multiple-assertions': 0,
        'testing-library/prefer-screen-queries': 0,
        'testing-library/await-async-events': 0,
        'testing-library/no-node-access': 0,
        'testing-library/no-wait-for-side-effects': 0,
        'testing-library/prefer-presence-queries': 0,
        'testing-library/render-result-naming-convention': 0,
        'testing-library/no-container': 0,
        'testing-library/prefer-find-by': 0,
        'testing-library/no-manual-cleanup': 0,
        'no-restricted-syntax': [
          'error',
          {
            selector:
              "ImportDeclaration[source.value='react'] :matches(ImportDefaultSpecifier, ImportNamespaceSpecifier)",
            message:
              'Default React import is not required due to automatic JSX runtime in React 16.4',
          },
        ],
        'no-restricted-imports': 0,
      },
    },
    {
      files: [
        '*.test.ts',
        '*.test.tsx',
        '*.test.js',
        '*.test.jsx',
        '*.stories.tsx',
        '*.stories.jsx',
        'fixtures.*',
        'cypress-base/cypress/**/*',
        'Stories.tsx',
        'packages/superset-ui-core/src/theme/index.tsx',
      ],
      rules: {
        'theme-colors/no-literal-colors': 0,
        'icons/no-fa-icons-usage': 0,
        'i18n-strings/no-template-vars': 0,
        'no-restricted-imports': 0,
        'react/no-void-elements': 0,
      },
    },
  ],
  // eslint-disable-next-line no-dupe-keys
  rules: {
    'theme-colors/no-literal-colors': 'error',
    'icons/no-fa-icons-usage': 'error',
    'i18n-strings/no-template-vars': ['error', true],
    camelcase: [
      'error',
      {
        allow: ['^UNSAFE_'],
        properties: 'never',
      },
    ],
    'class-methods-use-this': 0,
    curly: 2,
    'func-names': 0,
    'guard-for-in': 0,
    'import/extensions': [
      'error',
      {
        '.js': 'always',
        '.jsx': 'always',
        '.ts': 'always',
        '.tsx': 'always',
        '.json': 'always',
      },
    ],
    'import/no-cycle': 0, // re-enable up for discussion, might require some major refactors
    'import/prefer-default-export': 0,
    indent: 0,
    'jsx-a11y/anchor-is-valid': 1,
    'jsx-a11y/click-events-have-key-events': 0, // re-enable up for discussion
    'jsx-a11y/mouse-events-have-key-events': 0, // re-enable up for discussion
    'lodash/import-scope': [2, 'member'],
    'new-cap': 0,
    'no-bitwise': 0,
    'no-continue': 0,
    'no-mixed-operators': 0,
    'no-multi-assign': 0,
    'no-multi-spaces': 0,
    'no-nested-ternary': 0,
    'no-prototype-builtins': 0,
    'no-restricted-properties': 0,
    'no-shadow': 0, // re-enable up for discussion
    'padded-blocks': 0,
    'prefer-arrow-callback': 0,
    'prefer-object-spread': 1,
    'prefer-destructuring': ['error', { object: true, array: false }],
    'react/destructuring-assignment': 0, // re-enable up for discussion
    'react/forbid-component-props': 1,
    'react/forbid-prop-types': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-fragments': 1,
    'react/jsx-no-bind': 0,
    'react/jsx-props-no-spreading': 0, // re-enable up for discussion
    'react/no-array-index-key': 0,
    'react/no-string-refs': 0,
    'react/no-unescaped-entities': 0,
    'react/no-unused-prop-types': 0,
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'react/sort-comp': 0, // TODO: re-enable in separate PR
    'react/static-property-placement': 0, // disabled temporarily
    'react-prefer-function-component/react-prefer-function-component': 1,
    'prettier/prettier': 'error',
    // disabling some things that come with the eslint 7->8 upgrade. Will address these in a separate PR
    'react/no-unknown-property': 0,
    'react/no-void-elements': 0,
    'react/function-component-definition': [
      0,
      {
        namedComponents: 'arrow-function',
      },
    ],
    'react/no-unstable-nested-components': 0,
    'react/jsx-no-useless-fragment': 0,
    'default-param-last': 0,
    'no-import-assign': 0,
    'import/no-relative-packages': 0,
    'default-case-last': 0,
    'no-promise-executor-return': 0,
    'react/no-unused-class-component-methods': 0,
    'react/react-in-jsx-scope': 0,
    'no-restricted-imports': [
      'error',
      {
        paths: Object.values(restrictedImportsRules).filter(Boolean),
        patterns: ['antd/*'],
      },
    ],
  },
  ignorePatterns,
};
