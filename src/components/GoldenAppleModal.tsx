import React, { useState, useMemo } from 'react';
import { MeetingRoom, Participant, SlotAnalysis } from '../types';
import { analyzeSlots, getRankedBestSlots } from '../utils/scheduleAnalysis';
import { formatKoreanDate } from '../utils/calendar';
import { AvatarDisplay } from './AvatarDisplay';
import { X, Sparkles, Trophy, Vote, CheckCircle2, Users, Calendar, ArrowRight, Share2, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playFanfare, playPop } from '../utils/sound';

interface GoldenAppleModalProps {
  room: MeetingRoom;
  onVote: (slotKey: string, participantId: string) => void;
  onConfirmSchedule: (slotKey: string) => void;
  onClose: () => void;
  onOpenFinalPass: (slotKey: string) => void;
}

export const GoldenAppleModal: React.FC<GoldenAppleModalProps> = ({
  room,
  onVote,
  onConfirmSchedule,
  onClose,
  onOpenFinalPass,
}) => {
  const { dates, startHour, endHour, participants, votes, confirmedSlot } = room;
  const total = participants.length;

  const analyzedSlots = useMemo(() => analyzeSlots(room), [room]);
  const rankedSlots = useMemo(() => getRankedBestSlots(analyzedSlots, 4), [analyzedSlots]);

  // Initially select the #1 best slot or confirmed slot
  const defaultSelectedKey = confirmedSlot || (rankedSlots[0] ? rankedSlots[0].slotKey : `${dates[0]}_${startHour}`);
  const [selectedSlotKey, setSelectedSlotKey] = useState<string>(defaultSelectedKey);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'voting'>('heatmap');
  const [currentVoterId, setCurrentVoterId] = useState<string>(participants[0]?.id || '');

  const selectedSlot = useMemo(() => {
    return analyzedSlots.find((s) => s.slotKey === selectedSlotKey) || analyzedSlots[0];
  }, [analyzedSlots, selectedSlotKey]);

  const hours: number[] = [];
  for (let h = startHour; h <= endHour; h++) {
    hours.push(h);
  }

  const handleCellClick = (slotKey: string) => {
    setSelectedSlotKey(slotKey);
    playPop(520);
  };

  const handleVoteClick = (slotKey: string) => {
    if (!currentVoterId) return;
    playPop(620);
    onVote(slotKey, currentVoterId);
  };

  const handleConfirm = (slotKey: string) => {
    playFanfare();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#EC4899', '#3B82F6', '#FCD34D'],
    });
    onConfirmSchedule(slotKey);
  };

  // Helper for heatmap cell color
  const getCellBgClass = (count: number, isGolden: boolean, isSelected: boolean) => {
    if (total === 0 || count === 0) {
      return isSelected
        ? 'bg-slate-200 border-2 border-amber-400'
        : 'bg-slate-100 hover:bg-slate-200 text-slate-400';
    }
    if (isGolden) {
      return isSelected
        ? 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-amber-950 font-bold border-2 border-white ring-2 ring-amber-400 shadow-md animate-pulse'
        : 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-amber-950 font-bold hover:brightness-110 shadow-xs';
    }
    const ratio = count / total;
    if (ratio >= 0.75) {
      return isSelected
        ? 'bg-emerald-600 text-white font-bold border-2 border-amber-400 ring-2 ring-amber-400 shadow-md'
        : 'bg-emerald-600 text-white hover:bg-emerald-700 font-semibold';
    }
    if (ratio >= 0.5) {
      return isSelected
        ? 'bg-emerald-500 text-white font-semibold border-2 border-amber-400 ring-2 ring-amber-400 shadow-md'
        : 'bg-emerald-500 text-white hover:bg-emerald-600';
    }
    if (ratio >= 0.25) {
      return isSelected
        ? 'bg-emerald-300 text-emerald-950 font-medium border-2 border-amber-400 ring-2 ring-amber-400'
        : 'bg-emerald-200 text-emerald-950 hover:bg-emerald-300';
    }
    return isSelected
      ? 'bg-emerald-100 text-emerald-900 border-2 border-amber-400'
      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header with Golden Apple Glow */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 text-slate-900 shrink-0 overflow-hidden">
          {/* Background sparkles */}
          <div className="absolute top-2 right-12 text-2xl animate-twinkle pointer-events-none">✨</div>
          <div className="absolute bottom-1 left-32 text-xl animate-twinkle pointer-events-none" style={{ animationDelay: '-1s' }}>⭐</div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-200/90 flex items-center justify-center text-3xl shadow-inner border border-amber-300">
                🍏
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-extrabold text-amber-950">
                    황금사과 공통 시간표 & 투표
                  </h2>
                  <span className="px-2 py-0.5 bg-amber-300/80 text-amber-950 text-xs font-bold rounded-full">
                    참여 {total}명
                  </span>
                </div>
                <p className="text-xs text-amber-950/80 font-medium mt-0.5">
                  사과나무에서 발견한 모두가 가능한 최적의 골든 타임입니다!
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-amber-950/80 hover:text-amber-950 hover:bg-white/30 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-amber-300/60">
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'heatmap'
                  ? 'bg-white text-emerald-900 shadow-md'
                  : 'text-amber-950/80 hover:bg-white/20'
              }`}
            >
              📊 전체 공통 시간 히트맵
            </button>
            <button
              onClick={() => setActiveTab('voting')}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'voting'
                  ? 'bg-white text-emerald-900 shadow-md'
                  : 'text-amber-950/80 hover:bg-white/20'
              }`}
            >
              <Vote className="w-3.5 h-3.5" />
              <span>🏆 베스트 후보 투표 및 확정</span>
              {confirmedSlot && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {activeTab === 'heatmap' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Heatmap Timetable */}
              <div className="lg:col-span-7 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>시간대별 참석 가능 인원 히트맵</span>
                  </div>
                  <span className="text-[11px] text-slate-500">칸을 누르면 상세 인원이 떠요</span>
                </div>

                {/* Grid */}
                <div className="overflow-x-auto max-h-[380px] border border-slate-200 rounded-xl">
                  <table className="w-full border-collapse text-xs select-none">
                    <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
                      <tr className="border-b border-slate-200 text-slate-700">
                        <th className="py-2 px-2.5 font-semibold text-center w-14 bg-slate-200/80 border-r border-slate-200 sticky left-0 z-20">
                          시간
                        </th>
                        {dates.map((date) => (
                          <th
                            key={date}
                            className="py-2 px-2 font-semibold text-center min-w-[80px] border-r border-slate-200 last:border-r-0 text-slate-800"
                          >
                            <div>{formatKoreanDate(date)}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {hours.map((hour) => {
                        const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
                        return (
                          <tr key={hour} className="border-b border-slate-100 last:border-b-0">
                            <td className="py-1 px-1.5 text-center font-mono text-[11px] text-slate-500 bg-slate-50 border-r border-slate-200 sticky left-0 z-10 tabular-nums">
                              {hourLabel}
                            </td>
                            {dates.map((date) => {
                              const slotKey = `${date}_${hour}`;
                              const slot = analyzedSlots.find((s) => s.slotKey === slotKey);
                              const count = slot?.availableCount || 0;
                              const isGolden = !!slot?.isGolden;
                              const isSelected = selectedSlotKey === slotKey;

                              return (
                                <td
                                  key={slotKey}
                                  onClick={() => handleCellClick(slotKey)}
                                  className={`h-8 text-center cursor-pointer transition-all border-r border-slate-100 last:border-r-0 ${getCellBgClass(
                                    count,
                                    isGolden,
                                    isSelected
                                  )}`}
                                  title={`${formatKoreanDate(date, hour)}: ${count}/${total}명 가능`}
                                >
                                  <div className="flex items-center justify-center gap-0.5">
                                    {isGolden ? (
                                      <span className="text-[11px]">🍏 {count}</span>
                                    ) : count > 0 ? (
                                      <span className="text-[11px] font-semibold tabular-nums">
                                        {count}
                                      </span>
                                    ) : (
                                      <span className="text-[10px] opacity-30">0</span>
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

                {/* Heatmap Legend */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100 gap-2">
                  <span className="text-[11px] text-slate-500">참석 비율:</span>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300" />
                      <span>0명</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-emerald-200" />
                      <span>~50%</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-emerald-600" />
                      <span>75%+</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-amber-400 border border-amber-300" />
                      <span className="font-bold text-amber-800">전원 가능 🍏</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Selected Slot Details & Top Ranked */}
              <div className="lg:col-span-5 space-y-4">
                {/* Selected Slot Card */}
                {selectedSlot && (
                  <div
                    className={`p-5 rounded-2xl border shadow-sm transition-all ${
                      selectedSlot.isGolden
                        ? 'bg-gradient-to-b from-amber-50 to-amber-100/50 border-amber-300 ring-2 ring-amber-300/50'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          {selectedSlot.isGolden && (
                            <span className="text-amber-600 font-bold text-xs flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>황금 골든타임!</span>
                            </span>
                          )}
                          <span className="text-xs text-slate-500 font-medium">선택된 시간</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">
                          {formatKoreanDate(selectedSlot.date, selectedSlot.hour)}
                        </h3>
                      </div>

                      <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>
                          {selectedSlot.availableCount} / {total}명 가능 ({selectedSlot.percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Available Members List */}
                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>참석 가능한 친구 ({selectedSlot.availableParticipants.length}명)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedSlot.availableParticipants.length > 0 ? (
                          selectedSlot.availableParticipants.map((p) => (
                            <div
                              key={p.id}
                              className="px-2.5 py-1 bg-white rounded-xl border border-emerald-200 shadow-2xs flex items-center gap-1.5"
                            >
                              <AvatarDisplay
                                avatar={p.avatar}
                                size="sm"
                                animated={false}
                                className="w-5 h-5 -ml-1 scale-75"
                              />
                              <span className="text-xs font-semibold text-slate-800">{p.name}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">참석 가능한 멤버가 없습니다.</span>
                        )}
                      </div>
                    </div>

                    {/* Unavailable Members */}
                    {selectedSlot.unavailableParticipants.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-100">
                        <div className="text-xs text-slate-500 flex items-center gap-1 mb-1.5">
                          <span>아쉬운 친구 ({selectedSlot.unavailableParticipants.length}명)</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedSlot.unavailableParticipants.map((p) => (
                            <span
                              key={p.id}
                              className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg"
                            >
                              {p.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action */}
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                      <button
                        onClick={() => handleConfirm(selectedSlot.slotKey)}
                        className="flex-1 py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Trophy className="w-4 h-4 text-amber-300" />
                        <span>이 시간으로 바로 확정하기</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Best 3 Quick Recommendations */}
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <span>골든 타임 베스트 랭킹 TOP 3</span>
                  </div>

                  <div className="space-y-1.5">
                    {rankedSlots.slice(0, 3).map((slot, index) => {
                      const medal = ['🥇', '🥈', '🥉'][index];
                      return (
                        <div
                          key={slot.slotKey}
                          onClick={() => handleCellClick(slot.slotKey)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            selectedSlotKey === slot.slotKey
                              ? 'bg-amber-200/90 border-amber-400 shadow-xs'
                              : 'bg-white hover:bg-amber-100/50 border-amber-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{medal}</span>
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {formatKoreanDate(slot.date, slot.hour)}
                              </div>
                              <div className="text-[11px] text-emerald-700 font-medium">
                                {slot.isGolden
                                  ? '🎉 전원 가능 (100%)'
                                  : `${slot.availableCount}명 참석 가능`}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-amber-700" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Voting & Final Confirmation Tab */
            <div className="space-y-6">
              {/* Voter Selector for Simulation / Testing */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">투표할 멤버 선택:</span>
                  <select
                    value={currentVoterId}
                    onChange={(e) => setCurrentVoterId(e.target.value)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {participants.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.note || '멤버'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-slate-500">
                  선호하는 시간에 투표하면 최다 득표 시간으로 확정하기가 쉬워져요!
                </div>
              </div>

              {/* Candidate Slots Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rankedSlots.map((slot, idx) => {
                  const voters = votes[slot.slotKey] || [];
                  const isCurrentVoted = voters.includes(currentVoterId);
                  const isConfirmed = confirmedSlot === slot.slotKey;

                  return (
                    <div
                      key={slot.slotKey}
                      className={`p-5 rounded-2xl border transition-all ${
                        isConfirmed
                          ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400 shadow-md'
                          : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold mb-1">
                            <span>후보 {idx + 1}</span>
                            {slot.isGolden && (
                              <span className="px-1.5 py-0.5 bg-amber-200 rounded text-[10px]">
                                전원 가능 🍏
                              </span>
                            )}
                            {isConfirmed && (
                              <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-extrabold animate-pulse">
                                최종 확정됨 🏆
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-extrabold text-slate-900">
                            {formatKoreanDate(slot.date, slot.hour)}
                          </h4>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-700">
                            가능 {slot.availableCount}명
                          </span>
                        </div>
                      </div>

                      {/* Vote Count & Avatars */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 tabular-nums">
                            투표 {voters.length}표
                          </span>
                          <div className="flex -space-x-2">
                            {voters.map((vId) => {
                              const voterObj = participants.find((p) => p.id === vId);
                              if (!voterObj) return null;
                              return (
                                <div
                                  key={vId}
                                  className="w-6 h-6 rounded-full bg-white border border-slate-300 overflow-hidden flex items-center justify-center shadow-2xs"
                                  title={voterObj.name}
                                >
                                  <AvatarDisplay
                                    avatar={voterObj.avatar}
                                    size="sm"
                                    animated={false}
                                    className="scale-60 -mt-1"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Vote Button */}
                        <button
                          onClick={() => handleVoteClick(slot.slotKey)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            isCurrentVoted
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-amber-100 text-slate-700'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{isCurrentVoted ? '투표함' : '투표하기'}</span>
                        </button>
                      </div>

                      {/* Confirm Button */}
                      <div className="mt-3">
                        <button
                          onClick={() => handleConfirm(slot.slotKey)}
                          className={`w-full py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isConfirmed
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200'
                          }`}
                        >
                          <Trophy className="w-4 h-4" />
                          <span>{isConfirmed ? '확정된 일정입니다 (티켓 보기)' : '이 일정으로 최종 확정'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Confirmed Pass Banner if already confirmed */}
              {confirmedSlot && (
                <div className="p-4 bg-gradient-to-r from-amber-200 to-amber-300 rounded-2xl border border-amber-400 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <h4 className="text-sm font-extrabold text-amber-950">
                        축하합니다! 모임 일정이 최종 확정되었습니다.
                      </h4>
                      <p className="text-xs text-amber-900">
                        약속 확정 티켓을 확인하고 캘린더 등록 및 메신저에 공유해보세요.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenFinalPass(confirmedSlot)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    확정 티켓 보기 ➔
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-100 border-t border-slate-200 shrink-0 text-xs text-slate-600">
          <span>🍏 황금사과는 모두의 일정을 분석해 가장 좋은 시간을 찾아냅니다.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
