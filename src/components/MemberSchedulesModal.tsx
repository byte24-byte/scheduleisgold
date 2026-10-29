import React, { useState } from 'react';
import { MeetingRoom, Participant } from '../types';
import { formatKoreanDate } from '../utils/calendar';
import { AvatarDisplay } from './AvatarDisplay';
import { X, User, Edit3, Trash2, Clock, Check, Plus } from 'lucide-react';
import { playPop } from '../utils/sound';

interface MemberSchedulesModalProps {
  room: MeetingRoom;
  selectedParticipantId?: string;
  onEditParticipant: (participant: Participant) => void;
  onDeleteParticipant: (participantId: string) => void;
  onAddNewParticipant: () => void;
  onClose: () => void;
}

export const MemberSchedulesModal: React.FC<MemberSchedulesModalProps> = ({
  room,
  selectedParticipantId,
  onEditParticipant,
  onDeleteParticipant,
  onAddNewParticipant,
  onClose,
}) => {
  const { dates, startHour, endHour, participants } = room;
  const [currentId, setCurrentId] = useState<string>(
    selectedParticipantId || participants[0]?.id || ''
  );

  const activeParticipant = participants.find((p) => p.id === currentId) || participants[0];

  const hours: number[] = [];
  for (let h = startHour; h <= endHour; h++) {
    hours.push(h);
  }

  const activeSlotsCount = activeParticipant
    ? Object.values(activeParticipant.availableSlots).filter(Boolean).length
    : 0;

  const handleSelectMember = (id: string) => {
    setCurrentId(id);
    playPop(480);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-700 text-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold">참여자별 개별 시간표 보기</h2>
              <p className="text-xs text-emerald-100">
                각 친구들이 언제 시간이 되는지 개별적으로 꼼꼼히 확인해보세요!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Selector Row */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 overflow-x-auto shrink-0 flex items-center gap-2.5">
          {participants.map((p) => {
            const isSelected = p.id === currentId;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectMember(p.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl border transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs'
                    : 'bg-white/70 hover:bg-white border-slate-200 text-slate-700'
                }`}
              >
                <div className="w-7 h-7 flex items-center justify-center overflow-hidden">
                  <AvatarDisplay
                    avatar={p.avatar}
                    size="sm"
                    animated={false}
                    className="scale-65 -mt-1"
                  />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">{p.name}</div>
                  <div className="text-[10px] text-slate-500">
                    {Object.values(p.availableSlots).filter(Boolean).length}시간 가능
                  </div>
                </div>
              </button>
            );
          })}

          <button
            onClick={onAddNewParticipant}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-dashed border-emerald-400 bg-emerald-50/60 hover:bg-emerald-100/60 text-emerald-800 text-xs font-bold shrink-0 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>새 친구 등록</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {activeParticipant ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Member Profile Card */}
              <div className="lg:col-span-4 p-5 rounded-2xl bg-gradient-to-b from-sky-50 to-emerald-50 border border-emerald-100 flex flex-col items-center text-center">
                <AvatarDisplay
                  avatar={activeParticipant.avatar}
                  name={activeParticipant.name}
                  note={activeParticipant.note}
                  size="lg"
                  showSpeech={true}
                  animated={true}
                />

                <div className="mt-4 w-full pt-3 border-t border-emerald-200/60 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>가능한 시간 수:</span>
                    <span className="font-bold text-emerald-800 tabular-nums">
                      {activeSlotsCount} 시간
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>남긴 한 줄 메모:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[140px]">
                      {activeParticipant.note || '없음'}
                    </span>
                  </div>
                </div>

                <div className="mt-5 w-full flex items-center gap-2">
                  <button
                    onClick={() => onEditParticipant(activeParticipant)}
                    className="flex-1 py-2 px-3 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>시간표 수정</span>
                  </button>

                  {participants.length > 1 && (
                    <button
                      onClick={() => onDeleteParticipant(activeParticipant.id)}
                      className="p-2 text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                      title="이 멤버 삭제하기"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Individual Timetable Grid */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>{activeParticipant.name} 님의 가능 시간표</span>
                  </h3>
                  <span className="text-xs text-emerald-700 font-semibold">
                    초록색 칸이 {activeParticipant.name} 님이 선택한 시간입니다
                  </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto max-h-[380px] border border-slate-200 rounded-2xl bg-white shadow-xs">
                  <table className="w-full border-collapse text-xs select-none">
                    <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="py-2 px-3 font-semibold text-center w-16 border-r border-slate-200 bg-slate-100 sticky left-0 z-20">
                          시간
                        </th>
                        {dates.map((date) => (
                          <th
                            key={date}
                            className="py-2 px-2 font-semibold text-center min-w-[85px] border-r border-slate-200 last:border-r-0"
                          >
                            {formatKoreanDate(date)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {hours.map((hour) => {
                        const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
                        return (
                          <tr key={hour} className="border-b border-slate-100 last:border-b-0">
                            <td className="py-1.5 px-2 text-center font-mono text-[11px] text-slate-500 bg-slate-50/80 border-r border-slate-200 sticky left-0 z-10 tabular-nums">
                              {hourLabel}
                            </td>
                            {dates.map((date) => {
                              const slotKey = `${date}_${hour}`;
                              const isAvailable = !!activeParticipant.availableSlots[slotKey];

                              return (
                                <td
                                  key={slotKey}
                                  className={`h-8 text-center border-r border-slate-100 last:border-r-0 ${
                                    isAvailable
                                      ? 'bg-emerald-500 text-white font-bold'
                                      : 'bg-white text-slate-300'
                                  }`}
                                >
                                  {isAvailable ? (
                                    <div className="flex items-center justify-center gap-1">
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      <span className="text-[10px]">가능</span>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] opacity-40">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">등록된 멤버가 없습니다.</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 bg-slate-50 border-t border-slate-200 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
          >
            들판으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
