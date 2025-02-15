import React, { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { themeOptions } from './constants';
import './App.css';

/**
 * 2. Primary & Secondary Color Psychology Descriptions
 * Returns a main text and a secondary text for further nuance.
 */
function getColorPsychologyDescription(color) {
  const hue = color.get('hsl.h');

  // Helper: define a struct with { primaryImpact, secondaryImpact }
  const desc = (primaryImpact, secondaryImpact) => ({ primaryImpact, secondaryImpact });

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
function generatePalette(baseColor) {
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
function getRoleUsageExplanation(role) {
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
function buildSwatchesData(palette) {
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

/**
 * 6. SETTINGS PANEL
 */
const ColorInputPanel = ({
  colorValue,
  onColorChange,
  theme,
  onThemeChange,
  useWhiteBase,
  onToggleWhiteBase
}) => {
  const handleThemeSelect = (e) => {
    const selectedValue = e.target.value;
    onThemeChange(selectedValue);
  };

  const handleColorChange = (e) => {
    onColorChange(e.target.value);
  };

  const handleWhiteBaseToggle = (e) => {
    onToggleWhiteBase(e.target.checked);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-700">Choose Base Color / Theme</h2>

      <div className="flex items-center gap-2">
        <label className="font-semibold" htmlFor="themeSelect">
          Preset Theme:
        </label>
        <select
          id="themeSelect"
          value={theme}
          onChange={handleThemeSelect}
          className="border rounded px-2 py-1"
        >
          {themeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="font-semibold" htmlFor="colorPicker">
          Base Color:
        </label>
        <input
          id="colorPicker"
          type="color"
          disabled={theme !== 'custom'}
          value={colorValue}
          onChange={handleColorChange}
          className={`h-8 w-16 border rounded ${
            theme === 'custom' ? 'cursor-pointer' : 'cursor-not-allowed'
          }`}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="whiteBaseToggle"
          checked={useWhiteBase}
          onChange={handleWhiteBaseToggle}
        />
        <label className="font-semibold" htmlFor="whiteBaseToggle">
          Use White Base Layout
        </label>
      </div>
    </div>
  );
};

/**
 * 7. PALETTE DISPLAY & Explanation
 */
const PaletteDisplay = ({ palette, baseColor, onSwatchClick }) => {
  const swatches = buildSwatchesData(palette);
  const { primaryImpact } = getColorPsychologyDescription(baseColor);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-700">Color Palette & Explanation</h2>

      {/* SWATCHES ROW */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {swatches.map((s) => (
          <button
            key={s.role}
            onClick={() => onSwatchClick(s)}
            className="relative h-16 rounded shadow-sm hover:scale-105 transition-transform"
            style={{ backgroundColor: s.color }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium drop-shadow-md">
              {s.role}
            </span>
          </button>
        ))}
      </div>

      {/* BASE COLOR PSYCHOLOGY */}
      <div>
        <h4 className="text-lg font-medium text-gray-600 mb-1">
          Psychological Impact of Your Base Color
        </h4>
        <p className="text-sm leading-relaxed text-gray-700">{primaryImpact}</p>
      </div>
    </div>
  );
};

/**
 * 8. COLOR DETAILS PANEL
 */
const ColorDetailsPanel = ({ selectedSwatch }) => {
  if (!selectedSwatch) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-700">Color Details</h2>
        <p className="text-gray-600">Select a swatch above to see details.</p>
      </div>
    );
  }

  const { role, color } = selectedSwatch;
  const usageText = getRoleUsageExplanation(role);
  const colorObj = chroma(color);
  const { primaryImpact, secondaryImpact } = getColorPsychologyDescription(colorObj);

  const hsl = colorObj.hsl().map((val, i) => {
    if (i === 0) return `${Math.round(val)}°`;
    return `${Math.round(val * 100)}%`;
  });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-700">Color Details</h2>

      <div
        className="w-full h-20 rounded flex items-center justify-center text-white text-lg font-bold shadow-md"
        style={{ backgroundColor: color }}
      >
        {role}
      </div>

      <div className="text-sm text-gray-700 space-y-2 leading-relaxed">
        <p><strong>Hex:</strong> {color}</p>
        <p><strong>HSL:</strong> h: {hsl[0]}, s: {hsl[1]}, l: {hsl[2]}</p>
        <p><strong>Usage Advice:</strong> {usageText}</p>
        <p><strong>Primary Psych Impact:</strong> {primaryImpact}</p>
        <p><strong>Secondary Psych Impact:</strong> {secondaryImpact}</p>
      </div>
    </div>
  );
};

/**
 * 9. EXTENDED SITE PREVIEW
 * This version truly toggles to a mostly white layout if "useWhiteBase" is on.
 */
const MockSitePreview = ({ palette, useWhiteBase }) => {
  // We'll define some base colors that differ based on the toggle.
  // White base => mostly #fff or near white sections, with brand accent in nav or CTA.
  const navBg = useWhiteBase ? palette.primary : palette.primary;
  const navTextColor = chroma.contrast(navBg, 'black') > 4.5 ? 'black' : 'white';

  const heroBg = useWhiteBase ? '#fff' : palette.monotonal.light;
  const heroTextColor = chroma.contrast(heroBg, 'black') > 4.5 ? 'black' : 'white';

  const featuresBg = useWhiteBase ? '#fafafa' : palette.analogous[0];
  const featuresTextColor = chroma.contrast(featuresBg, 'black') > 4.5 ? 'black' : 'white';

  const testimonialBg = useWhiteBase ? '#fefefe' : palette.triadic[0];
  const testimonialTextColor = chroma.contrast(testimonialBg, 'black') > 4.5 ? 'black' : 'white';

  const ctaBg = useWhiteBase ? palette.complementary : palette.variants.loud;
  const ctaTextColor = chroma.contrast(ctaBg, 'black') > 4.5 ? 'black' : 'white';

  const footerBg = useWhiteBase ? '#f8f9fa' : palette.darkShade;
  const footerTextColor = chroma.contrast(footerBg, 'black') > 4.5 ? 'black' : 'white';

  // For the hero button
  const heroCtaBg = useWhiteBase ? palette.complementary : palette.monotonal.dark;
  const heroCtaColor = chroma.contrast(heroCtaBg, 'black') > 4.5 ? 'black' : 'white';

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-700">Full Example Site Preview</h2>

      <div className="border border-gray-300 rounded shadow overflow-hidden flex flex-col">
        {/* NAVIGATION */}
        <nav
          className="flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: navBg, color: navTextColor }}
        >
          <h1 className="font-bold text-xl">My Brand</h1>
          <ul className="flex gap-6 text-sm font-medium">
            <li className="hover:opacity-80 cursor-pointer">Home</li>
            <li className="hover:opacity-80 cursor-pointer">Features</li>
            <li className="hover:opacity-80 cursor-pointer">About</li>
            <li className="hover:opacity-80 cursor-pointer">Contact</li>
          </ul>
        </nav>

        {/* HERO SECTION */}
        <section
          className="p-10 text-center"
          style={{ backgroundColor: heroBg, color: heroTextColor }}
        >
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Empower Your Business</h2>
            <p className="mb-6">
              Welcome to our platform, where innovative solutions come together
              to boost your success.
            </p>
            <button
              className="px-6 py-3 rounded font-semibold hover:opacity-90 transition"
              style={{ backgroundColor: heroCtaBg, color: heroCtaColor }}
            >
              Get Started
            </button>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section
          className="p-8"
          style={{ backgroundColor: featuresBg, color: featuresTextColor }}
        >
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">Our Core Features</h2>
            <p className="mb-6">Experience unrivaled quality, performance, and design.</p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white/20 rounded shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Speed</h3>
                <p className="text-sm">
                  Blazing fast performance to handle your daily tasks with ease.
                </p>
              </div>
              <div className="p-4 bg-white/20 rounded shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Security</h3>
                <p className="text-sm">
                  Bank-grade encryption and advanced protection for all your data.
                </p>
              </div>
              <div className="p-4 bg-white/20 rounded shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Design</h3>
                <p className="text-sm">
                  Clean, intuitive interfaces that elevate user experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL SECTION */}
        <section
          className="p-8 text-center"
          style={{ backgroundColor: testimonialBg, color: testimonialTextColor }}
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">What Our Clients Say</h2>
            <blockquote className="italic text-lg mb-3">
              "A game-changer! Our productivity soared, and our customers love
              the seamless experience."
            </blockquote>
            <cite className="block text-sm text-gray-700/80">
              - A Satisfied Customer
            </cite>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section
          className="p-10 text-center"
          style={{ backgroundColor: ctaBg, color: ctaTextColor }}
        >
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Transform Your Operations?
            </h2>
            <p className="mb-6">Sign up today and see why thousands trust our platform.</p>
            <button
              className="px-6 py-3 rounded font-semibold hover:opacity-90 transition"
              style={{ backgroundColor: footerBg, color: footerTextColor }}
            >
              Start Free Trial
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          className="text-center py-4 mt-auto"
          style={{ backgroundColor: footerBg, color: footerTextColor }}
        >
          <p className="text-sm">&copy; 2025 MyBrand Inc. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

/**
 * 10. MAIN APP
 */
export default function App() {
  const [theme, setTheme] = useState('custom');
  const [colorValue, setColorValue] = useState('#1E90FF');
  const [baseColor, setBaseColor] = useState(chroma('#1E90FF'));
  const [palette, setPalette] = useState(generatePalette(baseColor));
  const [useWhiteBase, setUseWhiteBase] = useState(false);

  const [selectedSwatch, setSelectedSwatch] = useState(null);

  // When theme changes, update the color to the theme base
  useEffect(() => {
    if (theme !== 'custom') {
      const found = themeOptions.find((opt) => opt.value === theme);
      if (found) {
        setColorValue(found.base);
        setBaseColor(chroma(found.base));
      }
    }
  }, [theme]);

  // If we are in "custom," watch for color changes
  useEffect(() => {
    if (theme === 'custom') {
      setBaseColor(chroma(colorValue));
    }
  }, [colorValue, theme]);

  // Re-generate palette whenever the base color changes
  useEffect(() => {
    setPalette(generatePalette(baseColor));
  }, [baseColor]);

  // Click on a swatch
  const handleSwatchClick = (swatchObj) => {
    setSelectedSwatch(swatchObj);
  };

  return (
    <div className="max-w-[1400px] mx-auto p-5">
      <div
        className="grid grid-rows-[auto_auto_1fr] grid-cols-[400px_1fr] gap-5"
        style={{ minHeight: '80vh' }}
      >
        {/* SETTINGS (Top Left) */}
        <div className="bg-white border border-gray-200 rounded shadow p-5 flex flex-col gap-4"
             style={{ gridArea: 'settings' }}>
          <ColorInputPanel
            colorValue={colorValue}
            onColorChange={setColorValue}
            theme={theme}
            onThemeChange={setTheme}
            useWhiteBase={useWhiteBase}
            onToggleWhiteBase={setUseWhiteBase}
          />
        </div>

        {/* PALETTE DISPLAY (Second row, left) */}
        <div className="bg-white border border-gray-200 rounded shadow p-5 flex flex-col gap-4"
             style={{ gridArea: 'palette' }}>
          <PaletteDisplay
            palette={palette}
            baseColor={baseColor}
            onSwatchClick={handleSwatchClick}
          />
        </div>

        {/* COLOR DETAILS (Third row, left) */}
        <div className="bg-white border border-gray-200 rounded shadow p-5 flex flex-col gap-4"
             style={{ gridArea: 'details' }}>
          <ColorDetailsPanel selectedSwatch={selectedSwatch} />
        </div>

        {/* SITE PREVIEW (Right column, spans all rows) */}
        <div className="bg-white border border-gray-200 rounded shadow p-5 flex flex-col gap-4"
             style={{ gridArea: 'preview' }}>
          <MockSitePreview palette={palette} useWhiteBase={useWhiteBase} />
        </div>
      </div>
    </div>
  );
}
