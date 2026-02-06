/**
 * Customization types.
 * Theme styling, fonts, and step controller modes for story playback.
 */

/** In-game settings panel tabs. */
type StepController = 'styling' | 'sound' | 'step';

/** Font override configuration for story rendering. */
type CustomFont = Nullable<{
  family: string;
  /** Base font size (e.g. "16px"). */
  baseSize: string;
  /** Accent/heading font size. */
  accentSize: string;
  baseColor: string;
  accentColor: string;
}>;

/** Background styling overrides for story rendering. */
type CustomStyling = Nullable<{
  bgPictureOpacity: number;
  bgColor: string;
}>;

/** A named theme combining font and background styling. */
type CustomTheme = {
  name: string;
  font: CustomFont;
  styling: CustomStyling;
  /** True for built-in (non-removable) themes. */
  standard?: boolean;
};
