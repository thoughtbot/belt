import axios from 'axios';

export type RequestMethod = 'GET' | 'POST' | 'DELETE';

type Params = {
  url: string;
  method?: RequestMethod;
  params?: unknown;
  parseJson?: boolean;
};

async function makeRequest<TData>(options: Params): Promise<TData> {
  const { url, method = 'GET', params } = options;

  const response = await axios<TData>(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    [method === 'GET' ? 'params' : 'data']: params,
  });

  return response.data;
}

const api = {
  // TODO: sample, remove
  githubRepos: () =>
    makeRequest<GithubProjectsResponse>({
      url: 'https://thoughtbot-projects-api-68b03dc59059.herokuapp.com/api/projects',
    }),
};

// TODO: sample data, remove
export type GithubProjectsResponse = {
  projects: GithubProject[];
};

export type GithubProject = {
  id: number;
  name: string;
  description: string | null;
  url: string;
  stars?: number;
  forks?: number;
};

export default api;
