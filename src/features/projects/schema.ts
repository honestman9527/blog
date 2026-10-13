import { z } from 'astro/zod';

export const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug 使用小写英文、数字与连字符'),
  stack: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  draft: z.boolean().default(false),
  demo: z.boolean().default(false),
  links: z.array(z.object({ label: z.string(), href: z.url().refine((url) => /^https?:/.test(url), '链接必须使用 http(s)') })).default([]),
});
