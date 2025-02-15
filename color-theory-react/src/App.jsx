import React, { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import './App.css';
import { themeOptions } from './constants'; 

// ---------------------------------------------------
// 2. COLOR PSYCHOLOGY: Provides a broad psychological
//    description based on the hue of the base color.
// ---------------------------------------------------
function getColorPsychologyDescription(color) {
  const hue = color.get('hsl.h');
  if (hue >= 0 && hue < 20) {
    return (
      'Reds can convey intensity, passion, and energy. They draw strong attention, ' +
      'often used for bold branding, urgent calls to action, or to evoke excitement. ' +
      'Red also can stimulate appetite, making it popular in food-related branding.'
    );
  } else if (hue >= 20 && hue < 50) {
    return (
      'Oranges and deeper warm yellows radiate enthusiasm, optimism, and creativity. ' +
      'They can add a sense of fun or adventure to a brand and encourage feelings of confidence.'
    );
  } else if (hue >= 50 && hue < 70) {
    return (
      'Bright yellows signify cheerfulness, friendliness, and clarity. ' +
      'They catch the eye quickly, often used to spark happiness or positivity, but can become fatiguing if overused.'
    );
  } else if (hue >= 70 && hue < 170) {
    return (
      'Greens often symbolize growth, balance, and nature. They create a sense of tranquility or environmental awareness, ' +
      'frequently used in health, eco-friendly, or outdoor-related brands.'
    );
  } else if (hue >= 170 && hue < 250) {
    return (
      'Blues carry associations with trust, stability, and calmness. They’re a top choice for businesses seeking a reliable and secure image, ' +
      'particularly in technology, finance, and healthcare.'
    );
  } else if (hue >= 250 && hue < 290) {
    return (
      'Purples blend the calmness of blue with the energy of red, often seen as luxurious, creative, or spiritual. ' +
      'They’re popular for brands wanting to convey elegance or imagination.'
    );
  } else if (hue >= 290 && hue < 330) {
    return (
      'Pinks and magentas can represent romance, youthfulness, or cutting-edge flair. ' +
      'They are often used in fashion, beauty, or playful brands seeking a vibrant, energetic vibe.'
    );
  } else {
    // covers hue >= 330 < 360
    return (
      'Deep reds and crimsons can symbolize power, passion, and refinement. ' +
      'They can be used for a dramatic effect or to impart a bold, luxurious statement.'
    );
  }
}

// ---------------------------------------------------
// 3. GENERATE PALETTE using basic color theory
// ---------------------------------------------------
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

// ---------------------------------------------------
// 4. ROLE USAGE EXPLANATIONS (for swatches)
// ---------------------------------------------------
function getRoleUsageExplanation(role) {
  switch (role) {
    case 'Primary':
      return (
        'Primary color: The main brand identifier—used for your logo, key headers, ' +
        'and any element that needs to reflect the brand’s core character.'
      );
    case 'Complementary':
      return (
        'Complementary color: Direct opposite on the color wheel. ' +
        'Use for accent elements or calls-to-action that need to pop against the primary color.'
      );
    case 'Analogous 1':
      return (
        'Analogous color (first): Neighbor to the primary hue for cohesive, ' +
        'harmonious designs—great for backgrounds, icons, or subtle highlights.'
      );
    case 'Analogous 2':
      return (
        'Analogous color (second): Another neighbor to maintain brand unity. ' +
        'Use it for sidebars, alternate backgrounds, or supportive text blocks.'
      );
    case 'Triadic 1':
      return (
        'Triadic color #1: Part of a vibrant trio spaced evenly around the color wheel. ' +
        'Injects energy into headings, buttons, or promotional labels.'
      );
    case 'Triadic 2':
      return (
        'Triadic color #2: Another hue in the triad. ' +
        'Great for interactive elements, hover states, or secondary CTAs to diversify the palette.'
      );
    case 'Light Shade':
      return (
        'Light shade: A softer tint of your main hue. Useful for backgrounds, large areas, ' +
        'or sections needing high readability with a gentle brand touch.'
      );
    case 'Dark Shade':
      return (
        'Dark shade: A deeper tone for strong contrast. Perfect for footers, ' +
        'header bars, or bold text overlays.'
      );
    case 'Loud Variant':
      return (
        'Loud variant: A fully saturated version of the hue. ' +
        'Use sparingly for maximum impact—like urgent notices or a prominent “Buy Now” button.'
      );
    default:
      return 'No usage data found.';
  }
}

// ---------------------------------------------------
// 5. BUILD ARRAY OF 9 SWATCH OBJECTS
// ---------------------------------------------------
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

// ---------------------------------------------------
// 6. SETTINGS PANEL
//    - Dropdown for theme
//    - Color picker for custom
//    - Toggle "Use White Base" for site preview
// ---------------------------------------------------
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
    <div className="color-input-panel">
      <h2 className="panel-title">Choose Base Color / Theme</h2>

      {/* THEME DROPDOWN */}
      <div className="input-group">
        <label className="label" htmlFor="themeSelect">
          Preset Theme:
        </label>
        <select
          id="themeSelect"
          value={theme}
          onChange={handleThemeSelect}
        >
          {themeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* COLOR PICKER (ONLY ACTIVE FOR "CUSTOM") */}
      <div className="input-group">
        <label className="label" htmlFor="colorPicker">
          Base Color:
        </label>
        <input
          id="colorPicker"
          type="color"
          disabled={theme !== 'custom'}
          value={colorValue}
          onChange={handleColorChange}
        />
      </div>

      {/* TOGGLE WHITE BASE FOR PREVIEW */}
      <div className="input-group toggle-row">
        <input
          type="checkbox"
          id="whiteBaseToggle"
          checked={useWhiteBase}
          onChange={handleWhiteBaseToggle}
        />
        <label className="label" htmlFor="whiteBaseToggle">
          Use White Base Layout
        </label>
      </div>
    </div>
  );
};

// ---------------------------------------------------
// 7. PALETTE DISPLAY & Explanation
//    - 9 swatches row (clickable)
//    - Color psychology text
// ---------------------------------------------------
const PaletteDisplay = ({ palette, baseColor, onSwatchClick }) => {
  const swatches = buildSwatchesData(palette);
  const psychologyText = getColorPsychologyDescription(baseColor);

  return (
    <div className="palette-container">
      <h2 className="panel-title">Color Palette & Explanation</h2>

      {/* SWATCHES ROW (CLICKABLE) */}
      <div className="swatches-row">
        {swatches.map((s) => (
          <div
            key={s.role}
            className="swatch-box"
            style={{ backgroundColor: s.color }}
            onClick={() => onSwatchClick(s)}
          >
            <div className="swatch-label">{s.role}</div>
          </div>
        ))}
      </div>

      {/* BASE COLOR PSYCHOLOGY */}
      <div className="psychology-section">
        <h4>Psychological Impact of Your Base Color</h4>
        <p>{psychologyText}</p>
      </div>
    </div>
  );
};

// ---------------------------------------------------
// 8. COLOR DETAILS PANEL
//    - Shows more info about a clicked swatch
// ---------------------------------------------------
const ColorDetailsPanel = ({ selectedSwatch }) => {
  if (!selectedSwatch) {
    return (
      <div className="color-details-panel">
        <h2 className="panel-title">Color Details</h2>
        <p>Select a swatch above to see details.</p>
      </div>
    );
  }

  const { role, color } = selectedSwatch;
  const usageText = getRoleUsageExplanation(role);
  const colorObj = chroma(color);
  const psychologyText = getColorPsychologyDescription(colorObj);
  const hslString = colorObj.hsl().map((val, i) => {
    // Format H, S, L with some rounding
    if (i === 0) return `${Math.round(val)}°`;
    if (i > 0) return `${Math.round(val * 100)}%`;
    return val;
  });

  return (
    <div className="color-details-panel">
      <h2 className="panel-title">Color Details</h2>
      <div
        className="detail-swatch"
        style={{ backgroundColor: color }}
      >
        <span>{role}</span>
      </div>
      <div className="detail-info">
        <p><strong>Hex:</strong> {color}</p>
        <p><strong>HSL:</strong> h: {hslString[0]}, s: {hslString[1]}, l: {hslString[2]}</p>
        <p><strong>Usage Advice:</strong> {usageText}</p>
        <p><strong>Psychological Impact:</strong> {psychologyText}</p>
      </div>
    </div>
  );
};

// ---------------------------------------------------
// 9. EXTENDED SITE PREVIEW
//    - If "useWhiteBase" is true => keep backgrounds mostly white
//      and apply accent blocks
//    - Otherwise => use palette backgrounds for sections
// ---------------------------------------------------
const MockSitePreview = ({ palette, useWhiteBase }) => {
  // Example usage of palette with a mostly white base if toggled
  const navBg = useWhiteBase ? palette.darkShade : palette.primary;
  const heroBg = useWhiteBase ? '#fff' : palette.monotonal.light;
  const featuresBg = useWhiteBase ? '#fff' : palette.analogous[0];
  const testimonialBg = useWhiteBase ? '#fdfdfd' : palette.triadic[0];
  const ctaBg = palette.variants.loud;
  const footerBg = useWhiteBase ? palette.darkShade : palette.complementary;

  // Contrasting text color
  const navTextColor = chroma.contrast(navBg, 'black') > 4.5 ? 'black' : 'white';
  const heroTextColor =
    chroma.contrast(heroBg, 'black') > 4.5 ? 'black' : 'white';
  const featuresTextColor =
    chroma.contrast(featuresBg, 'black') > 4.5 ? 'black' : 'white';
  const testimonialTextColor =
    chroma.contrast(testimonialBg, 'black') > 4.5 ? 'black' : 'white';
  const ctaTextColor = chroma.contrast(ctaBg, 'black') > 4.5 ? 'black' : 'white';
  const footerTextColor =
    chroma.contrast(footerBg, 'black') > 4.5 ? 'black' : 'white';

  // For hero CTA button background
  const heroCtaBg = useWhiteBase ? palette.primary : palette.monotonal.dark;
  const heroCtaColor =
    chroma.contrast(heroCtaBg, 'black') > 4.5 ? 'black' : 'white';

  return (
    <div className="site-preview-panel">
      <h2 className="panel-title">Full Example Site Preview</h2>
      <div className="site-container" style={{ backgroundColor: useWhiteBase ? '#fff' : '#fefefe' }}>

        {/* NAVIGATION */}
        <nav
          className="site-nav"
          style={{ backgroundColor: navBg, color: navTextColor }}
        >
          <h1>My Brand</h1>
          <ul>
            <li>Home</li>
            <li>Features</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </nav>

        {/* HERO SECTION */}
        <section
          className="hero-section"
          style={{ backgroundColor: heroBg, color: heroTextColor }}
        >
          <div className="hero-content">
            <h2>Empower Your Business</h2>
            <p>
              Welcome to our platform, where innovative solutions come together
              to boost your success.
            </p>
            <button
              className="cta-button"
              style={{ backgroundColor: heroCtaBg, color: heroCtaColor }}
            >
              Get Started
            </button>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section
          className="features-section"
          style={{ backgroundColor: featuresBg, color: featuresTextColor }}
        >
          <div className="inner-content">
            <h2>Our Core Features</h2>
            <p>Experience unrivaled quality, performance, and design.</p>
            <div className="features-grid">
              <div className="feature-box">
                <h3>Speed</h3>
                <p>
                  Blazing fast performance to handle your daily tasks with ease.
                </p>
              </div>
              <div className="feature-box">
                <h3>Security</h3>
                <p>
                  Bank-grade encryption and advanced protection for all your data.
                </p>
              </div>
              <div className="feature-box">
                <h3>Design</h3>
                <p>
                  Clean, intuitive interfaces that elevate user experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL SECTION */}
        <section
          className="testimonial-section"
          style={{ backgroundColor: testimonialBg, color: testimonialTextColor }}
        >
          <div className="inner-content">
            <h2>What Our Clients Say</h2>
            <blockquote>
              "A game-changer! Our productivity soared, and our customers love
              the seamless experience."
            </blockquote>
            <cite>- A Satisfied Customer</cite>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section
          className="cta-section"
          style={{ backgroundColor: ctaBg, color: ctaTextColor }}
        >
          <div className="inner-content">
            <h2>Ready to Transform Your Operations?</h2>
            <p>Sign up today and see why thousands trust our platform.</p>
            <button
              className="cta-button"
              style={{ backgroundColor: palette.darkShade, color: '#fff' }}
            >
              Start Free Trial
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          className="site-footer"
          style={{ backgroundColor: footerBg, color: footerTextColor }}
        >
          <p>&copy; 2025 MyBrand Inc. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
};

// ---------------------------------------------------
// 10. MAIN APP
//    - We'll add a new grid area for ColorDetailsPanel
// ---------------------------------------------------
const App = () => {
  const [theme, setTheme] = useState('ocean');
  const [colorValue, setColorValue] = useState('#1E90FF');
  const [baseColor, setBaseColor] = useState(chroma('#1E90FF'));
  const [palette, setPalette] = useState(generatePalette(baseColor));
  const [useWhiteBase, setUseWhiteBase] = useState(false);

  // For the new color details panel
  const [selectedSwatch, setSelectedSwatch] = useState(null);

  // On theme change, update color to the theme’s base color
  useEffect(() => {
    if (theme !== 'custom') {
      const found = themeOptions.find((opt) => opt.value === theme);
      if (found) {
        setColorValue(found.base);
        setBaseColor(chroma(found.base));
      }
    }
  }, [theme]);

  // On color change (picker), if in "custom" mode, update baseColor
  useEffect(() => {
    if (theme === 'custom') {
      setBaseColor(chroma(colorValue));
    }
  }, [colorValue, theme]);

  // Re-generate palette whenever the base color changes
  useEffect(() => {
    setPalette(generatePalette(baseColor));
  }, [baseColor]);

  // Handle click on a swatch
  const handleSwatchClick = (swatchObj) => {
    setSelectedSwatch(swatchObj);
  };

  return (
    <div className="app">
      <div className="grid-container">
        {/* SETTINGS (Top Left) */}
        <div className="settings-panel">
          <ColorInputPanel
            colorValue={colorValue}
            onColorChange={setColorValue}
            theme={theme}
            onThemeChange={setTheme}
            useWhiteBase={useWhiteBase}
            onToggleWhiteBase={setUseWhiteBase}
          />
        </div>

        {/* PALETTE DISPLAY (Middle Left) */}
        <div className="palette-panel">
          <PaletteDisplay
            palette={palette}
            baseColor={baseColor}
            onSwatchClick={handleSwatchClick}
          />
        </div>

        {/* COLOR DETAILS (Bottom Left) */}
        <div className="details-panel">
          <ColorDetailsPanel selectedSwatch={selectedSwatch} />
        </div>

        {/* SITE PREVIEW (Right) */}
        <div className="preview-panel">
          <MockSitePreview palette={palette} useWhiteBase={useWhiteBase} />
        </div>
      </div>
    </div>
  );
};

export default App;