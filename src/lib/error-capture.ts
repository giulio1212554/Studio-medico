let lastError: unknown = null;

export function captureError(error: unknown) {
  lastError = error;
  console.error(error);
}

export function consumeLastCapturedError() {
  const e = lastError;
  lastError = null;
  return e;
}
