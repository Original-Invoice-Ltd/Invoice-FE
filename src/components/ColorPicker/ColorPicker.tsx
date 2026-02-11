"use client";

import { useState, useRef, useEffect } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { ChevronDown } from "lucide-react";

type ColorFormat = "Hex" | "RGB" | "HSL";

interface ColorPickerProps {
  initialColor?: string;
  onColorChange?: (color: string, opacity: number) => void;
}

const savedColors = [
  "#EF4444", "#F97316", "#FACC15", "#22C55E", "#2DD4BF", "#3B82F6", "#4F46E5",
  "#EC4899", "#EF4444", "#A855F7", "#8B5CF6", "#06B6D4", "#10B981", "#84CC16",
];

// Convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Convert hex to HSL
const hexToHsl = (hex: string): { h: number; s: number; l: number } | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};


// Format color based on selected format
const formatColor = (hex: string, format: ColorFormat): string => {
  switch (format) {
    case "Hex":
      return hex.toUpperCase();
    case "RGB": {
      const rgb = hexToRgb(hex);
      return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : hex;
    }
    case "HSL": {
      const hsl = hexToHsl(hex);
      return hsl ? `${hsl.h}, ${hsl.s}%, ${hsl.l}%` : hex;
    }
    default:
      return hex;
  }
};

const ColorPicker = ({ initialColor = "#4F46E5", onColorChange }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState(initialColor);
  const [opacity, setOpacity] = useState(100);
  const [format, setFormat] = useState<ColorFormat>("Hex");
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowFormatDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   useEffect(() => {
    setColor(initialColor);
  }, [initialColor]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onColorChange?.(newColor, opacity);
    };

  const handleOpacityChange = (newOpacity: number) => {
    setOpacity(Math.min(100, Math.max(0, newOpacity)));
    onColorChange?.(color, newOpacity);
  };

  const handleSavedColorClick = (savedColor: string) => {
    setColor(savedColor);
    onColorChange?.(savedColor, opacity);
  };

  const displayValue = format === "Hex" ? color.replace("#", "").toUpperCase() : formatColor(color, format);

  return (
    <div className="relative" ref={pickerRef}>
      {/* Trigger Button - Color Picker Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded cursor-pointer hover:opacity-80 transition-opacity"
        title="Select Color"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="4" fill="url(#paint0_linear_15044_89579)"/>
          <path fill="#fff" d="M22 12.206a2.237 2.237 0 0 0-.703-1.604c-.875-.83-2.296-.798-3.164.071l-1.208 1.214a1.5 1.5 0 0 0-2.071.049l-.563.562a1 1 0 0 0 0 1.415l.125.129-3.187 3.187a2.484 2.484 0 0 0-.658 2.375l-.5 1.151a.854.854 0 0 0 .18.95.994.994 0 0 0 1.106.21l1.096-.477a2.494 2.494 0 0 0 2.315-.672l3.188-3.188.129.129a1 1 0 0 0 1.413 0l.563-.563a1.5 1.5 0 0 0 .046-2.073l1.235-1.242A2.234 2.234 0 0 0 22 12.206Zm-7.937 7.857a1.5 1.5 0 0 1-1.5.375.5.5 0 0 0-.347.019l-1.131.494.478-1.113a.5.5 0 0 0 .015-.36 1.5 1.5 0 0 1 .007-.98h4.04l-1.562 1.564Zm2.562-2.563H12.38l2.75-2.75 2.12 2.125-.625.625Zm4.012-4.375L19.05 14.72a.5.5 0 0 0 0 .707l.306.305a.5.5 0 0 1 0 .707l-.563.563L15 13.204l.563-.563a.5.5 0 0 1 .707 0l.305.306a.5.5 0 0 0 .707-.001l1.559-1.569c.488-.488 1.281-.51 1.768-.05a1.248 1.248 0 0 1 .024 1.794l.004.004Z"/>
          <defs>
            <linearGradient id="paint0_linear_15044_89579" x1="16" y1="-4.76837e-07" x2="-7.15256e-07" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#92D1FE"/>
              <stop offset="0.505" stopColor="#2F80ED"/>
            </linearGradient>
          </defs>
        </svg>
      </button>

      {/* Color Picker Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-[320px]">
          <p className="text-gray-500 text-sm mb-3">Color Picker</p>

          {/* Main Color Picker */}
          <div className="color-picker-wrapper mb-4">
            <HexColorPicker color={color} onChange={handleColorChange} style={{ width: "100%", height: "200px" }} />
          </div>

          {/* Opacity Slider */}
          <div className="mb-4">
            <div
              className="h-3 rounded-full relative"
              style={{
                background: `linear-gradient(to right, transparent, ${color})`,
                backgroundImage: `linear-gradient(to right, transparent, ${color}), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%23ccc' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => handleOpacityChange(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-300 shadow pointer-events-none"
                style={{ left: `calc(${opacity}% - 8px)` }}
              />
            </div>
          </div>

          {/* Format, Color Code, and Opacity Inputs */}
          <div className="flex gap-2 mb-4">
            {/* Format Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFormatDropdown(!showFormatDropdown)}
                className="flex items-center justify-between gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white min-w-[80px] text-sm"
              >
                {format}
                <ChevronDown size={14} />
              </button>
              {showFormatDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {(["Hex", "RGB", "HSL"] as ColorFormat[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setFormat(f);
                        setShowFormatDropdown(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                        format === f ? "bg-gray-50 font-medium" : ""
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>


            {/* Color Code Input */}
            <div className="flex-1">
              {format === "Hex" ? (
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                  <span className="text-gray-500 text-sm mr-1">#</span>
                  <HexColorInput
                    color={color}
                    onChange={handleColorChange}
                    className="w-full text-sm focus:outline-none uppercase"
                    prefixed={false}
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={displayValue}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              )}
            </div>

            {/* Opacity Input */}
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-[70px]">
              <input
                type="number"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => handleOpacityChange(parseInt(e.target.value) || 0)}
                className="w-full text-sm focus:outline-none text-center"
              />
              <span className="text-gray-500 text-sm">%</span>
            </div>
          </div>

          {/* Saved Colors */}
          <div>
            <p className="text-gray-700 text-sm font-medium mb-3">Saved colors:</p>
            <div className="grid grid-cols-7 gap-2">
              {savedColors.map((savedColor, index) => (
                <button
                  key={index}
                  onClick={() => handleSavedColorClick(savedColor)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color.toLowerCase() === savedColor.toLowerCase()
                      ? "ring-2 ring-offset-2 ring-gray-400"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: savedColor }}
                  title={savedColor}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom styles for react-colorful */}
      <style jsx global>{`
        .color-picker-wrapper .react-colorful {
          width: 100% !important;
        }
        .color-picker-wrapper .react-colorful__saturation {
          border-radius: 8px;
        }
        .color-picker-wrapper .react-colorful__hue {
          height: 12px;
          border-radius: 6px;
          margin-top: 12px;
        }
        .color-picker-wrapper .react-colorful__pointer {
          width: 16px;
          height: 16px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ColorPicker;
