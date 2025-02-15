export interface PaletteType {
  primary: string;
  complementary: string;
  analogous: string[];
  triadic: string[];
  monotonal: {
    light: string;
    dark: string;
  };
  variants: {
    quiet: string;
    loud: string;
  };
}

export type Swatch = {
  role: string;
  color: string;
}