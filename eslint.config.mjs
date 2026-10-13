import astro from 'eslint-plugin-astro';
import boundaries from 'eslint-plugin-boundaries';
import tsParser from '@typescript-eslint/parser';

const entity = (type, extra = {}) => ({ element: { type, ...extra } });
const allow = (from, to) => ({ from: entity(from), allow: { to: entity(to) } });

export default [
  { ignores: ['dist/**', '.astro/**', 'node_modules/**', 'test-results/**', 'playwright-report/**'] },
  ...astro.configs.recommended,
  { files: ['**/*.ts'], languageOptions: { parser: tsParser } },
  { files: ['**/*.astro'], languageOptions: { parserOptions: { parser: tsParser } } },
  {
    files: ['src/**/*.{ts,js,astro}', 'src/**/*.astro/*.{ts,js}'],
    plugins: { boundaries },
    settings: {
      'boundaries/root-path': import.meta.dirname,
      'boundaries/elements': [
        { type: 'pages', pattern: 'src/pages' },
        { type: 'feature', pattern: 'src/features/*', capture: ['name'] },
        { type: 'layouts', pattern: 'src/layouts' },
        { type: 'shared', pattern: 'src/shared' },
        { type: 'config', pattern: 'src/config' },
      ],
      'boundaries/files': [
        { category: 'composition', pattern: 'src/content.config.ts' },
        { category: 'environment', pattern: 'src/env.d.ts' },
      ],
      'import/resolver': { [import.meta.dirname + '/scripts/astro-import-resolver.cjs']: { project: './tsconfig.json', extensions: ['.ts', '.js', '.astro', '.css', '.json'] } },
      'boundaries/flag-as-external': { unresolvableAlias: false, customSourcePatterns: ['astro:*', 'node:*', '/pagefind/pagefind.js'] },
      'boundaries/additional-dependency-nodes': [
        { selector: 'JSXOpeningElement[name.name="script"] > JSXAttribute[name.name="src"] > Literal', kind: 'value', name: 'script-src' },
        { selector: 'JSXOpeningElement[name.name="script"] > JSXAttribute[name.name="src"] > JSXExpressionContainer > Literal', kind: 'value', name: 'script-src-expression' },
      ],
    },
    rules: {
      'boundaries/no-unknown-files': 'error',
      'boundaries/no-unknown-dependencies': 'error',
      'boundaries/dependencies': ['error', {
        default: 'disallow',
        policies: [
          allow('pages', ['layouts', 'shared', 'config']),
          allow('feature', ['layouts', 'shared', 'config']),
          allow('layouts', ['shared', 'config']),
          { from: entity('pages'), allow: { to: entity('feature', { fileInternalPath: '{index,ui}.ts' }) } },
          { from: { file: { categories: 'composition' } }, allow: { to: entity('feature', { fileInternalPath: 'schema.ts' }) } },
        ],
      }],
      'no-restricted-syntax': ['error',
        { selector: 'ImportExpression[source.type!="Literal"]', message: '使用字面量 import 路径，确保依赖边界可检查。' },
        { selector: 'CallExpression[callee.object.type="MetaProperty"][callee.property.name=/^glob/]', message: '内容加载仅使用 Content Collections loader。' },
        { selector: 'JSXOpeningElement[name.name="script"] > JSXAttribute[name.name="src"] > JSXExpressionContainer > :not(Literal)', message: 'script src 必须为可检查的字面量路径。' },
      ],
    },
  },
];
