import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectSchema } from './features/projects/schema';

export const collections = {
  projects: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/projects' }), schema: projectSchema }),
};
