import React, { useState, useEffect } from 'react';
import { MeetingRoom, Participant, ActiveView } from './types';
import { loadRoomData, saveRoomData, resetToDemoRoom } from './utils/storage';
import { MeadowField } from './components/MeadowField';
import { GoldenAppleModal } from './components/GoldenAppleModal';
import { ParticipantRegisterModal } from './components/ParticipantRegisterModal';
import { MemberSchedulesModal } from './components/MemberSchedulesModal';
import { FinalConfirmCard } from './components/FinalConfirmCard';
import { RoomSettingsModal } from './components/RoomSettingsModal';
import {
  Sparkles,
  Users,
  Calendar,
  Settings,
  PlusCircle,
  Clock,
  MapPin,
  Trophy,
  Share2,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { playPop, playGoldenChime } from './utils/sound';

export default function App() {
  const [room, setRoom] = useState<MeetingRoom>(() => loadRoomData());

  // Active Modals & Views
  const [showGoldenAppleModal, setShowGoldenAppleModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showMemberModal, setShowMemberModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showFinalPassModal, setShowFinalPassModal] = useState<boolean>(false);

  // Focus selection
  const [selectedMemberForModal, setSelectedMemberForModal] = useState<Participant | null>(null);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

  // Save room state to localStorage on update
  useEffect(() => {
    saveRoomData(room);
  }, [room]);

  // Handler: Add or Update Participant
  const handleSaveParticipant = (participant: Participant) => {
    setRoom((prev) => {
      const exists = prev.participants.some((p) => p.id === participant.id);
      let updatedParticipants: Participant[];
      if (exists) {
        updatedParticipants = prev.participants.map((p) =>
          p.id === participant.id ? participant : p
        );
      } else {
        updatedParticipants = [...prev.participants, participant];
      }
      return {
        ...prev,
        participants: updatedParticipants,
      };
    });
    setShowRegisterModal(false);
    setEditingParticipant(null);
  };

  // Handler: Delete Participant
  const handleDeleteParticipant = (id: string) => {
    setRoom((prev) => ({
      ...prev,
      participants: prev.participants.filter((p) => p.id !== id),
    }));
  };

  // Handler: Vote for a slot
  const handleVote = (slotKey: string, participantId: string) => {
    setRoom((prev) => {
      const currentVoters = prev.votes[slotKey] || [];
      const hasVoted = currentVoters.includes(participantId);
      const updatedVoters = hasVoted
        ? currentVoters.filter((id) => id !== participantId)
        : [...currentVoters, participantId];

      return {
        ...prev,
        votes: {
          ...prev.votes,
          [slotKey]: updatedVoters,
        },
      };
    });
  };

  // Handler: Finalize / Confirm Slot
  const handleConfirmSchedule = (slotKey: string) => {
    setRoom((prev) => ({
      ...prev,
      confirmedSlot: slotKey,
    }));
    setShowGoldenAppleModal(false);
    setShowFinalPassModal(true);
  };

  // Handler: Reset Confirmation
  const handleResetConfirmation = () => {
    setRoom((prev) => ({
      ...prev,
      confirmedSlot: null,
    }));
    setShowFinalPassModal(false);
  };

  // Handler: Room Settings update
  const handleUpdateRoomSettings = (updated: Partial<MeetingRoom>) => {
    setRoom((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Handler: Reset to Demo Data
  const handleResetDemoData = () => {
    const demo = resetToDemoRoom();
    setRoom(demo);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Bar Contract (1-line Brand, 4-5 single-line nav links, 1 primary action) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: Single Wordmark Element */}
          <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <span className="text-xl">🍏</span>
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-emerald-950">
              황금사과 약속 들판
            </span>
          </div>

          {/* Zone 2: Single-line Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => {
                playGoldenChime();
                setShowGoldenAppleModal(true);
              }}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>황금사과 공통 일정</span>
            </button>
            <button
              onClick={() => setShowMemberModal(true)}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>참여자별 시간표</span>
            </button>
            <button
              onClick={() => {
                setEditingParticipant(null);
                setShowRegisterModal(true);
              }}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>내 시간표 등록</span>
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>모임 설정</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                playGoldenChime();
                setShowGoldenAppleModal(true);
              }}
              className="px-3.5 py-2 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-105 active:scale-95 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>🍏 황금사과 열기</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6">
        {/* Room Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {room.title}
              </h1>
              {room.confirmedSlot && (
                <span className="px-2.5 py-0.5 bg-amber-400 text-amber-950 text-xs font-bold rounded-full">
                  약속 확정됨 🏆
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mt-1">
              <span>{room.description || '친구들과 함께 약속 시간을 조율해보세요!'}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{room.location}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingParticipant(null);
                setShowRegisterModal(true);
              }}
              className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>새 멤버 등록하기</span>
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              title="모임 설정 변경"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Centerpiece: The Animated Meadow & Apple Tree */}
        <section aria-label="사과나무 들판">
          <MeadowField
            participants={room.participants}
            onOpenGoldenApple={() => setShowGoldenAppleModal(true)}
            onSelectParticipant={(p) => {
              setSelectedMemberForModal(p);
              setShowMemberModal(true);
            }}
            onAddParticipant={() => {
              setEditingParticipant(null);
              setShowRegisterModal(true);
            }}
            confirmedSlot={room.confirmedSlot}
            datesCount={room.dates.length}
          />
        </section>

        {/* Feature Cards: 3 Distinct Core Screens Navigation */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Register Name & Avatar */}
          <div
            onClick={() => {
              setEditingParticipant(null);
              setShowRegisterModal(true);
            }}
            className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                🎨
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                1. 이름 적기 & 아바타 만들기
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                내 귀여운 헤어스타일, 의상, 표정을 꾸미고 들판의 캐릭터로 참여해보세요.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>내 캐릭터 등록하기</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>

          {/* Card 2: Individual Schedules */}
          <div
            onClick={() => setShowMemberModal(true)}
            className="p-5 bg-white rounded-2xl border border-sky-100 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                📋
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                2. 참여자별 시간표 확인하기
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                현재 등록된 {room.participants.length}명의 친구들이 언제 가능한지 개별 시간표를
                비교해보세요.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700">
              <span>친구들 시간표 보기</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>

          {/* Card 3: Golden Apple Overlap & Voting */}
          <div
            onClick={() => {
              playGoldenChime();
              setShowGoldenAppleModal(true);
            }}
            className="p-5 bg-gradient-to-br from-amber-50 to-amber-100/60 rounded-2xl border border-amber-200 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-300 text-amber-950 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                🍏
              </div>
              <h3 className="text-sm font-bold text-amber-950 group-hover:text-amber-800 transition-colors">
                3. 황금사과 공통 일정 & 투표
              </h3>
              <p className="text-xs text-amber-900/80 mt-1">
                사과나무가 계산한 모두의 골든 타임을 히트맵으로 보고, 즉석 투표로 최종 일정을
                확정하세요!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-amber-900">
              <span>황금사과 열기</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>
        </section>

        {/* If appointment is already confirmed, persistent celebration pass */}
        {room.confirmedSlot && (
          <div className="p-5 bg-gradient-to-r from-amber-200 via-amber-300 to-emerald-200 rounded-3xl border-2 border-amber-400 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <h4 className="text-base font-extrabold text-amber-950">
                  모임 일정이 확정되어 있습니다!
                </h4>
                <p className="text-xs text-amber-900">
                  약속 티켓을 열어 일정 세부 내용을 확인하고 메신저에 공유하거나 캘린더에 추가하세요.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowFinalPassModal(true)}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer self-start sm:self-auto"
            >
              약속 티켓 확인하기 ➔
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>🍏 황금사과 약속 들판</span>
            <span aria-hidden="true">·</span>
            <span>단체 약속 시간 조율 서비스</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleResetDemoData}
              className="hover:text-emerald-700 transition-colors"
            >
              샘플 데이터 새로고침
            </button>
            <span aria-hidden="true">·</span>
            <span>When2Meet Interactive Metaphor Experience</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Golden Apple Modal */}
      {showGoldenAppleModal && (
        <GoldenAppleModal
          room={room}
          onVote={handleVote}
          onConfirmSchedule={handleConfirmSchedule}
          onClose={() => setShowGoldenAppleModal(false)}
          onOpenFinalPass={(slotKey) => {
            setShowGoldenAppleModal(false);
            setShowFinalPassModal(true);
          }}
        />
      )}

      {/* 2. Participant Register & Avatar Modal */}
      {showRegisterModal && (
        <ParticipantRegisterModal
          initialParticipant={editingParticipant}
          dates={room.dates}
          startHour={room.startHour}
          endHour={room.endHour}
          onSave={handleSaveParticipant}
          onClose={() => {
            setShowRegisterModal(false);
            setEditingParticipant(null);
          }}
        />
      )}

      {/* 3. Member Schedules Modal */}
      {showMemberModal && (
        <MemberSchedulesModal
          room={room}
          selectedParticipantId={selectedMemberForModal?.id}
          onEditParticipant={(p) => {
            setShowMemberModal(false);
            setEditingParticipant(p);
            setShowRegisterModal(true);
          }}
          onDeleteParticipant={(id) => {
            handleDeleteParticipant(id);
          }}
          onAddNewParticipant={() => {
            setShowMemberModal(false);
            setEditingParticipant(null);
            setShowRegisterModal(true);
          }}
          onClose={() => {
            setShowMemberModal(false);
            setSelectedMemberForModal(null);
          }}
        />
      )}

      {/* 4. Final Appointment Confirmation Card Modal */}
      {showFinalPassModal && room.confirmedSlot && (
        <FinalConfirmCard
          room={room}
          slotKey={room.confirmedSlot}
          onResetConfirmation={handleResetConfirmation}
          onClose={() => setShowFinalPassModal(false)}
        />
      )}

      {/* 5. Room Settings Modal */}
      {showSettingsModal && (
        <RoomSettingsModal
          room={room}
          onSave={handleUpdateRoomSettings}
          onResetDemo={handleResetDemoData}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
