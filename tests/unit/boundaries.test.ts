import { describe, expect, it } from 'vitest';
import { ESLint } from 'eslint';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

describe('architecture guard', () => {
  it('accepts composition and rejects forbidden imports in TS and Astro', async () => {
    const directory = 'src/features/boundary-fixture';
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.ts'), 'export const fixture = true;');
    try {
      const eslint = new ESLint();
      const cases = [
        ['src/pages/fixture.ts', "import '@/features/boundary-fixture/index';", false],
        ['src/config/fixture.ts', "import '@/features/boundary-fixture/index';", true],
        ['src/shared/fixture.ts', "import '../features/boundary-fixture/index';", true],
        [
          'src/shared/fixture.ts',
          "import type { fixture } from '../features/boundary-fixture/index';",
          true,
        ],
        [
          'src/shared/Fixture.astro',
          "---\nimport '../features/boundary-fixture/index';\n---\n<p>Fixture</p>",
          true,
        ],
        [
          'src/shared/Fixture.astro',
          "<script>import '../features/boundary-fixture/index';</script>",
          true,
        ],
        ['src/shared/fixture.ts', "void import('../features/boundary-fixture/index');", true],
        [
          'src/shared/Fixture.astro',
          '<script src="../features/boundary-fixture/index.ts"></script>',
          true,
        ],
      ] as const;
      for (const [filePath, source, forbidden] of cases) {
        const results = await eslint.lintText(source, { filePath });
        const messages = results.flatMap((result) => result.messages);
        if (forbidden)
          expect(
            messages.some((message) => message.ruleId?.startsWith('boundaries/')),
            `${filePath}: ${source}`,
          ).toBe(true);
        else expect(messages, filePath).toEqual([]);
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
