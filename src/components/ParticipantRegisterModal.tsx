import React, { useState } from 'react';
import { Participant, AvatarConfig, HairStyle, Accessory, Mood } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import { ScheduleGridEditor } from './ScheduleGridEditor';
import { X, Sparkles, User, ArrowRight, ArrowLeft, Check, Palette } from 'lucide-react';
import { playPop, playFanfare } from '../utils/sound';

interface ParticipantRegisterModalProps {
  initialParticipant?: Participant | null;
  dates: string[];
  startHour: number;
  endHour: number;
  onSave: (participant: Participant) => void;
  onClose: () => void;
}

const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: '#FCE6D2',
  hairStyle: 'short',
  hairColor: '#4A3728',
  shirtColor: '#3B82F6',
  pantsColor: '#1E293B',
  accessory: 'none',
  mood: 'happy',
};

const SKIN_COLORS = ['#FCE6D2', '#F7D0B2', '#E2A77E', '#C68642', '#8D5524'];
const HAIR_COLORS = ['#1E1E1E', '#4A3728', '#854D0E', '#C27C38', '#E6C687', '#3B82F6', '#EC4899'];
const SHIRT_COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B'];
const PANTS_COLORS = ['#1E293B', '#334155', '#475569', '#78350F', '#15803D'];

export const ParticipantRegisterModal: React.FC<ParticipantRegisterModalProps> = ({
  initialParticipant,
  dates,
  startHour,
  endHour,
  onSave,
  onClose,
}) => {
  const [step, setStep] = useState<'profile' | 'schedule'>('profile');
  const [name, setName] = useState(initialParticipant?.name || '');
  const [note, setNote] = useState(initialParticipant?.note || '');
  const [avatar, setAvatar] = useState<AvatarConfig>(initialParticipant?.avatar || DEFAULT_AVATAR);
  const [availableSlots, setAvailableSlots] = useState<Record<string, boolean>>(
    initialParticipant?.availableSlots || {}
  );
  const [nameError, setNameError] = useState('');

  const isEditing = !!initialParticipant;

  const handleNextToSchedule = () => {
    if (!name.trim()) {
      setNameError('이름이나 닉네임을 입력해주세요!');
      return;
    }
    setNameError('');
    playPop(520);
    setStep('schedule');
  };

  const handleFinish = () => {
    const selectedCount = Object.values(availableSlots).filter(Boolean).length;
    if (selectedCount === 0) {
      // Just a mild warning if empty, but still allow
    }

    const participant: Participant = {
      id: initialParticipant?.id || `p-${Date.now()}`,
      name: name.trim(),
      note: note.trim() || '약속이 기대돼요! 🍎',
      avatar,
      positionX: initialParticipant?.positionX || Math.floor(Math.random() * 60 + 20),
      positionY: initialParticipant?.positionY || Math.floor(Math.random() * 16 + 72),
      availableSlots,
      updatedAt: Date.now(),
    };

    playFanfare();
    onSave(participant);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍎</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {isEditing ? `${name} 님의 일정 수정` : '새 멤버 등록 & 아바타 만들기'}
              </h2>
              <p className="text-xs text-emerald-100">
                {step === 'profile'
                  ? '1단계: 내 이름과 귀여운 캐릭터 꾸미기'
                  : '2단계: 내가 만날 수 있는 가능한 시간표 칠하기'}
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {step === 'profile' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Live Avatar Preview */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-5 bg-gradient-to-b from-sky-50 to-emerald-50 rounded-2xl border border-emerald-100 shadow-inner">
                <span className="text-xs font-semibold text-emerald-800 mb-2">
                  내 아바타 실시간 미리보기
                </span>
                <div className="py-2">
                  <AvatarDisplay
                    avatar={avatar}
                    name={name.trim() || '내 캐릭터'}
                    note={note.trim() || '안녕! 반가워!'}
                    size="lg"
                    showSpeech={true}
                    animated={true}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 text-center">
                  들판에서 살랑살랑 움직이며 친구들을 맞이해요!
                </p>
              </div>

              {/* Right Column: Name & Customization Controls */}
              <div className="md:col-span-7 space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    이름 / 닉네임 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    placeholder="예: 민지, 서준, 토마토"
                    maxLength={15}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  {nameError && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">{nameError}</p>
                  )}
                </div>

                {/* Status / Note Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    한 줄 메모 (말풍선으로 표시돼요)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="예: 주말 저녁 선호! 맛있는 거 먹자"
                    maxLength={30}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Hair Style */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    헤어스타일
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5 text-xs">
                    {(
                      [
                        { id: 'short', label: '단정한 숏' },
                        { id: 'bob', label: '찰랑 단발' },
                        { id: 'curly', label: '뽀글 펌' },
                        { id: 'ponytail', label: '포니테일' },
                        { id: 'cap', label: '야구모자' },
                        { id: 'beanie', label: '비니 모자' },
                        { id: 'ribbon', label: '리본 머리' },
                      ] as const
                    ).map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => {
                          setAvatar((prev) => ({ ...prev, hairStyle: h.id }));
                          playPop(440);
                        }}
                        className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                          avatar.hairStyle === h.id
                            ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair & Skin Palette */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">머리색</label>
                    <div className="flex flex-wrap gap-1.5">
                      {HAIR_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setAvatar((prev) => ({ ...prev, hairColor: c }))}
                          className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                            avatar.hairColor === c
                              ? 'scale-115 border-emerald-600 shadow-xs'
                              : 'border-white hover:scale-105'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">피부톤</label>
                    <div className="flex flex-wrap gap-1.5">
                      {SKIN_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setAvatar((prev) => ({ ...prev, skinColor: c }))}
                          className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                            avatar.skinColor === c
                              ? 'scale-115 border-emerald-600 shadow-xs'
                              : 'border-white hover:scale-105'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Shirt Color */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">상의 컬러</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SHIRT_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setAvatar((prev) => ({ ...prev, shirtColor: c }))}
                        className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                          avatar.shirtColor === c
                            ? 'scale-115 border-emerald-600 shadow-xs'
                            : 'border-white hover:scale-105'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Accessories */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">액세서리</label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {(
                      [
                        { id: 'none', label: '없음' },
                        { id: 'apple_pin', label: '🍎 사과핀' },
                        { id: 'clover', label: '🍀 클로버' },
                        { id: 'flower', label: '🌸 꽃송이' },
                        { id: 'glasses', label: '👓 동글안경' },
                        { id: 'sunglasses', label: '🕶️ 선글라스' },
                        { id: 'star', label: '⭐ 별빛' },
                      ] as const
                    ).map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          setAvatar((prev) => ({ ...prev, accessory: acc.id }));
                          playPop(460);
                        }}
                        className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                          avatar.accessory === acc.id
                            ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {acc.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mood Expression */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">표정 & 기분</label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {(
                      [
                        { id: 'happy', label: '😊 활짝 미소' },
                        { id: 'excited', label: '🤩 눈 초롱초롱' },
                        { id: 'chill', label: '😎 시크 여유' },
                        { id: 'sparkle', label: '😉 윙크 깜찍' },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setAvatar((prev) => ({ ...prev, mood: m.id }));
                          playPop(480);
                        }}
                        className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                          avatar.mood === m.id
                            ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <AvatarDisplay avatar={avatar} name={name} size="sm" animated={false} />
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    {name} 님이 만날 수 있는 가능한 시간을 모두 칠해주세요!
                  </h3>
                  <p className="text-xs text-emerald-700">
                    많이 선택할수록 황금사과에서 모두가 만날 확률이 쑥쑥 올라가요.
                  </p>
                </div>
              </div>

              <ScheduleGridEditor
                dates={dates}
                startHour={startHour}
                endHour={endHour}
                availableSlots={availableSlots}
                onChange={setAvailableSlots}
                participantName={name}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200 shrink-0">
          {step === 'profile' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleNextToSchedule}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>다음: 내 시간표 칠하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep('profile')}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>이전 (프로필 수정)</span>
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>들판으로 참여 완료하기!</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
