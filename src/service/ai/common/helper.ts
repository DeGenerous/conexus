async function withRetry<T>(
  fn: (ctx: RequestContext) => Promise<T>,
  baseCtx: RequestContext,
  retries = 2,
): Promise<T> {
  console.log(`withRetry: retries=${retries}`);
  
  let lastErr: unknown;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn({ ...baseCtx, attempt: i });
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr;
}
