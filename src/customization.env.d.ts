/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type StepController = 'scale' | 'styling' | 'sound' | 'step';

type FontSizes = 'caption' | 'small' | 'body' | 'h5' | 'h4';

type CustomFont = Nullable<{
  family: string;
  baseSize: string;
  accentSize: string;
  baseColor: string;
  accentColor: string;
  bold: boolean;
  italic: boolean;
  shadow: boolean;
}>

type CustomStyling = Nullable<{
  boxShadow: boolean;
  optionsContainer: boolean;
  optionSelector: boolean;
  bgPictureOpacity: number;
  bgColor: string;
}>

type CustomScale = Nullable<{
  paragraphWidth: number; // %
  optionsWidth: number; // %
  imageWidth: number; // px
  imageHeight: number; // px
}>
