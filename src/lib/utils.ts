export function buildResult(statusCode: number, body: object) {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}

export function returnSuccess(body: object) {
  return buildResult(200, body);
}

export function returnNotFound(message: string) {
  return buildResult(404, { message });
}