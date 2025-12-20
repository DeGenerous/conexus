// Providers with thier models, voices (for tts), and other constants

import { voices } from '@elevenlabs/elevenlabs-js/api';

const PROVIDER_CONFIG = {
  DEGENAI: {
    models: {
      standard: 'degenai_standard_v1',
      premium: 'degenai_premium_v1',
    },
    voices: {
      af_kore: 'af_kore',
      af_jpn: 'af_jpn',
      af_chn: 'af_chn',
      eu_esp: 'eu_esp',
      eu_fra: 'eu_fra',
      eu_ger: 'eu_ger',
      eu_ita: 'eu_ita',
      eu_rus: 'eu_rus',
      us_eng: 'us_eng',
      us_spa: 'us_spa',
    },
    response_format: ['mp3', 'wav'] as const,
  },
  ELEVENLABS: {
    models: {
      multilingual: 'eleven_multilingual_v2',
      flash: 'eleven_flash_v2_5',
    },
    voices: {
      cheerful: '9BWtsMINqrJLrRacOk9x',
      casual: 'IKne3meq5aSn9XLyUdCD',
    },
    response_format: [
      'mp3_22050_32',
      'mp3_24000_48',
      'mp3_44100_32',
      'mp3_44100_64',
      'mp3_44100_96',
      'mp3_44100_128',
      'mp3_44100_192',
      'pcm_16000',
      'pcm_22050',
      'pcm_24000',
      'pcm_44100',
    ] as const,
  },
} as const;

export type ProviderName = keyof typeof PROVIDER_CONFIG;

export function isValidProviderName(name: string): name is ProviderName {
  return Object.keys(PROVIDER_CONFIG).includes(name);
}

export default PROVIDER_CONFIG;
