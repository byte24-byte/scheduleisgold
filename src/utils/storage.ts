import { MeetingRoom, Participant } from '../types';

const STORAGE_KEY = 'golden_apple_meetup_room_v1';

export const DEFAULT_DATES = [
  '2026-10-30', // 금
  '2026-10-31', // 토
  '2026-11-01', // 일
  '2026-11-02', // 월
];

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 'p-1',
    name: '민수',
    note: '주말 오후에 보드게임이나 맛집 가자! 🎲',
    avatar: {
      skinColor: '#FCE6D2',
      hairStyle: 'beanie',
      hairColor: '#3B82F6',
      shirtColor: '#10B981',
      pantsColor: '#1E293B',
      accessory: 'clover',
      mood: 'happy',
    },
    positionX: 22,
    positionY: 76,
    availableSlots: {
      '2026-10-30_18': true,
      '2026-10-30_19': true,
      '2026-10-30_20': true,
      '2026-10-31_14': true,
      '2026-10-31_15': true,
      '2026-10-31_16': true,
      '2026-10-31_17': true,
      '2026-10-31_18': true,
      '2026-11-01_13': true,
      '2026-11-01_14': true,
      '2026-11-01_15': true,
      '2026-11-01_16': true,
    },
    updatedAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'p-2',
    name: '지원',
    note: '토요일 일요일은 언제든 다 좋아~ 🍎',
    avatar: {
      skinColor: '#F7D0B2',
      hairStyle: 'ribbon',
      hairColor: '#C27C38',
      shirtColor: '#EC4899',
      pantsColor: '#475569',
      accessory: 'apple_pin',
      mood: 'excited',
    },
    positionX: 38,
    positionY: 82,
    availableSlots: {
      '2026-10-31_12': true,
      '2026-10-31_13': true,
      '2026-10-31_14': true,
      '2026-10-31_15': true,
      '2026-10-31_16': true,
      '2026-10-31_17': true,
      '2026-11-01_12': true,
      '2026-11-01_13': true,
      '2026-11-01_14': true,
      '2026-11-01_15': true,
      '2026-11-01_16': true,
      '2026-11-01_17': true,
    },
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'p-3',
    name: '하은',
    note: '오후 시간대면 어디든 달려갈게! 🌿',
    avatar: {
      skinColor: '#FCE6D2',
      hairStyle: 'bob',
      hairColor: '#1E1E1E',
      shirtColor: '#F59E0B',
      pantsColor: '#334155',
      accessory: 'glasses',
      mood: 'sparkle',
    },
    positionX: 64,
    positionY: 80,
    availableSlots: {
      '2026-10-30_19': true,
      '2026-10-30_20': true,
      '2026-10-31_14': true,
      '2026-10-31_15': true,
      '2026-10-31_16': true,
      '2026-10-31_17': true,
      '2026-10-31_18': true,
      '2026-11-01_14': true,
      '2026-11-01_15': true,
      '2026-11-01_16': true,
      '2026-11-02_19': true,
      '2026-11-02_20': true,
    },
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'p-4',
    name: '도윤',
    note: '토요일 15시 이후 완전 프리합니다 ✨',
    avatar: {
      skinColor: '#E2A77E',
      hairStyle: 'curly',
      hairColor: '#4A3728',
      shirtColor: '#3B82F6',
      pantsColor: '#1E293B',
      accessory: 'sunglasses',
      mood: 'chill',
    },
    positionX: 78,
    positionY: 74,
    availableSlots: {
      '2026-10-31_15': true,
      '2026-10-31_16': true,
      '2026-10-31_17': true,
      '2026-10-31_18': true,
      '2026-10-31_19': true,
      '2026-10-31_20': true,
      '2026-11-01_15': true,
      '2026-11-01_16': true,
    },
    updatedAt: Date.now() - 1800000,
  },
];

export const INITIAL_ROOM: MeetingRoom = {
  id: 'room-weekend-friends',
  title: '우리들의 가을 주말 피크닉 & 수다 모임 🍎',
  description: '모두 모여서 맛있는 브런치 먹고 사과나무 그늘 아래서 이야기 나눠요!',
  location: '성수동 감성 카페 or 숲속 공원',
  dates: DEFAULT_DATES,
  startHour: 11,
  endHour: 21,
  participants: INITIAL_PARTICIPANTS,
  votes: {
    '2026-10-31_15': ['p-1', 'p-2', 'p-4'],
    '2026-10-31_16': ['p-2', 'p-3'],
  },
  confirmedSlot: null,
};

export function loadRoomData(): MeetingRoom {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.participants && parsed.dates) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse saved room data:', err);
  }
  return INITIAL_ROOM;
}

export function saveRoomData(room: MeetingRoom): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(room));
  } catch (err) {
    console.error('Failed to save room data:', err);
  }
}

export function resetToDemoRoom(): MeetingRoom {
  saveRoomData(INITIAL_ROOM);
  return INITIAL_ROOM;
}
