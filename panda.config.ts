import { defineConfig, defineSemanticTokens, defineTokens } from "@pandacss/dev";

const sizes = {
  full: { value: '100%' },
  min: { value: 'min-content' },
  max: { value: 'max-content' },
  fit: { value: 'fit-content' },
}

const fontSizes = defineTokens.fontSizes({
  '2xs': { value: '0.5rem' },
  xs: { value: '0.75rem' },
  sm: { value: '0.875rem' },
  md: { value: '1rem' },
  lg: { value: '1.125rem' },
  xl: { value: '1.25rem' },
  '2xl': { value: '1.5rem' },
  '3xl': { value: '1.875rem' },
  '4xl': { value: '2.25rem' },
  '5xl': { value: '3rem' },
  '6xl': { value: '3.75rem' },
  '7xl': { value: '4.5rem' },
  '8xl': { value: '6rem' },
  '9xl': { value: '8rem' },
})

const fontWeights = defineTokens.fontWeights({
  thin: { value: '100' },
  extralight: { value: '200' },
  light: { value: '300' },
  normal: { value: '400' },
  medium: { value: '500' },
  semibold: { value: '600' },
  bold: { value: '700' },
  extrabold: { value: '800' },
  black: { value: '900' },
})

const zIndex = defineTokens.zIndex({
  hide: {
    value: -1,
  },
  base: {
    value: 0,
  },
  dropdown: {
    value: 1000,
  },
  backdrop: {
    value: 1300,
  },
  sidepanel: {
    value: 1350,
  },
  modal: {
    value: 1400,
  },
  popover: {
    value: 1500,
  },
  toast: {
    value: 1700,
  },
  tooltip: {
    value: 1800,
  },
});

const shadows = defineSemanticTokens.shadows({
  xs: {
    value: {
      base: '0px 0px 1px 0px #425DA133'
    },
  },
  sm: {
    value: {
      base: '0px 0px 2px 0px #425DA133',
    },
  },
  md: {
    value: {
      base: '0px 0px 4px 0px #425DA133',
    },
  },
  lg: {
    value: {
      base: '0px 0px 8px 0px #425DA133',
    },
  },
  xl: {
    value: {
      base: '0px 0px 16px 0px #425DA133',
    },
  },
  '2xl': {
    value: {
      base: '0px 0px 24px 0px #425DA133',
    },
  },
})

const radii = defineSemanticTokens.radii({
  none: {
    value: 'none'
  },
  xs: {
    value: '2px'
  },
  sm: {
    value: '4px'
  },
  md: {
    value: '8px'
  },
  lg: {
    value: '16px'
  },
  full: {
    value: '9999px'
  }
})

const tokens = defineTokens({
  sizes,
  zIndex,
  fontSizes,
  fontWeights
})

const semanticTokens = defineSemanticTokens({
  shadows,
  radii
})

const conditions = {
  extend: {
    hidden: '&:is([hidden])'
  },
}


export default defineConfig({
  // Whether to use css reset
  preflight: true,

  hash: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: tokens,
      semanticTokens: semanticTokens,
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      }
    }
  },

  conditions,

  jsxFramework: 'react',

  // The output directory for your css system
  outdir: "styled-system",

  presets: []
});
