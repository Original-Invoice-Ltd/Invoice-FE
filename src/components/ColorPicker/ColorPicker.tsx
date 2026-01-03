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
          <path d="M22.0003 12.2063C21.9969 11.9054 21.9328 11.6082 21.8119 11.3327C21.691 11.0571 21.5157 10.8088 21.2965 10.6025C20.4215 9.77253 19.0015 9.80378 18.1328 10.6732L16.9253 11.8875C16.6401 11.6276 16.2658 11.4876 15.88 11.4966C15.4943 11.5055 15.1268 11.6628 14.854 11.9357L14.2915 12.4982C14.1986 12.591 14.1248 12.7013 14.0745 12.8227C14.0242 12.9441 13.9983 13.0742 13.9983 13.2057C13.9983 13.3371 14.0242 13.4672 14.0745 13.5886C14.1248 13.71 14.1986 13.8203 14.2915 13.9132L14.4165 14.0419L11.229 17.2294C10.9222 17.5338 10.7001 17.913 10.5847 18.3295C10.4693 18.7461 10.4646 19.1855 10.5709 19.6044L10.0709 20.755C10.0011 20.913 9.98081 21.0885 10.0128 21.2582C10.0449 21.428 10.1277 21.584 10.2503 21.7057C10.3919 21.8486 10.5735 21.9452 10.7711 21.9827C10.9687 22.0202 11.1731 21.9968 11.3572 21.9157L12.4528 21.4375C12.8641 21.5304 13.2922 21.5175 13.6972 21.4C14.1022 21.2825 14.4707 21.0643 14.7684 20.7657L17.9559 17.5782L18.0847 17.7069C18.2722 17.8943 18.5264 17.9996 18.7915 17.9996C19.0567 17.9996 19.3109 17.8943 19.4984 17.7069L20.0609 17.1444C20.3343 16.8712 20.4916 16.5031 20.5003 16.1168C20.5089 15.7305 20.3681 15.3557 20.1072 15.0707L21.3415 13.8288C21.5549 13.6166 21.7233 13.3636 21.8365 13.0847C21.9497 12.8059 22.0054 12.5071 22.0003 12.2063ZM14.0628 20.0625C13.8704 20.2553 13.6291 20.3921 13.3648 20.4582C13.1006 20.5243 12.8233 20.5171 12.5628 20.4375C12.4486 20.4023 12.3255 20.4092 12.2159 20.4569L11.0847 20.9507L11.5628 19.8382C11.6124 19.7244 11.618 19.5964 11.5784 19.4788C11.4706 19.1604 11.4728 18.8151 11.5847 18.4982H15.6253L14.0628 20.0625ZM16.6253 17.5H12.3797L15.1297 14.75L17.2509 16.875L16.6253 17.5ZM20.6365 13.125L19.0509 14.72C18.9572 14.8138 18.9046 14.9409 18.9046 15.0735C18.9046 15.206 18.9572 15.3331 19.0509 15.4269L19.3565 15.7319C19.403 15.7783 19.4399 15.8335 19.4651 15.8942C19.4902 15.9549 19.5032 16.0199 19.5032 16.0857C19.5032 16.1514 19.4902 16.2164 19.4651 16.2771C19.4399 16.3378 19.403 16.393 19.3565 16.4394L18.794 17.0019L15.0003 13.2038L15.5628 12.6413C15.6566 12.5476 15.7837 12.4949 15.9162 12.4949C16.0488 12.4949 16.1759 12.5476 16.2697 12.6413L16.5753 12.9469C16.669 13.0405 16.796 13.0931 16.9284 13.0932C16.9942 13.093 17.0593 13.08 17.12 13.0546C17.1807 13.0293 17.2358 12.9923 17.2822 12.9457L18.8409 11.3775C19.329 10.8888 20.1222 10.8663 20.609 11.3269C20.7307 11.4418 20.828 11.5799 20.8952 11.7331C20.9625 11.8862 20.9983 12.0513 21.0006 12.2186C21.0029 12.3859 20.9715 12.5519 20.9085 12.7069C20.8454 12.8618 20.7519 13.0025 20.6334 13.1207L20.6365 13.125Z" fill="white"/>
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
