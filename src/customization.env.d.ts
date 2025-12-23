/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type StepController = 'styling' | 'sound' | 'step';

type FontSizes = 'caption' | 'small' | 'body' | 'h5' | 'h4'; // not used

type CustomFont = Nullable<{
  family: string;
  baseSize: string;
  accentSize: string;
  baseColor: string;
  accentColor: string;
  bold: boolean;
  italic: boolean;
  shadow: boolean;
}>;

type CustomStyling = Nullable<{
  bgPictureOpacity: number;
  bgColor: string;
}>;

type CustomTheme = {
  name: string;
  font: CustomFont;
  styling: CustomStyling;
  standard?: boolean;
};
