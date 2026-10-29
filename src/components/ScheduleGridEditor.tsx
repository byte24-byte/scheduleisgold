import React, { useState, useRef, useCallback } from 'react';
import { formatKoreanDate } from '../utils/calendar';
import { playPop } from '../utils/sound';
import { Check, Sparkles, RotateCcw, Calendar, CheckSquare } from 'lucide-react';

interface ScheduleGridEditorProps {
  dates: string[];
  startHour: number;
  endHour: number;
  availableSlots: Record<string, boolean>;
  onChange: (slots: Record<string, boolean>) => void;
  participantName?: string;
}

export const ScheduleGridEditor: React.FC<ScheduleGridEditorProps> = ({
  dates,
  startHour,
  endHour,
  availableSlots,
  onChange,
  participantName = '내',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPaintValue, setDragPaintValue] = useState<boolean>(true);
  const gridRef = useRef<HTMLDivElement>(null);

  const hours: number[] = [];
  for (let h = startHour; h <= endHour; h++) {
    hours.push(h);
  }

  const selectedCount = Object.values(availableSlots).filter(Boolean).length;

  const toggleSlot = useCallback(
    (slotKey: string, forceValue?: boolean) => {
      const nextVal = forceValue !== undefined ? forceValue : !availableSlots[slotKey];
      const updated = { ...availableSlots };
      if (nextVal) {
        updated[slotKey] = true;
      } else {
        delete updated[slotKey];
      }
      onChange(updated);
      playPop(nextVal ? 480 : 360);
    },
    [availableSlots, onChange]
  );

  const handleMouseDown = (slotKey: string) => {
    const nextState = !availableSlots[slotKey];
    setDragPaintValue(nextState);
    setIsDragging(true);
    toggleSlot(slotKey, nextState);
  };

  const handleMouseEnter = (slotKey: string) => {
    if (isDragging) {
      if (availableSlots[slotKey] !== dragPaintValue) {
        toggleSlot(slotKey, dragPaintValue);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile dragging
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !gridRef.current) return;
    const touch = e.touches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (targetElement) {
      const slotKey = targetElement.getAttribute('data-slot-key');
      if (slotKey && availableSlots[slotKey] !== dragPaintValue) {
        toggleSlot(slotKey, dragPaintValue);
      }
    }
  };

  // Preset Handlers
  const handleSelectAll = () => {
    const updated: Record<string, boolean> = {};
    dates.forEach((d) => {
      hours.forEach((h) => {
        updated[`${d}_${h}`] = true;
      });
    });
    onChange(updated);
    playPop(520);
  };

  const handleClearAll = () => {
    onChange({});
    playPop(300);
  };

  const handleSelectWeekendAll = () => {
    const updated = { ...availableSlots };
    dates.forEach((d) => {
      const dayOfWeek = new Date(d).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Sun or Sat
        hours.forEach((h) => {
          updated[`${d}_${h}`] = true;
        });
      }
    });
    onChange(updated);
    playPop(500);
  };

  const handleSelectEvenings = () => {
    const updated = { ...availableSlots };
    dates.forEach((d) => {
      hours.forEach((h) => {
        if (h >= 18) {
          updated[`${d}_${h}`] = true;
        }
      });
    });
    onChange(updated);
    playPop(500);
  };

  const handleSelectAfternoon = () => {
    const updated = { ...availableSlots };
    dates.forEach((d) => {
      hours.forEach((h) => {
        if (h >= 13 && h <= 18) {
          updated[`${d}_${h}`] = true;
        }
      });
    });
    onChange(updated);
    playPop(500);
  };

  return (
    <div
      className="flex flex-col gap-4 no-select"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Presets & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-900">
            {participantName} 가능 시간:
          </span>
          <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-full tabular-nums">
            {selectedCount}개 시간대
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            (드래그하거나 터치하여 한 번에 칠할 수 있어요)
          </span>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-white hover:bg-emerald-100/60 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            모두 가능
          </button>
          <button
            type="button"
            onClick={handleSelectWeekendAll}
            className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-white hover:bg-emerald-100/60 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            주말 올데이
          </button>
          <button
            type="button"
            onClick={handleSelectAfternoon}
            className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-white hover:bg-emerald-100/60 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            오후 (13~18시)
          </button>
          <button
            type="button"
            onClick={handleSelectEvenings}
            className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-white hover:bg-emerald-100/60 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            저녁 (18시~)
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="px-2 py-1 text-xs font-medium text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>비우기</span>
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div
        ref={gridRef}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className="w-full overflow-x-auto pb-2 border border-slate-200 rounded-2xl bg-white shadow-xs"
      >
        <table className="w-full border-collapse text-xs select-none">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <th className="py-2.5 px-3 font-semibold text-center w-16 border-r border-slate-200 bg-slate-100/80 sticky left-0 z-10">
                시간
              </th>
              {dates.map((date) => {
                const dayOfWeek = new Date(date).getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                return (
                  <th
                    key={date}
                    className={`py-2.5 px-2 font-semibold text-center min-w-[90px] border-r border-slate-200 last:border-r-0 ${
                      isWeekend ? 'text-amber-800 bg-amber-50/50' : 'text-slate-800'
                    }`}
                  >
                    <div>{formatKoreanDate(date)}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => {
              const hourLabel = `${hour.toString().padStart(2, '0')}:00`;

              return (
                <tr key={hour} className="border-b border-slate-100 last:border-b-0">
                  {/* Time Row Header */}
                  <td className="py-1.5 px-2 text-center font-mono text-[11px] text-slate-500 border-r border-slate-200 bg-slate-50/70 sticky left-0 z-10 tabular-nums">
                    {hourLabel}
                  </td>

                  {/* Date Slots */}
                  {dates.map((date) => {
                    const slotKey = `${date}_${hour}`;
                    const isAvailable = !!availableSlots[slotKey];

                    return (
                      <td
                        key={slotKey}
                        data-slot-key={slotKey}
                        onMouseDown={() => handleMouseDown(slotKey)}
                        onMouseEnter={() => handleMouseEnter(slotKey)}
                        className={`h-9 px-1 text-center cursor-pointer transition-colors duration-100 border-r border-slate-100 last:border-r-0 ${
                          isAvailable
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-inner'
                            : 'bg-white hover:bg-emerald-50 text-transparent hover:text-emerald-300'
                        }`}
                      >
                        <div
                          data-slot-key={slotKey}
                          className="w-full h-full flex items-center justify-center pointer-events-none"
                        >
                          {isAvailable ? (
                            <span className="flex items-center gap-1 text-[11px] drop-shadow-xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span className="hidden sm:inline">가능</span>
                            </span>
                          ) : (
                            <span className="text-[10px] opacity-40">·</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Guide Note */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>💡 마우스를 꾹 누른 채로 움직이면 여러 시간을 연속으로 칠할 수 있어요.</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-emerald-500" />
            <span>가능</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-white border border-slate-300" />
            <span>불가능</span>
          </div>
        </div>
      </div>
    </div>
  );
};
