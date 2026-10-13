import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export interface ProjectSummary { title: string; description: string; slug: string; url: string; stack: string[]; featured: boolean; demo: boolean; }

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  const seen = new Set<string>();
  for (const project of all) {
    if (seen.has(project.data.slug)) throw new Error(`重复项目 slug: ${project.data.slug}`);
    seen.add(project.data.slug);
  }
  return all.filter((project) => import.meta.env.DEV || !project.data.draft)
    .sort((a, b) => a.data.order - b.data.order || a.data.slug.localeCompare(b.data.slug));
}

export function summarizeProject(project: Project): ProjectSummary {
  return { ...project.data, url: `/projects/${project.data.slug}/` };
}
