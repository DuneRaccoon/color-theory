import React, { useState } from 'react';
import chroma, { Color } from 'chroma-js';
import { buildSwatchesData, getColorPsychologyDescription } from '@/lib/colour-psych';
import { Swatch } from '@/lib/types';

/**
 * Utility function for generating text in different formats
 */
function generateCopyText(
  formatType: 'css' | 'hexList' | 'verbose',
  swatches: Swatch[]
) {
  switch (formatType) {
    case 'css':
      // eg: --primary: #1E90FF; --complementary: #FF4500; ...
      return swatches
        .map((s) => `--${s.role.toLowerCase().replace(/\s+/g, '-')}: ${s.color};`)
        .join('\n');
    case 'hexList':
      // eg: #1E90FF, #FF4500, #00FA9A, ...
      return swatches.map((s) => s.color).join(', ');
    case 'verbose':
      // eg "Primary: #1E90FF / rgba(...) / hsl(...)"
      return swatches
        .map((s) => {
          const c = chroma(s.color);
          const rgb = c.rgb();
          const hsl = c.hsl();
          return `${s.role}: 
  ${s.color} / 
  rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1) / 
  hsl(${Math.round(hsl[0])}°, ${Math.round(hsl[1] * 100)}%, ${Math.round(
            hsl[2] * 100
          )}%)`;
        })
        .join('\n\n');
    default:
      return '';
  }
}

/**
 * Simple color-wheel SVG marker definition
 */
function ColorWheelSVG({ swatches }: { swatches: Swatch[] }) {
  const size = 220;
  const radius = 80;
  const center = size / 2;

  //assign standard angles to each role
  const angleMap: Record<string, number> = {
    Primary: 0,
    Complementary: 180,
    'Analogous 1': 30,
    'Analogous 2': 330,
    'Triadic 1': 120,
    'Triadic 2': 240,
    'Light Shade': 60,
    'Dark Shade': 300,
    'Loud Variant': 90,
  };

  const polarToCartesian = (angleDeg: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    const x = center + radius * Math.cos(angleRad);
    const y = center + radius * Math.sin(angleRad);
    return { x, y };
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="mx-auto">
        {/* Outline circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#ccc"
          strokeWidth="2"
        />
        {swatches.map((s) => {
          const angle = angleMap[s.role] ?? 0;
          const pos = polarToCartesian(angle);
          return (
            <g key={s.role}>
              {/* line from center to the color marker */}
              <line
                x1={center}
                y1={center}
                x2={pos.x}
                y2={pos.y}
                stroke="#aaa"
                strokeDasharray="3,3"
              />
              {/* color circle marker */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={8}
                fill={s.color}
                stroke="black"
                strokeWidth="1"
              />
              {/* label text */}
              <text
                x={pos.x + 10}
                y={pos.y}
                fill="#444"
                fontSize="10"
                alignmentBaseline="middle"
              >
                {s.role}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="text-xs text-gray-600 max-w-[220px] text-center">
        This wheel shows how each palette color relates on the hue circle
        (e.g. complementary is 180° away, analogous is ±30°, triadic ±120°, etc.).
      </p>
    </div>
  );
}

export default function PaletteDisplay({
  palette,
  baseColor,
  onSwatchClick,
}: {
  palette: any;
  baseColor: Color;
  onSwatchClick: (swatch: Swatch) => void;
}) {
  const [showWheel, setShowWheel] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCopy = (type: 'css' | 'hexList' | 'verbose') => {
    const swatches = buildSwatchesData(palette);
    const textToCopy = generateCopyText(type, swatches);
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert(`Copied ${type} format to clipboard!`);
      setShowMenu(false);
    });
  };

  const swatches = buildSwatchesData(palette);
  const { primaryImpact } = getColorPsychologyDescription(baseColor);

  return (
    <div className="relative flex flex-col gap-4">
      {/* Top bar: Title + Icon Buttons */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-700">
          Color Palette &amp; Explanation
        </h2>

        <div className="flex items-center gap-3">
          {/* The 3-dot menu */}
          <div className="relative">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
              onClick={() => setShowMenu(!showMenu)}
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                className="w-5 h-5 text-gray-700"
              >
                <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow z-10">
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => handleCopy('css')}
                >
                  Copy as CSS variables
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => handleCopy('hexList')}
                >
                  Copy as HEX list
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => handleCopy('verbose')}
                >
                  Copy verbose format
                </button>
              </div>
            )}
          </div>

          {/* The "View Color Wheel" button */}
          <button
            onClick={() => setShowWheel(!showWheel)}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm font-medium text-gray-700"
          >
            {showWheel ? 'Back to Palette' : 'View Color Wheel'}
          </button>
        </div>
      </div>

      {/* 3D flip container */}
      <div
        className="relative w-full"
        style={{ perspective: '1000px', minHeight: '300px' }}
      >
        <div
          className="absolute inset-0 transition-transform duration-700"
          style={{
            transformStyle: 'preserve-3d',
            transform: showWheel ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* FRONT SIDE (Palette) */}
          <div
            className="absolute inset-0 p-2"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
          >
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
            <div className="mt-4">
              <h4 className="text-lg font-medium text-gray-600 mb-1">
                Psychological Impact of Your Base Color
              </h4>
              <p className="text-sm leading-relaxed text-gray-700">
                {primaryImpact}
              </p>
            </div>
          </div>

          {/* BACK SIDE (Color Wheel) */}
          <div
            className="absolute inset-0 p-4 flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <ColorWheelSVG swatches={swatches} />
          </div>
        </div>
      </div>
    </div>
  );
}
