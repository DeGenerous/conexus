const PROVIDER_CONFIG = {
  FAL: {
    models: {
      default: 'fal-ai/z-image/turbo',
      nanobanana: 'fal-ai/nano-banana-pro',
      flux2: 'fal-ai/flux-2',
    },
  },
  LUMA: {
    models: {
      default: 'photon-flash-1',
    },
  },
  FLUX: {
    models: {
      default: 'flux-pro-1.1',
    },
  },
} as const;

export type ProviderName = keyof typeof PROVIDER_CONFIG;

export function isValidProviderName(name: string): name is ProviderName {
  return Object.keys(PROVIDER_CONFIG).includes(name);
}

export default PROVIDER_CONFIG;
