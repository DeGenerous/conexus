export async function withRetry<T>(
  fn: (ctx: RequestContext) => Promise<T>,
  baseCtx: RequestContext,
  options: RetryOptions = {},
): Promise<T> {
  const retries = options.retries ?? 2;

  let lastErr: unknown;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn({ ...baseCtx, attempt: i });
    } catch (err) {
      lastErr = err;
    }
  }

  if (lastErr instanceof Error) {
    throw lastErr;
  } else {
    throw new Error(
      `withRetry: ${lastErr !== undefined ? String(lastErr) : 'Unknown error'}`,
    );
  }
}
