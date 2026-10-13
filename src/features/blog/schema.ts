import { z } from 'astro/zod';
import { slugSchema, dateSchema } from '@/shared/utils/content-validation';

export const postSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  slug: slugSchema,
  publishedAt: dateSchema,
  updatedAt: dateSchema.optional(),
  tags: z.array(z.string().trim().min(1).refine((tag) => !/[\/\\?#%]/.test(tag) && tag !== '.' && tag !== '..', '标签不包含 URL 路径保留字符')).transform((tags) => [...new Set(tags)]).default([]),
  draft: z.boolean().default(false),
  comments: z.boolean().default(true),
  demo: z.boolean().default(false),
});
