import axios from 'axios';

export type RequestMethod = 'GET' | 'POST' | 'DELETE';

// Consider moving this out into environment configuration
// to support multiple environments
export const BASE_URL = 'https://api.sampleapis.com';

type Params = {
  path: string;
  method: RequestMethod;
  params?: unknown;
  parseJson?: boolean;
  baseUrl?: string;
};

async function makeRequest<TData>(options: Params): Promise<TData> {
  const { path, method, params, baseUrl = BASE_URL } = options;

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
  coffee: () => makeRequest<Coffee[]>({ path: 'coffee/hot', method: 'GET' }),
};

// TODO: sample data, remove
export type Coffee = {
  title: string;
  description: string;
  /** url */
  image: string;
  id: number;
};

export default api;
