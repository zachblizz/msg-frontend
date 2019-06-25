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

  return fetch(`https://msg-backend.herokuapp.com/api/${endpoint}`, config)
    .then(r => r.json())
}

export default client
