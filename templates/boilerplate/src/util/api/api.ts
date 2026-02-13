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

function mapRepoToProject(repo: GithubRepo): GithubProject {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
  };
}

const api = {
  // Fetch thoughtbot's public repositories from GitHub API
  githubRepos: (): Promise<GithubProjectsResponse> =>
    makeRequest<GithubRepo[]>({
      url: 'https://api.github.com/orgs/thoughtbot/repos',
    }).then((repos) => ({
      projects: repos.map(mapRepoToProject),
    })),
};

// TODO: sample data, remove
export type GithubProjectsResponse = {
  projects: GithubProject[];
};

export type GithubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
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
