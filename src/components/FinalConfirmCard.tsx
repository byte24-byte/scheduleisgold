import React, { useState } from 'react';
import { MeetingRoom } from '../types';
import { formatKoreanDate, downloadICSFile } from '../utils/calendar';
import { AvatarDisplay } from './AvatarDisplay';
import { X, Calendar, MapPin, Users, Download, Share2, Check, RotateCcw } from 'lucide-react';
import { playPop } from '../utils/sound';

interface FinalConfirmCardProps {
  room: MeetingRoom;
  slotKey: string;
  onResetConfirmation: () => void;
  onClose: () => void;
}

export const FinalConfirmCard: React.FC<FinalConfirmCardProps> = ({
  room,
  slotKey,
  onResetConfirmation,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const [dateStr, hourStr] = slotKey.split('_');
  const hour = parseInt(hourStr, 10);

  const formattedDateTime = formatKoreanDate(dateStr, hour);
  const attendingMembers = room.participants.filter(
    (p) => p.availableSlots[slotKey] === true
  );

  const shareText = `[🍎 황금사과 약속 확정 알림]\n\n우리들의 모임 일정이 확정되었어요!\n\n📌 모임명: ${room.title}\n📅 일시: ${formattedDateTime}\n📍 장소: ${room.location || '추후 공지'}\n👥 참석 멤버: ${attendingMembers.map((m) => m.name).join(', ')}\n\n사과나무 아래에서 만나요! ✨`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    playPop(650);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadICS = () => {
    downloadICSFile(room.title, room.description, room.location, dateStr, hour);
    playPop(520);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Ticket Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 text-amber-950 text-center shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-amber-950/70 hover:text-amber-950 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/90 shadow-md text-3xl mb-2">
            🍏
          </div>
          <h2 className="text-xl font-extrabold text-amber-950">모임 일정 최종 확정!</h2>
          <p className="text-xs text-amber-950/80 font-medium">황금사과의 축복으로 약속이 성사되었어요</p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto bg-amber-50/30">
          {/* Main Appointment Box */}
          <div className="p-5 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-3.5">
            <div>
              <span className="text-[11px] font-bold text-amber-800 tracking-wider">
                MEETUP PASS · 약속 티켓
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{room.title}</h3>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-emerald-900 text-sm">{formattedDateTime}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{room.location || '장소는 단체 대화방에서 정하기'}</span>
              </div>

              <div className="flex items-start gap-2 text-slate-700 pt-1">
                <Users className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800 mb-1">
                    참석자 명단 ({attendingMembers.length}명)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {attendingMembers.map((m) => (
                      <span
                        key={m.id}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium"
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Participating Avatars Lineup */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-center -space-x-3 py-1">
              {attendingMembers.map((m) => (
                <div
                  key={m.id}
                  className="w-10 h-10 rounded-full bg-white border-2 border-emerald-200 shadow-xs flex items-center justify-center overflow-hidden"
                >
                  <AvatarDisplay
                    avatar={m.avatar}
                    size="sm"
                    animated={false}
                    className="scale-75 -mt-1.5"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleCopy}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>약속 안내 문구가 복사되었습니다!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>카카오톡 / 메신저 약속 공유 문구 복사</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadICS}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>캘린더 등록 파일 다운로드 (.ics)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-t border-slate-200 shrink-0 text-xs">
          <button
            onClick={onResetConfirmation}
            className="text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>일정 다시 조율하기 (확정 취소)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            확인 완료
          </button>
        </div>
      </div>
    </div>
  );
};
