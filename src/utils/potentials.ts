function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

export function normalizeMeta(data: OmnihubData): PotentialMeta | undefined {
  if (data.nft) {
    const meta = data.nft.meta_data ?? {};
    return {
      rank: typeof meta['rank'] === 'string' ? meta['rank'] : undefined,
      nft_count: toNumber(meta['nft_count']),
      total_level: toNumber(meta['total_level']),
    };
  }

  // tokens might have different meta later
  return undefined;
}
