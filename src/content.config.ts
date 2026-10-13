import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectSchema } from './features/projects/schema';
import { postSchema } from './features/blog/schema';

export const collections = {
  projects: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
    schema: projectSchema,
  }),
  blog: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: postSchema,
  }),
};
