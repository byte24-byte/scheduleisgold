import React, { useState } from 'react';
import { Participant } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import { Sparkles, Plus, Clock, Users, CalendarCheck, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { playGoldenChime, playPop } from '../utils/sound';

interface MeadowFieldProps {
  participants: Participant[];
  onOpenGoldenApple: () => void;
  onSelectParticipant: (participant: Participant) => void;
  onAddParticipant: () => void;
  confirmedSlot: string | null;
  datesCount: number;
}

export const MeadowField: React.FC<MeadowFieldProps> = ({
  participants,
  onOpenGoldenApple,
  onSelectParticipant,
  onAddParticipant,
  confirmedSlot,
  datesCount,
}) => {
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<'day' | 'sunset'>('day');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleGoldenAppleClick = () => {
    if (soundEnabled) playGoldenChime();
    onOpenGoldenApple();
  };

  const handleAvatarClick = (p: Participant) => {
    if (soundEnabled) playPop(540);
    setActiveSpeechId((prev) => (prev === p.id ? null : p.id));
    onSelectParticipant(p);
  };

  return (
    <div
      className={`relative w-full h-[580px] sm:h-[640px] md:h-[700px] overflow-hidden rounded-3xl shadow-xl border border-sky-200 transition-colors duration-700 ${
        themeMode === 'day'
          ? 'bg-gradient-to-b from-sky-300 via-sky-100 to-lime-100'
          : 'bg-gradient-to-b from-amber-300 via-rose-300 to-lime-200'
      }`}
    >
      {/* Sun & Light Rays */}
      <div className="absolute top-6 right-10 z-0 pointer-events-none">
        <div
          className={`w-20 h-20 rounded-full transition-colors duration-500 ${
            themeMode === 'day'
              ? 'bg-amber-300/90 shadow-[0_0_60px_rgba(251,191,36,0.8)]'
              : 'bg-amber-400/90 shadow-[0_0_70px_rgba(244,63,94,0.6)]'
          }`}
        />
        {/* Soft Sunbeams */}
        <div className="absolute -inset-10 bg-radial from-amber-200/40 via-transparent to-transparent rounded-full animate-pulse" />
      </div>

      {/* Floating Clouds (Drifting smoothly across the sky) */}
      <div className="absolute top-10 w-full pointer-events-none overflow-hidden z-1">
        <div className="animate-cloud-slow flex items-center gap-1 opacity-85">
          <div className="w-24 h-9 bg-white/90 rounded-full shadow-sm" />
          <div className="w-16 h-7 bg-white/90 rounded-full -ml-8 -mt-4 shadow-sm" />
          <div className="w-14 h-6 bg-white/90 rounded-full -ml-4 shadow-sm" />
        </div>
      </div>

      <div className="absolute top-24 w-full pointer-events-none overflow-hidden z-1">
        <div className="animate-cloud-medium flex items-center gap-1 opacity-70" style={{ animationDelay: '-18s' }}>
          <div className="w-32 h-11 bg-white/80 rounded-full shadow-xs" />
          <div className="w-20 h-9 bg-white/80 rounded-full -ml-10 -mt-5" />
          <div className="w-16 h-7 bg-white/80 rounded-full -ml-6" />
        </div>
      </div>

      <div className="absolute top-44 w-full pointer-events-none overflow-hidden z-1">
        <div className="animate-cloud-fast flex items-center gap-1 opacity-60" style={{ animationDelay: '-8s' }}>
          <div className="w-20 h-8 bg-white/75 rounded-full" />
          <div className="w-14 h-6 bg-white/75 rounded-full -ml-6 -mt-3" />
        </div>
      </div>

      {/* Distant Hills Layer 1 (Warm sunny lime-green) */}
      <div className="absolute bottom-40 w-full pointer-events-none">
        <svg viewBox="0 0 1200 240" className="w-full h-auto drop-shadow-xs preserve-3d">
          <path d="M 0 160 Q 300 80 600 140 T 1200 120 L 1200 240 L 0 240 Z" fill="#BEF264" opacity="0.65" />
        </svg>
      </div>

      {/* Midground Hills Layer 2 (Warm vibrant yellow-green) */}
      <div className="absolute bottom-28 w-full pointer-events-none">
        <svg viewBox="0 0 1200 240" className="w-full h-auto">
          <path d="M 0 180 Q 250 90 550 170 T 1200 140 L 1200 240 L 0 240 Z" fill="#84CC16" opacity="0.88" />
        </svg>
      </div>

      {/* Fluttering Butterflies */}
      <div className="absolute top-1/3 left-1/4 pointer-events-none animate-butterfly z-10 text-amber-500">
        🦋
      </div>
      <div
        className="absolute top-1/2 right-1/4 pointer-events-none animate-butterfly z-10 text-rose-400"
        style={{ animationDelay: '-2s' }}
      >
        🦋
      </div>

      {/* Center Grand Apple Tree & Golden Apple */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-20 z-10 w-[360px] sm:w-[440px] md:w-[500px] h-[360px] sm:h-[420px] pointer-events-none">
        {/* Tree Trunk & Canopy SVG */}
        <svg
          viewBox="0 0 400 360"
          className="w-full h-full drop-shadow-md select-none overflow-visible"
        >
          {/* Ground shadow beneath tree (Warm olive/moss shadow) */}
          <ellipse cx="200" cy="345" rx="140" ry="20" fill="rgba(54, 83, 20, 0.28)" />

          {/* Tree Trunk */}
          <path
            d="M 180 345 C 175 290 165 240 150 190 C 140 160 120 145 100 135 C 125 150 140 180 155 210 C 170 240 178 280 180 345 Z"
            fill="#78350F"
          />
          <path
            d="M 220 345 C 225 290 235 240 250 190 C 260 160 280 145 300 135 C 275 150 260 180 245 210 C 230 240 222 280 220 345 Z"
            fill="#5A280B"
          />
          <path
            d="M 175 345 C 185 280 188 220 200 170 C 212 220 215 280 225 345 Z"
            fill="#854D0E"
          />

          {/* Winding Branches */}
          <path
            d="M 195 200 Q 150 160 110 170 Q 150 185 190 215 Z"
            fill="#78350F"
          />
          <path
            d="M 205 200 Q 250 160 290 170 Q 250 185 210 215 Z"
            fill="#5A280B"
          />

          {/* Lush Green Foliage Back Layer (Warm deep olive green) */}
          <g className="animate-sway-leaves" fill="#3F6212" opacity="0.95">
            <circle cx="120" cy="140" r="65" />
            <circle cx="280" cy="140" r="65" />
            <circle cx="200" cy="85" r="75" />
          </g>

          {/* Lush Foliage Main Layer (Warm rich yellow-green) */}
          <g className="animate-sway" fill="#65A30D">
            <circle cx="145" cy="120" r="62" />
            <circle cx="255" cy="120" r="62" />
            <circle cx="200" cy="120" r="80" />
            <circle cx="160" cy="70" r="58" />
            <circle cx="240" cy="70" r="58" />
          </g>

          {/* Highlights & texture puffs (Warm bright lime/sprout green) */}
          <g fill="#84CC16" opacity="0.9">
            <circle cx="130" cy="100" r="35" />
            <circle cx="270" cy="100" r="35" />
            <circle cx="200" cy="65" r="45" />
            <circle cx="170" cy="135" r="40" />
            <circle cx="230" cy="135" r="40" />
          </g>
          <g fill="#BEF264" opacity="0.6">
            <circle cx="195" cy="50" r="22" />
            <circle cx="145" cy="85" r="18" />
            <circle cx="255" cy="85" r="18" />
          </g>

          {/* Normal Cute Red Apples */}
          <g>
            <circle cx="130" cy="145" r="8" fill="#DC2626" />
            <circle cx="128" cy="143" r="2.5" fill="#FCA5A5" />

            <circle cx="275" cy="135" r="8" fill="#DC2626" />
            <circle cx="273" cy="133" r="2.5" fill="#FCA5A5" />

            <circle cx="175" cy="75" r="8" fill="#DC2626" />
            <circle cx="173" cy="73" r="2.5" fill="#FCA5A5" />

            <circle cx="235" cy="80" r="8" fill="#DC2626" />
            <circle cx="233" cy="78" r="2.5" fill="#FCA5A5" />

            <circle cx="260" cy="165" r="8" fill="#DC2626" />
            <circle cx="258" cy="163" r="2.5" fill="#FCA5A5" />
          </g>
        </svg>

        {/* THE GOLDEN APPLE (Interactive Click Target!) */}
        <div className="absolute top-[32%] sm:top-[34%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto">
          <div className="relative group">
            {/* Pulsing Aura */}
            <div className="absolute -inset-4 rounded-full bg-amber-400/35 blur-md animate-ping pointer-events-none" />
            <div className="absolute -inset-6 rounded-full bg-radial from-amber-300/40 via-amber-400/20 to-transparent animate-pulse pointer-events-none" />

            {/* Sparkle Twinkles */}
            <div className="absolute -top-3 -right-3 text-amber-300 animate-twinkle pointer-events-none">
              ✨
            </div>
            <div
              className="absolute -bottom-2 -left-3 text-amber-200 animate-twinkle pointer-events-none"
              style={{ animationDelay: '-1s' }}
            >
              ⭐
            </div>

            {/* Clickable Golden Apple Button */}
            <button
              onClick={handleGoldenAppleClick}
              className="relative p-2.5 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 shadow-xl border-2 border-amber-200 animate-golden-apple transition-transform duration-200 hover:scale-125 focus:outline-hidden focus:ring-4 focus:ring-amber-300 cursor-pointer flex flex-col items-center justify-center group"
              title="황금사과를 눌러 모두의 공통 일정을 확인하세요!"
            >
              <div className="text-3xl sm:text-4xl filter drop-shadow-[0_4px_8px_rgba(202,138,4,0.6)]">
                🍏
              </div>
            </button>

            {/* Floating Speech Tooltip */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
              <div className="px-3 py-1 bg-amber-500 text-amber-950 font-bold text-xs rounded-full shadow-lg border border-amber-300 flex items-center gap-1.5 animate-bounce">
                <Sparkles className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
                <span>황금사과를 눌러보세요!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Foreground Rolling Meadow Grass (Warm sunny yellow-green gradient) */}
      <div className="absolute bottom-0 w-full pointer-events-none z-15">
        <svg
          viewBox="0 0 1200 240"
          className="w-full h-44 sm:h-52 md:h-60 drop-shadow-sm"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="warmMeadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#84CC16" />
              <stop offset="100%" stopColor="#65A30D" />
            </linearGradient>
          </defs>
          <path d="M 0 140 Q 300 80 600 130 T 1200 100 L 1200 240 L 0 240 Z" fill="url(#warmMeadowGrad)" />
        </svg>
      </div>

      {/* Deep foreground grass lip with flowers (Warm rich olive & sprout tones) */}
      <div className="absolute bottom-0 w-full pointer-events-none z-18">
        <svg
          viewBox="0 0 1200 140"
          className="w-full h-24 sm:h-28"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="deepMeadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#65A30D" />
              <stop offset="100%" stopColor="#4D7C0F" />
            </linearGradient>
          </defs>
          <path d="M 0 60 Q 350 20 700 70 T 1200 40 L 1200 140 L 0 140 Z" fill="url(#deepMeadowGrad)" />
        </svg>

        {/* Sprinkled Wildflowers & Sprouts along the warm meadow bottom */}
        <div className="absolute bottom-2 left-6 text-sm">🌼</div>
        <div className="absolute bottom-4 left-20 text-xs">🌱</div>
        <div className="absolute bottom-3 left-32 text-xs">🌸</div>
        <div className="absolute bottom-6 left-1/3 text-sm">🌻</div>
        <div className="absolute bottom-4 left-1/2 text-xs">🍀</div>
        <div className="absolute bottom-3 right-1/4 text-xs">🌼</div>
        <div className="absolute bottom-5 right-12 text-sm">🌺</div>
        <div className="absolute bottom-2 right-28 text-xs">🌱</div>
        <div className="absolute bottom-3 right-44 text-xs">🌸</div>
      </div>

      {/* PARTICIPANT AVATARS ROAMING ON THE MEADOW */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {participants.map((p, idx) => {
          // Dynamic distribution around the tree if not custom
          const posX = p.positionX || (15 + (idx * 70) / Math.max(1, participants.length - 1));
          const posY = p.positionY || (70 + (idx % 2) * 8);

          return (
            <div
              key={p.id}
              className="absolute pointer-events-auto transition-all duration-300"
              style={{
                left: `${posX}%`,
                top: `${posY}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <AvatarDisplay
                avatar={p.avatar}
                name={p.name}
                note={p.note}
                size="md"
                showSpeech={activeSpeechId === p.id || idx === 0}
                animated={true}
                onClick={() => handleAvatarClick(p)}
                selected={activeSpeechId === p.id}
              />
            </div>
          );
        })}

        {/* Cute "나도 참여하기 +" Signpost on the meadow */}
        <div
          className="absolute left-[10%] sm:left-[12%] bottom-[12%] sm:bottom-[15%] z-25 pointer-events-auto"
        >
          <button
            onClick={() => {
              if (soundEnabled) playPop(600);
              onAddParticipant();
            }}
            className="flex flex-col items-center p-2 rounded-2xl bg-white/95 hover:bg-white text-lime-950 text-xs font-semibold shadow-md border border-lime-300 transition-transform duration-150 hover:scale-105 active:scale-95 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-lime-600 text-white flex items-center justify-center shadow-xs group-hover:rotate-90 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="mt-1 text-[11px] whitespace-nowrap font-bold text-lime-900">나도 등록하기</span>
          </button>
        </div>
      </div>

      {/* Top Floating Meadow HUD */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Room Status & Participant Count */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 bg-white/90 backdrop-blur-xs rounded-full shadow-md border border-lime-200 flex items-center gap-2 text-xs text-slate-700">
            <Users className="w-4 h-4 text-lime-700" />
            <span className="font-semibold text-slate-900">{participants.length}명</span>
            <span>참여 중</span>
            <span className="text-slate-300">·</span>
            <CalendarCheck className="w-4 h-4 text-lime-700" />
            <span>{datesCount}일간 일정</span>
          </div>

          {confirmedSlot && (
            <div className="px-3 py-1.5 bg-amber-400 text-amber-950 font-bold rounded-full shadow-md text-xs flex items-center gap-1.5 animate-pulse">
              <span>🏆 약속 확정 완료!</span>
            </div>
          )}
        </div>

        {/* Right: Sound & Ambience Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setThemeMode((m) => (m === 'day' ? 'sunset' : 'day'))}
            className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-amber-600 shadow-md border border-slate-200 transition-colors"
            title={themeMode === 'day' ? '석양빛 들판으로 변경' : '화창한 낮으로 변경'}
          >
            {themeMode === 'day' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-rose-500" />}
          </button>

          <button
            onClick={() => setSoundEnabled((s) => !s)}
            className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-lime-700 shadow-md border border-slate-200 transition-colors"
            title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-lime-700" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={handleGoldenAppleClick}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-bold text-xs rounded-full shadow-lg border border-amber-300 hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>황금사과 공통 일정</span>
          </button>
        </div>
      </div>

      {/* Bottom Hint Strip */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="px-4 py-1.5 bg-[#2D4514]/85 backdrop-blur-xs rounded-full text-lime-100 text-xs font-medium shadow-lg flex items-center gap-2">
          <span>🍎 멤버 캐릭터를 누르면 시간표를 볼 수 있고, 나무 중앙의 황금사과를 누르면 모두가 가능한 시간이 나타납니다!</span>
        </div>
      </div>
    </div>
  );
};
