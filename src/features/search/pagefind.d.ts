declare module '*/pagefind/pagefind.js' {
  export interface SearchResultData {
    url: string;
    excerpt: string;
    meta: { title?: string; type?: string };
  }
  export interface SearchResult {
    data(): Promise<SearchResultData>;
  }
  export function search(query: string): Promise<{ results: SearchResult[] }>;
}
