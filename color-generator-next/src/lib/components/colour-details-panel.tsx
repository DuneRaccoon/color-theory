import chroma, { Color } from 'chroma-js';
import { getRoleUsageExplanation, getColorPsychologyDescription } from '@/lib/colour-psych';
import { Swatch } from '@/lib/types';

export default function ColorDetailsPanel({ selectedSwatch }: { selectedSwatch: null|Swatch }) {
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

  const hsl = colorObj.hsl().map((val: any, i: number) => {
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