import { apiRoutes } from '@/lib/consts'

const useApi = () => {
  const base = async (endpoint: string, method: 'get'| 'post', body?: any, queryParams?: Record<string, string | number | boolean>) => {
    // construct url with query params
    const url = new URL(`${apiRoutes.base}/api/v1${endpoint}`)

    if (queryParams) {
      Object.keys(queryParams).forEach(key => queryParams[key] && url.searchParams.append(key, queryParams[key].toString()))
    }

    const options = {
      method,
      headers: {},
    };

    if (body) {
      options.body = JSON.stringify(body);
      options.headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      return data
    } catch (e) {
      throw e
    }
  }

  const get = (endpoint: string, queryParams?) => base(endpoint, 'get', undefined, queryParams);

  const post = (endpoint: string, body?, queryParams?) => base(endpoint, 'post', body, queryParams);

  return {
    get,
    post
  }
}

export default useApi
