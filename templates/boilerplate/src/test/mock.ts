import {
  DefaultBodyType,
  HttpResponse,
  PathParams,
  StrictRequest,
  http,
} from 'msw';
import { RequestMethod } from 'src/util/api/api';

type RequestParams = Record<
  string,
  string | number | undefined | (string | number)[]
>;
type MockRequestParams<TData, TParams = RequestParams> = {
  method: RequestMethod;
  response?: TData;
  headers?: Record<string, string>;
  params?: Partial<TParams>;
  status?: number;
  delay?: number;
  baseUrl?: string;
};

function mockRequest<TData = unknown, TParams = RequestParams>(
  url: string,
  {
    method,
    status = 200,
    response,
    headers,
    params,
  }: MockRequestParams<TData, TParams>,
) {
  const methodName = method.toLowerCase() as Lowercase<RequestMethod>;
  return http[methodName](
    url,
    async (info) => {
      const { request, params: actualParams } = info;
      validateHeaders(headers, request);
      await validateParams(params, actualParams, request);

      const responseString =
        typeof response === 'string' ? response : JSON.stringify(response);
      return new HttpResponse(responseString, { status });
    },
    { once: true },
  );
}

function validateHeaders(
  expectedHeaders: Record<string, string> | undefined,
  req: StrictRequest<DefaultBodyType>,
) {
  if (!expectedHeaders) {
    return;
  }

  Object.entries(expectedHeaders).forEach(([key, value]) => {
    try {
      expect(req.headers.get(key)).toEqual(value);
    } catch (e) {
      handleAndThrowError(req, e, 'the headers did not match expectation');
    }
  });
}

async function validateParams<TParams>(
  expectedParams: TParams | undefined,
  actualParams: PathParams,
  req: StrictRequest<DefaultBodyType>,
) {
  if (!expectedParams) {
    return;
  }

  const searchParams = Object.fromEntries(new URL(req.url).searchParams);
  const params = Object.keys(searchParams).length ? searchParams : actualParams;

  try {
    expect(params).toMatchObject(expectedParams);
  } catch (e) {
    handleAndThrowError(req, e, 'the params did not match expectation');
  }
}

function handleAndThrowError(
  request: StrictRequest<DefaultBodyType>,
  e: unknown,
  message: string,
) {
  const error = e as Error;
  if (error.message) {
    error.message = `Mock for ${request.method} ${
      request.url
    } was called, but ${message}. Verify that the mocks provided to the test are correct.\n\n${
      error.message
    }.\n\nThis error occurred in test: ${
      expect.getState().testPath || ''
    }. Test name: '${expect.getState().currentTestName || 'unknown'}'`;
  }
  // eslint-disable-next-line no-console
  console.error(error.stack);
  throw error;
}

export type MockParams<TData, TParams = undefined> = Omit<
  MockRequestParams<TData, TParams>,
  'method'
>;

/**
 * mock requests for tests
 * Eg. usage:
 *   const mocks = [
 *     mock.post('/user/login', { response: { firstName: 'Debra' }})
 *   ])
 *
 *   render(\<MyComponent \/>, { mocks })
 */
const mock = {
  /**
   * mock a GET request to the specified url
   * If params are passed, will throw an error if request params do not match
   * */
  get: <TData, TParams = Record<string, never>>(
    url: string,
    params: MockParams<TData, TParams> = {},
  ) => mockRequest(url, { ...params, method: 'GET' }),
  /**
   * mock a POST request to the specified url
   * if params are passed, will throw an error if request params do not match
   * */
  post: <TData, TParams = Record<string, never>>(
    url: string,
    params: MockParams<TData, TParams> = {},
  ) => mockRequest(url, { ...params, method: 'POST' }),
  /**
   * mock a DELETE request to the specified url
   * if params are passed, will throw an error if request params do not match
   * */
  delete: <TData, TParams = Record<string, never>>(
    url: string,
    params: MockParams<TData, TParams> = {},
  ) => mockRequest(url, { ...params, method: 'DELETE' }),
};

export default mock;
