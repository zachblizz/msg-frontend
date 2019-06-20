function client(endpoint, {body, ...customConfig} = {}) {
  const headers = {'content-type': 'application/json'}
  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  return fetch(`http://localhost:8080/api/${endpoint}`, config)
    .then(r => r.json())
}

export default client
