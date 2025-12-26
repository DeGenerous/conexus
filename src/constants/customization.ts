/* =========================================
   THEME DEFINITIONS: VOID ENERGY PALETTE
   ========================================= */

// 1. VOID (Default - Brand Identity)
export const defaultFont: CustomFont = {
  family: 'Hanken Grotesk',
  baseSize: 'body',
  accentSize: 'h5',
  baseColor: '#dedede', // Light gray for readability on dark
  accentColor: '#33e2e6', // Void Primary (Cyan)
};

export const defaultStyling: CustomStyling = {
  bgPictureOpacity: 30,
  bgColor: '#010020', // Void Canvas
};

// 2. ONYX (Minimal - OLED Dark)
export const onyxThemeFont: CustomFont = {
  family: 'Inter', // Clean, minimal sans-serif
  baseSize: 'body',
  accentSize: 'h5',
  baseColor: '#dedede', // Soft off-white
  accentColor: '#ffffff', // Onyx Primary (Pure White)
};

export const onyxThemeStyling: CustomStyling = {
  bgPictureOpacity: 10,
  bgColor: '#0a0a0a', // Onyx Canvas
};

// 3. TERMINAL (Retro - Hacker/Dev)
export const terminalThemeFont: CustomFont = {
  family: 'Courier Prime', // Monospace
  baseSize: 'body',
  accentSize: 'h5',
  baseColor: '#f5c518', // Terminal Primary (Amber) - Monochrome look
  accentColor: '#f5c518', // Same as text for true retro feel
};

export const terminalThemeStyling: CustomStyling = {
  bgPictureOpacity: 5,
  bgColor: '#050505', // Terminal Canvas
};

// 4. CRIMSON (Horror - Dark Red)
export const crimsonThemeFont: CustomFont = {
  family: 'Merriweather', // Sharp serif
  baseSize: 'body',
  accentSize: 'h5',
  baseColor: '#ffdfdf', // Pale red-white
  accentColor: '#ff6b6b', // Crimson Primary (Laser Red)
};

export const crimsonThemeStyling: CustomStyling = {
  bgPictureOpacity: 15,
  bgColor: '#180808', // Crimson Canvas
};

// 5. OVERGROWTH (Nature - Toxic Green)
export const overgrowthThemeFont: CustomFont = {
  family: 'Lora', // Rounded, organic
  baseSize: 'body',
  accentSize: 'h5',
  baseColor: '#e0f2e9', // Very light green-white
  accentColor: '#39ff14', // Nature Primary (Neon Green)
};

export const overgrowthThemeStyling: CustomStyling = {
  bgPictureOpacity: 25,
  bgColor: '#051a0a', // Nature Canvas
};

// 6. VELVET (Romance - Dark Pink)
export const velvetThemeFont: CustomFont = {
  family: 'Caveat', // Handwriting style
  baseSize: 'body', // Slightly larger for handwriting fonts
  accentSize: 'h5',
  baseColor: '#ffe6f2', // Pale pink
  accentColor: '#ff80a0', // Velvet Primary (Rose Neon)
};

export const velvetThemeStyling: CustomStyling = {
  bgPictureOpacity: 20,
  bgColor: '#1a0510', // Velvet Canvas
};

// 7. SOLAR (Fantasy - Divine/Gold)
export const solarThemeFont: CustomFont = {
  family: 'Cinzel', // Classic Fantasy Serif
  baseSize: 'body',
  accentSize: 'h5',
  baseColor: '#fff8e7', // Warm white
  accentColor: '#ffaa00', // Solar Primary (Burning Gold)
};

export const solarThemeStyling: CustomStyling = {
  bgPictureOpacity: 30,
  bgColor: '#120a00', // Solar Canvas
};

// 8. NEBULA (Arcane - Magic/Synth)
export const nebulaThemeFont: CustomFont = {
  family: 'Exo 2', // Geometric, modern
  baseSize: 'body',
  accentSize: 'h5',
  baseColor: '#ead1ff', // Light lavender
  accentColor: '#d946ef', // Nebula Primary (Fuchsia)
};

export const nebulaThemeStyling: CustomStyling = {
  bgPictureOpacity: 20,
  bgColor: '#0a0014', // Nebula Canvas
};

// 9. PAPER (Readability - Warm/Ink)
export const paperThemeFont: CustomFont = {
  family: 'PT Serif Caption', // Book print
  baseSize: 'body',
  accentSize: 'h5',
  baseColor: '#2c3e50', // Paper Energy (Deep Ink Blue) - High Contrast
  accentColor: '#8d6e63', // Structure (Leather/Sepia) for accents
};

export const paperThemeStyling: CustomStyling = {
  bgPictureOpacity: 5, // Very subtle background
  bgColor: '#faeed1', // Paper Canvas
};

// 10. LABORATORY (Clinical - Standard Light)
export const labThemeFont: CustomFont = {
  family: 'Open Sans', // Clean, sterile
  baseSize: 'body',
  accentSize: 'h5',
  baseColor: '#334155', // Dark Slate (Readable)
  accentColor: '#005bb5', // Lab Primary (Blueprint Blue)
};

export const labThemeStyling: CustomStyling = {
  bgPictureOpacity: 10,
  bgColor: '#f1f5f9', // Lab Canvas
};

// 11. PLAYGROUND (Kids - Fun/Pastel)
export const playgroundThemeFont: CustomFont = {
  family: 'Comic Neue', // Playful
  baseSize: 'body',
  accentSize: 'h5',
  baseColor: '#006064', // Dark Cyan (Readable on pastel)
  accentColor: '#ff4081', // Playground Primary (Hot Pink)
};

export const playgroundThemeStyling: CustomStyling = {
  bgPictureOpacity: 15,
  bgColor: '#e0f7fa', // Playground Canvas
};

// 12. FOCUS (Seniors - High Contrast)
export const focusThemeFont: CustomFont = {
  family: 'Inter', // Maximum legibility
  baseSize: 'body', // Larger base text
  accentSize: 'h5',
  baseColor: '#000000', // Pure Black
  accentColor: '#000000', // Pure Black (Hyper-contrast)
};

export const focusThemeStyling: CustomStyling = {
  bgPictureOpacity: 0, // No distractions
  bgColor: '#ffffff', // Pure White
};
