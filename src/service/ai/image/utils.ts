const PROVIDER_CONFIG = {
  FAL: {
    models: {
      default: {
        id: 'fal-ai/z-image/turbo',
        dimensionType: 'size' as const,
      },
      nanobanana: {
        id: 'fal-ai/nano-banana-pro',
        dimensionType: 'aspectRatio' as const,
      },
      flux2: {
        id: 'fal-ai/flux-2',
        dimensionType: 'size' as const,
      },
      flux2kleinbase: {
        id: 'fal-ai/flux-2/klein/9b/base',
        dimensionType: 'size' as const,
      },
    },
  },
  LUMA: {
    models: {
      default: {
        id: 'photon-flash-1',
        dimensionType: 'size' as const,
      },
    },
  },
  FLUX: {
    models: {
      default: {
        id: 'flux-pro-1.1',
        dimensionType: 'size' as const,
      },
    },
  },
} as const;

export function getModelDimensions(
  provider: ProviderName,
  modelKey: string,
  dimensions: ImageDimensions,
): Record<string, unknown> {
  const model =
    PROVIDER_CONFIG[provider].models[
      modelKey as keyof (typeof PROVIDER_CONFIG)[typeof provider]['models']
    ];

  if (!model || typeof model === 'string') return dimensions;

  const dimensionType = model.dimensionType as DimensionType;

  if (dimensionType === 'aspectRatio' && 'width' in dimensions) {
    return { aspect_ratio: `${dimensions.width}:${dimensions.height}` };
  }

  if (dimensionType === 'size' && 'aspect_ratio' in dimensions) {
    // Convert aspect ratio to width/height if needed
    return dimensions;
  }

  return dimensions;
}

export type ProviderName = keyof typeof PROVIDER_CONFIG;

export function isValidProviderName(name: string): name is ProviderName {
  return Object.keys(PROVIDER_CONFIG).includes(name);
}

export default PROVIDER_CONFIG;
