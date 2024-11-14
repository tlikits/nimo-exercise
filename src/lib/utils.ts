export function buildResult(statusCode: number, body: object) {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'Access-Control-Allow-Headers' : 'Content-Type, authorization, accept, x-api-key',
      'Access-Control-Allow-Origin': '*', // Allow from anywhere
      'Access-Control-Allow-Methods': 'GET', // Allow only GET request
      'Access-Control-Allow-Credentials': true
    },
  };
}

export function returnSuccess(body: object) {
  return buildResult(200, body);
}

export function returnCreateSuccess(body: object) {
  return buildResult(201, body);
}

export function returnClientError(message: string, errorMessage: string) {
  return buildResult(400, { message, error: errorMessage });
}

export function returnNotFound(message: string) {
  return buildResult(404, { message });
}

export function returnServerError(message: string, error: Error) {
  return buildResult(500, { message, error: (error as Error).message });
}
