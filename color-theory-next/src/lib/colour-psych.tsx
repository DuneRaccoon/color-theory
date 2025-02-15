import chroma from 'chroma-js';
import { PaletteType } from '@/lib/types';

/**
 * 2. Primary & Secondary Color Psychology Descriptions
 * Returns a main text and a secondary text for further nuance.
 */
export function getColorPsychologyDescription(color: chroma.Color) {
  const hue = color.get('hsl.h');

  // Helper: define a struct with { primaryImpact, secondaryImpact }
  const desc = (primaryImpact: string, secondaryImpact: string) => ({ primaryImpact, secondaryImpact });

  if (hue >= 0 && hue < 20) {
    return desc(
      'Reds can convey intensity, passion, and energy. They draw strong attention, often used for bold branding or urgent calls to action. Red can stimulate appetite, making it popular in food-related branding.',
      'Secondarily, red may also evoke impulsiveness or aggression if overused, so balance is key. Subtle usage can reinforce a sense of power, strength, or urgency.'
    );
  } else if (hue >= 20 && hue < 50) {
    return desc(
      'Oranges and deeper warm yellows radiate enthusiasm, optimism, and creativity. They can add fun or adventure to a brand and encourage feelings of confidence.',
      'Additionally, these hues can cultivate a sense of friendliness and approachability, but too much saturation may appear unprofessional or overwhelming.'
    );
  } else if (hue >= 50 && hue < 70) {
    return desc(
      'Bright yellows signify cheerfulness, friendliness, and clarity. They catch the eye quickly and spark positivity, but can become fatiguing if overused.',
      'On another level, yellows can also symbolize caution (think of safety signs). When toned down, they bring warmth and accessibility to a design.'
    );
  } else if (hue >= 70 && hue < 170) {
    return desc(
      'Greens symbolize growth, balance, and nature. They create a sense of tranquility or environmental awareness, frequently used in health, eco-friendly, or outdoor-related brands.',
      'They can also suggest wealth or stability (especially deeper greens), tying them well to financial services. Overly bright greens can become neon and less “natural.”'
    );
  } else if (hue >= 170 && hue < 250) {
    return desc(
      'Blues carry associations with trust, stability, and calmness. They’re a top choice for businesses seeking a reliable and secure image, particularly in technology and finance.',
      'Light blues evoke tranquility or freedom (like a clear sky), while dark blues can appear authoritative or professional. Overusing dark blues may feel conservative or cold.'
    );
  } else if (hue >= 250 && hue < 290) {
    return desc(
      'Purples blend the calmness of blue with the energy of red, often seen as luxurious, creative, or spiritual. They’re popular for brands wanting elegance or imagination.',
      'Lighter lavenders lean toward delicate, romantic feelings, whereas very dark purples may suggest opulence or mystery. Too much purple can seem childish or overly eccentric.'
    );
  } else if (hue >= 290 && hue < 330) {
    return desc(
      'Pinks and magentas can represent romance, youthfulness, or edgy flair. They’re often used in fashion, beauty, or playful brands seeking a vibrant, energetic vibe.',
      'Hot pink especially grabs attention and fosters a sense of excitement or fun, but can become overwhelming. Softer pinks imply tenderness or compassion.'
    );
  } else {
    // covers hue >= 330 < 360
    return desc(
      'Deep reds and crimsons can symbolize power, passion, and refinement. They can be used for a dramatic effect or to impart a bold, luxurious statement.',
      'They can also lean toward romance or emotional intensity. Be mindful of cultural associations with red, which may vary widely around the globe.'
    );
  }
}

/**
 * 3. Generate Palette
 * Applies basic color theory expansions from the base color.
 */
export function generatePalette(baseColor: chroma.Color) {
  const primary = baseColor.hex();
  const comp = baseColor.set('hsl.h', (baseColor.get('hsl.h') + 180) % 360).hex();
  const analogous1 = baseColor.set('hsl.h', (baseColor.get('hsl.h') + 30) % 360).hex();
  const analogous2 = baseColor.set('hsl.h', (baseColor.get('hsl.h') - 30 + 360) % 360).hex();
  const triadic1 = baseColor.set('hsl.h', (baseColor.get('hsl.h') + 120) % 360).hex();
  const triadic2 = baseColor.set('hsl.h', (baseColor.get('hsl.h') + 240) % 360).hex();

  const lightShade = chroma.mix(primary, 'white', 0.5, 'lab').hex();
  const darkShade = chroma.mix(primary, 'black', 0.5, 'lab').hex();

  const quiet = baseColor.set('hsl.s', Math.max(baseColor.get('hsl.s') - 0.3, 0)).hex();
  const loud = baseColor.set('hsl.s', Math.min(baseColor.get('hsl.s') + 0.3, 1)).hex();

  return {
    primary,
    complementary: comp,
    analogous: [analogous1, analogous2],
    triadic: [triadic1, triadic2],
    monotonal: { light: lightShade, dark: darkShade },
    variants: { quiet, loud },
  };
}

/**
 * 4. Role Usage Explanation
 */
export function getRoleUsageExplanation(role: string) {
  switch (role) {
    case 'Primary':
      return (
        'Primary color: The main brand identifier—used for your logo, key headers, and any element reflecting the core brand character.'
      );
    case 'Complementary':
      return (
        'Complementary color: Opposite on the wheel. Use for accent elements or calls-to-action that need to pop.'
      );
    case 'Analogous 1':
      return (
        'Analogous color (first): Neighbor to the primary hue, ensuring cohesive, harmonious design. Great for backgrounds or subtle highlights.'
      );
    case 'Analogous 2':
      return (
        'Analogous color (second): Another neighbor to maintain brand unity. Works well for sidebars or alternate sections.'
      );
    case 'Triadic 1':
      return (
        'Triadic color #1: Part of a vibrant trio spaced evenly around the wheel. Inject energy in headings or promotional labels.'
      );
    case 'Triadic 2':
      return (
        'Triadic color #2: Another hue in the triad. Great for interactive elements, hover states, or secondary CTAs.'
      );
    case 'Light Shade':
      return (
        'Light shade: A softer tint of your main hue. Useful for large background areas or high readability.'
      );
    case 'Dark Shade':
      return (
        'Dark shade: A deeper tone for strong contrast. Perfect for footers, header bars, or bold text overlays.'
      );
    case 'Loud Variant':
      return (
        'Loud variant: A fully saturated hue. Use sparingly for urgent notices or a prominent “Buy Now” button.'
      );
    default:
      return 'No usage data found.';
  }
}

/**
 * 5. Build array of 9 swatch objects
 */
export function buildSwatchesData(palette: PaletteType) {
  return [
    { role: 'Primary', color: palette.primary },
    { role: 'Complementary', color: palette.complementary },
    { role: 'Analogous 1', color: palette.analogous[0] },
    { role: 'Analogous 2', color: palette.analogous[1] },
    { role: 'Triadic 1', color: palette.triadic[0] },
    { role: 'Triadic 2', color: palette.triadic[1] },
    { role: 'Light Shade', color: palette.monotonal.light },
    { role: 'Dark Shade', color: palette.monotonal.dark },
    { role: 'Loud Variant', color: palette.variants.loud },
  ];
}
