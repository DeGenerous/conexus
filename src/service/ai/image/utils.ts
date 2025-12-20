const PROVIDER_CONFIG = {
  FAL: {
    models: {
      turbo: 'fal-ai/z-image/turbo',
      nanobanana: 'fal-ai/nano-banana-pro',
      flux2: 'fal-ai/flux-2',
    },
  },
  LUMA: {
    models: {
      flash: 'photon-flash-1',
    },
  },
  FLUX: {
    models: {
      standard: 'flux-pro-1.1',
    },
  },
} as const;

export type ProviderName = keyof typeof PROVIDER_CONFIG;

export function isValidProviderName(name: string): name is ProviderName {
  return Object.keys(PROVIDER_CONFIG).includes(name);
}

export default PROVIDER_CONFIG;
