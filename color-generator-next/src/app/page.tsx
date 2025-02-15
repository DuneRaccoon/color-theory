'use client';

import { useState, useEffect } from 'react';
import chroma, { Color } from 'chroma-js';
import { themeOptions } from '@/lib/constants';
import { generatePalette } from '@/lib/colour-psych';
import { PaletteType, Swatch } from '@/lib/types';

import ColorInputPanel from '@/lib/components/colour-input-panel';
import PaletteDisplay from '@/lib/components/palette-display';
import ColorDetailsPanel from '@/lib/components/colour-details-panel';
import MockSitePreview from '@/lib/components/mock-site-preview';

export default function Home() {
  const [theme, setTheme] = useState('custom');
  const [colorValue, setColorValue] = useState('#1E90FF');
  const [baseColor, setBaseColor] = useState(chroma('#1E90FF'));
  const [palette, setPalette] = useState<PaletteType>(generatePalette(baseColor));
  const [useWhiteBase, setUseWhiteBase] = useState(false);

  const [selectedSwatch, setSelectedSwatch] = useState<null|Swatch>(null);

  // update the color to the theme base when theme changes (if not custom)
  useEffect(() => {
    if (theme !== 'custom') {
      const found = themeOptions.find((opt) => opt.value === theme);
      if (found) {
        setColorValue(found.base);
        setBaseColor(chroma(found.base));
      }
    }
  }, [theme]);

  // if "custom," watch for color changes
  useEffect(() => {
    if (theme === 'custom') {
      setBaseColor(chroma(colorValue));
    }
  }, [colorValue, theme]);

  // regen palette whenever the base color changes
  useEffect(() => {
    setPalette(generatePalette(baseColor));
  }, [baseColor]);

  const handleSwatchClick = (swatchObj: Swatch) => setSelectedSwatch(swatchObj);

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
