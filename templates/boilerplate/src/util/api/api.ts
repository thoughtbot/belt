import axios from 'axios';

export type RequestMethod = 'GET' | 'POST' | 'DELETE';

// Consider moving this out into environment configuration
// to support multiple environments
export const BASE_URL = 'https://api.sampleapis.com';

type Params = {
  path: string;
  method?: RequestMethod;
  params?: unknown;
  parseJson?: boolean;
  baseUrl?: string;
};

async function makeRequest<TData>(options: Params): Promise<TData> {
  const { path, method = 'GET', params, baseUrl = BASE_URL } = options;

  const response = await axios<TData>(`${baseUrl}/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    [method === 'GET' ? 'params' : 'data']: params,
  });

  return response.data;
}

const api = {
  githubRepos: () =>
    makeRequest<{ projects: GithubProject[] }>({
      baseUrl: 'https://github-projects-api.vercel.app',
      path: 'api/projects',
    }),
};

// TODO: sample data, remove
export type GithubProject = {
  id: string;
  name: string;
  description: string | null;
  url: string;
  stars?: number;
  forks?: number;
};

export type Coffee = {
  title: string;
  description: string;
  /** the url to the image */
  image: string;
  id: number;
};

export default api;
