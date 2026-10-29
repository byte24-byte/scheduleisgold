import React, { useState } from 'react';
import { MeetingRoom } from '../types';
import { X, Settings, Calendar, MapPin, Clock, RotateCcw, Check } from 'lucide-react';
import { playPop } from '../utils/sound';

interface RoomSettingsModalProps {
  room: MeetingRoom;
  onSave: (updated: Partial<MeetingRoom>) => void;
  onResetDemo: () => void;
  onClose: () => void;
}

export const RoomSettingsModal: React.FC<RoomSettingsModalProps> = ({
  room,
  onSave,
  onResetDemo,
  onClose,
}) => {
  const [title, setTitle] = useState(room.title);
  const [description, setDescription] = useState(room.description);
  const [location, setLocation] = useState(room.location);
  const [startHour, setStartHour] = useState(room.startHour);
  const [endHour, setEndHour] = useState(room.endHour);
  const [datesText, setDatesText] = useState(room.dates.join(', '));

  const handleSave = () => {
    // Parse dates
    const parsedDates = datesText
      .split(',')
      .map((d) => d.trim())
      .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));

    const finalDates = parsedDates.length > 0 ? parsedDates : room.dates;

    onSave({
      title: title.trim() || '우리들의 약속 모임',
      description: description.trim(),
      location: location.trim(),
      startHour: Math.max(6, Math.min(startHour, endHour - 1)),
      endHour: Math.min(24, Math.max(endHour, startHour + 1)),
      dates: finalDates,
    });
    playPop(520);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">모임 설정 및 시간표 범위 변경</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">모임명</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="예: 주말 브런치 & 카페 투어"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">모임 소개 / 메모</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
              placeholder="모임에 대한 짧은 소개를 적어주세요"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">장소</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="예: 강남역 11번 출구 또는 성수동"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              조율할 날짜 목록 (YYYY-MM-DD 형식, 쉼표 구분)
            </label>
            <input
              type="text"
              value={datesText}
              onChange={(e) => setDatesText(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="2026-10-30, 2026-10-31, 2026-11-01"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">시작 시간 (시)</label>
              <select
                value={startHour}
                onChange={(e) => setStartHour(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono"
              >
                {Array.from({ length: 15 }, (_, i) => i + 6).map((h) => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">종료 시간 (시)</label>
              <select
                value={endHour}
                onChange={(e) => setEndHour(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono"
              >
                {Array.from({ length: 15 }, (_, i) => i + 10).map((h) => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Demo Reset */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-slate-500">예시 샘플 데이터 다시 불러오기</span>
            <button
              type="button"
              onClick={() => {
                onResetDemo();
                onClose();
              }}
              className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>샘플 친구들 초기화</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-t border-slate-200 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>설정 저장하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
