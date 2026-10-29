export type HairStyle = 'short' | 'bob' | 'curly' | 'ponytail' | 'cap' | 'beanie' | 'ribbon';
export type Accessory = 'none' | 'glasses' | 'sunglasses' | 'flower' | 'clover' | 'apple_pin' | 'star';
export type Mood = 'happy' | 'excited' | 'chill' | 'sparkle';

export interface AvatarConfig {
  skinColor: string;
  hairStyle: HairStyle;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  accessory: Accessory;
  mood: Mood;
}

export interface Participant {
  id: string;
  name: string;
  note: string;
  avatar: AvatarConfig;
  positionX: number; // 12 to 88 (%)
  positionY: number; // 60 to 86 (%)
  availableSlots: Record<string, boolean>; // key: `${date}_${hour}`
  updatedAt: number;
}

export interface MeetingRoom {
  id: string;
  title: string;
  description: string;
  location: string;
  dates: string[]; // YYYY-MM-DD
  startHour: number; // e.g. 10
  endHour: number; // e.g. 22
  participants: Participant[];
  votes: Record<string, string[]>; // slotKey -> array of participantIds
  confirmedSlot: string | null; // slotKey
}

export interface SlotAnalysis {
  slotKey: string;
  date: string;
  hour: number;
  availableCount: number;
  totalParticipants: number;
  percentage: number;
  availableParticipants: Participant[];
  unavailableParticipants: Participant[];
  isGolden: boolean; // all available
}

export type ActiveView = 'meadow' | 'register' | 'schedule_edit' | 'member_schedules' | 'golden_apple';
