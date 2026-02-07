/**
 * AI service layer types.
 * Image generation, text-to-speech, and provider retry configuration.
 */

// ---------------------------------------------------------------------------
// Request Context
// ---------------------------------------------------------------------------

/** Provider routing and retry context attached to AI service requests. */
type RequestContext = {
  /** Whether to select a specific provider or fall back to the next. */
  option: 'select' | 'fallback';
  provider?: string;
  model?: string;

  /** Trace ID shared across retry attempts. */
  requestId?: string;
  /** Current retry attempt (0-based). */
  attempt?: number;
  /** Maximum number of retries. */
  retries?: number;
  /** Interval in ms between job status polls. */
  pollIntervalMs?: number;
};

/** Retry policy options. */
type RetryOptions = {
  retries?: number;
};

// ---------------------------------------------------------------------------
// Text-to-Speech
// ---------------------------------------------------------------------------

/** Supported audio codecs. */
type AudioFormat = 'mp3' | 'wav';

/** Supported audio sample rates (Hz). */
type SampleRate = 22050 | 24000 | 44100 | 48000;

/** Configuration for text-to-speech generation. */
type TTSOptions = {
  voice?: string;
  /** Delivery style (e.g. "narration", "conversational"). */
  delivery?: string;
  speed?: number;
  format?: {
    codec: AudioFormat;
    sampleRate: SampleRate;
    bitrate?: number;
  };
};

// ---------------------------------------------------------------------------
// Image Generation
// ---------------------------------------------------------------------------

/** Options for image generation requests. */
type ImageOptions = {
  dimensions?: ImageDimensions;
};

/** Generated image payload. */
type ImageResult = {
  /** Base64 string or URL depending on imageType. */
  data: string;
  imageType: ImageType;
};

/** Initial image generation response — immediate result or async job. */
type ImageStartResult =
  | { kind: 'ready'; image: ImageResult }
  | { kind: 'job'; id: string };

/** Polling result for an async image generation job. */
type ImageStatusResult =
  | { status: 'pending' }
  | { status: 'ready'; image: ImageResult }
  | { status: 'failed' };

/** AI image model descriptor. */
type ImageModel = {
  id: string;
  dimensionType: DimensionType;
};

/** How a model accepts dimensions. */
type DimensionType = 'size' | 'aspectRatio';

/** Image dimensions — either explicit pixels or an aspect ratio string. */
type ImageDimensions =
  | { width: number; height: number }
  | { aspect_ratio: string };
