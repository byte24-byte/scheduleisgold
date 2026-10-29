import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarDisplayProps {
  avatar: AvatarConfig;
  name?: string;
  note?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeech?: boolean;
  animated?: boolean;
  onClick?: () => void;
  className?: string;
  selected?: boolean;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatar,
  name,
  note,
  size = 'md',
  showSpeech = false,
  animated = true,
  onClick,
  className = '',
  selected = false,
}) => {
  const { skinColor, hairStyle, hairColor, shirtColor, pantsColor, accessory, mood } = avatar;

  const sizePixels = {
    sm: 44,
    md: 68,
    lg: 110,
    xl: 140,
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Speech Bubble */}
      {showSpeech && note && (
        <div className="absolute -top-11 left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap">
          <div className="relative px-2.5 py-1 bg-white/95 text-slate-800 text-xs font-medium rounded-xl shadow-md border border-amber-100 flex items-center gap-1 backdrop-blur-xs">
            <span className="text-[10px] text-amber-500">💬</span>
            <span className="max-w-[130px] truncate">{note}</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rotate-45 border-r border-b border-amber-100" />
          </div>
        </div>
      )}

      {/* Character SVG Body */}
      <div
        className={`relative transition-transform duration-200 ${
          animated ? 'animate-avatar-sway hover:scale-110' : ''
        } ${selected ? 'ring-3 ring-amber-400 ring-offset-2 rounded-full' : ''}`}
        style={{ width: sizePixels, height: sizePixels * 1.25 }}
      >
        <svg
          viewBox="0 0 100 125"
          className="w-full h-full drop-shadow-sm transition-transform duration-150"
        >
          {/* Shadow */}
          <ellipse cx="50" cy="120" rx="30" ry="5" fill="rgba(0,0,0,0.12)" />

          {/* Legs & Pants */}
          <rect x="36" y="94" width="11" height="23" rx="5" fill={pantsColor} />
          <rect x="53" y="94" width="11" height="23" rx="5" fill={pantsColor} />

          {/* Shoes */}
          <ellipse cx="41.5" cy="116" rx="7" ry="4" fill="#334155" />
          <ellipse cx="58.5" cy="116" rx="7" ry="4" fill="#334155" />

          {/* Torso / Shirt */}
          <rect x="30" y="66" width="40" height="32" rx="10" fill={shirtColor} />

          {/* Arms */}
          <rect
            x="20"
            y="68"
            width="10"
            height="26"
            rx="5"
            fill={shirtColor}
            transform="rotate(8 20 68)"
          />
          <circle cx="21" cy="94" r="5" fill={skinColor} />

          <rect
            x="70"
            y="68"
            width="10"
            height="26"
            rx="5"
            fill={shirtColor}
            transform="rotate(-8 70 68)"
          />
          <circle cx="79" cy="94" r="5" fill={skinColor} />

          {/* Head */}
          <ellipse cx="50" cy="42" rx="23" ry="24" fill={skinColor} />

          {/* Ears */}
          <circle cx="26" cy="44" r="5" fill={skinColor} />
          <circle cx="74" cy="44" r="5" fill={skinColor} />

          {/* Hair Styles - Full Crown & Scalp Coverage with Natural Volume */}
          {hairStyle === 'short' && (
            <g fill={hairColor}>
              {/* Full crown dome reaching above the skull */}
              <path d="M 23 44 C 20 11 80 11 77 44 C 74 34 62 36 50 32 C 38 35 26 34 23 44 Z" />
              {/* Cute top hair strand texture */}
              <path d="M 47 13 Q 52 8 57 12 Q 52 15 47 13 Z" />
            </g>
          )}

          {hairStyle === 'bob' && (
            <g fill={hairColor}>
              {/* Full crown dome */}
              <path d="M 23 44 C 20 11 80 11 77 44 C 74 34 62 36 50 32 C 38 35 26 34 23 44 Z" />
              {/* Side locks falling past cheeks */}
              <rect x="22" y="36" width="9" height="26" rx="4.5" />
              <rect x="69" y="36" width="9" height="26" rx="4.5" />
              {/* Bangs fringe */}
              <path d="M 27 34 Q 50 32 73 34 Q 50 37 27 34 Z" opacity="0.9" />
            </g>
          )}

          {hairStyle === 'curly' && (
            <g fill={hairColor}>
              {/* Solid base cap covering the whole crown */}
              <path d="M 23 45 C 20 11 80 11 77 45 C 72 32 28 32 23 45 Z" />
              {/* Voluminous overlapping curls covering crown, forehead, and sides */}
              <circle cx="50" cy="14" r="10.5" />
              <circle cx="36" cy="16" r="9.5" />
              <circle cx="64" cy="16" r="9.5" />
              <circle cx="25" cy="24" r="9" />
              <circle cx="75" cy="24" r="9" />
              <circle cx="22" cy="35" r="8.5" />
              <circle cx="78" cy="35" r="8.5" />
              <circle cx="24" cy="46" r="7.5" />
              <circle cx="76" cy="46" r="7.5" />
              <circle cx="42" cy="27" r="8" />
              <circle cx="58" cy="27" r="8" />
            </g>
          )}

          {hairStyle === 'ponytail' && (
            <g fill={hairColor}>
              {/* Full crown dome */}
              <path d="M 23 44 C 20 11 80 11 77 44 C 74 34 62 36 50 32 C 38 35 26 34 23 44 Z" />
              {/* High side ponytail */}
              <path d="M 74 21 C 88 15 95 28 91 46 C 85 48 81 36 74 27 Z" />
              <circle cx="73" cy="23" r="4.5" fill="#EC4899" />
            </g>
          )}

          {hairStyle === 'cap' && (
            <g>
              {/* Natural hair peeking out below cap */}
              <path d="M 23 44 C 21 13 79 13 77 44 C 74 38 26 38 23 44 Z" fill={hairColor} />
              <rect x="23" y="38" width="6" height="12" rx="3" fill={hairColor} />
              <rect x="71" y="38" width="6" height="12" rx="3" fill={hairColor} />
              {/* Baseball cap dome covering full crown */}
              <ellipse cx="50" cy="26" rx="25.5" ry="16.5" fill={hairColor} />
              <path d="M 28 29 Q 50 21 78 30 Q 88 33 80 38 Q 50 32 28 29 Z" fill={hairColor} />
              <circle cx="50" cy="10" r="3.5" fill="#F8FAFC" />
            </g>
          )}

          {hairStyle === 'beanie' && (
            <g>
              {/* Hair peeking at cheeks */}
              <path d="M 24 45 C 22 20 78 20 76 45 C 72 38 28 38 24 45 Z" fill={hairColor} />
              <rect x="23" y="40" width="6" height="10" rx="3" fill={hairColor} />
              <rect x="71" y="40" width="6" height="10" rx="3" fill={hairColor} />
              {/* Full warm beanie covering top dome */}
              <ellipse cx="50" cy="24" rx="26" ry="18" fill={hairColor} />
              <rect x="24" y="27" width="52" height="9" rx="4.5" fill={hairColor} opacity="0.9" />
              <circle cx="50" cy="7" r="7" fill="#F8FAFC" />
            </g>
          )}

          {hairStyle === 'ribbon' && (
            <g>
              {/* Full crown dome */}
              <path d="M 23 44 C 20 11 80 11 77 44 C 74 34 62 36 50 32 C 38 35 26 34 23 44 Z" fill={hairColor} />
              {/* Side locks */}
              <rect x="23" y="40" width="7" height="16" rx="3.5" fill={hairColor} />
              <rect x="70" y="40" width="7" height="16" rx="3.5" fill={hairColor} />
              {/* Cute Pink/Red Ribbon on hair */}
              <circle cx="64" cy="18" r="3.5" fill="#F43F5E" />
              <polygon points="64,18 52,11 54,23" fill="#F43F5E" />
              <polygon points="64,18 76,11 74,23" fill="#F43F5E" />
            </g>
          )}

          {/* Eyes & Expression */}
          {mood === 'happy' && (
            <g stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <path d="M 38 43 Q 43 38 48 43" />
              <path d="M 52 43 Q 57 38 62 43" />
            </g>
          )}

          {mood === 'excited' && (
            <g fill="#1E293B">
              <circle cx="43" cy="42" r="3.5" />
              <circle cx="57" cy="42" r="3.5" />
              <circle cx="44.5" cy="40.5" r="1.2" fill="white" />
              <circle cx="58.5" cy="40.5" r="1.2" fill="white" />
            </g>
          )}

          {mood === 'chill' && (
            <g stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" fill="none">
              <line x1="39" y1="43" x2="47" y2="43" />
              <line x1="53" y1="43" x2="61" y2="43" />
            </g>
          )}

          {mood === 'sparkle' && (
            <g>
              <circle cx="43" cy="42" r="3.5" fill="#1E293B" />
              <circle cx="44.5" cy="40.5" r="1.2" fill="white" />
              {/* Winking right eye */}
              <path
                d="M 53 43 Q 57 39 61 43"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* Rosy Cheeks */}
          <circle cx="36" cy="48" r="4.5" fill="#FDA4AF" opacity="0.65" />
          <circle cx="64" cy="48" r="4.5" fill="#FDA4AF" opacity="0.65" />

          {/* Smile Mouth */}
          <path
            d="M 45 49 Q 50 54 55 49"
            stroke="#991B1B"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Accessories */}
          {accessory === 'glasses' && (
            <g stroke="#334155" strokeWidth="2" fill="none">
              <circle cx="43" cy="42" r="7" />
              <circle cx="57" cy="42" r="7" />
              <line x1="50" y1="42" x2="50" y2="42" />
              <line x1="26" y1="40" x2="36" y2="42" />
              <line x1="64" y1="42" x2="74" y2="40" />
            </g>
          )}

          {accessory === 'sunglasses' && (
            <g fill="#0F172A">
              <rect x="36" y="37" width="13" height="11" rx="3" />
              <rect x="51" y="37" width="13" height="11" rx="3" />
              <line x1="48" y1="41" x2="52" y2="41" stroke="#0F172A" strokeWidth="3" />
            </g>
          )}

          {accessory === 'flower' && (
            <g transform="translate(68, 26)">
              <circle cx="0" cy="-4" r="3" fill="#F472B6" />
              <circle cx="4" cy="0" r="3" fill="#F472B6" />
              <circle cx="0" cy="4" r="3" fill="#F472B6" />
              <circle cx="-4" cy="0" r="3" fill="#F472B6" />
              <circle cx="0" cy="0" r="2.5" fill="#FACC15" />
            </g>
          )}

          {accessory === 'clover' && (
            <g transform="translate(68, 26) scale(0.8)">
              <circle cx="-3" cy="-3" r="3.5" fill="#22C55E" />
              <circle cx="3" cy="-3" r="3.5" fill="#22C55E" />
              <circle cx="0" cy="2" r="3.5" fill="#22C55E" />
              <path d="M 0 3 Q 2 8 4 9" stroke="#15803D" strokeWidth="1.5" fill="none" />
            </g>
          )}

          {accessory === 'apple_pin' && (
            <g transform="translate(68, 26) scale(0.75)">
              <circle cx="0" cy="0" r="5" fill="#EF4444" />
              <path d="M 0 -5 Q 2 -8 4 -6" stroke="#15803D" strokeWidth="1.5" fill="none" />
            </g>
          )}

          {accessory === 'star' && (
            <polygon
              points="68,20 70,24 74,24 71,27 72,31 68,29 64,31 65,27 62,24 66,24"
              fill="#FACC15"
            />
          )}
        </svg>
      </div>

      {/* Name Label */}
      {name && (
        <div className="mt-1 flex items-center justify-center">
          <div className="px-2 py-0.5 bg-white/95 text-slate-800 text-xs font-semibold rounded-full shadow-xs border border-emerald-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{name}</span>
          </div>
        </div>
      )}
    </div>
  );
};
