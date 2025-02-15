import { Color } from 'chroma-js';
import { buildSwatchesData, getColorPsychologyDescription } from '@/lib/colour-psych';

export default function PaletteDisplay({ 
  palette, 
  baseColor, 
  onSwatchClick 
}: {
  palette: any;
  baseColor: Color;
  onSwatchClick: (swatch: any) => void;
}) {
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
