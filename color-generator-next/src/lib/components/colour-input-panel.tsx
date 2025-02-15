import { themeOptions } from '@/lib/constants';

export default function ColorInputPanel({
  colorValue,
  onColorChange,
  theme,
  onThemeChange,
  useWhiteBase,
  onToggleWhiteBase
}: {
  colorValue: string;
  onColorChange: (color: string) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  useWhiteBase: boolean;
  onToggleWhiteBase: (useWhiteBase: boolean) => void;
}) {
  const handleThemeSelect = ({ target }: { target: any }) => {
    const selectedValue = target.value;
    onThemeChange(selectedValue);
  };

  const handleColorChange = ({ target }: { target: any }) => {
    onColorChange(target.value);
  };

  const handleWhiteBaseToggle = ({ target }: { target: any }) => {
    onToggleWhiteBase(target.checked);
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