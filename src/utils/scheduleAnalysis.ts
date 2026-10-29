import { MeetingRoom, SlotAnalysis } from '../types';

export function analyzeSlots(room: MeetingRoom): SlotAnalysis[] {
  const { dates, startHour, endHour, participants } = room;
  const total = participants.length;
  const results: SlotAnalysis[] = [];

  for (const date of dates) {
    for (let hour = startHour; hour <= endHour; hour++) {
      const slotKey = `${date}_${hour}`;
      const available = participants.filter((p) => p.availableSlots[slotKey] === true);
      const unavailable = participants.filter((p) => !p.availableSlots[slotKey]);
      const count = available.length;
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      const isGolden = total > 0 && count === total;

      results.push({
        slotKey,
        date,
        hour,
        availableCount: count,
        totalParticipants: total,
        percentage,
        availableParticipants: available,
        unavailableParticipants: unavailable,
        isGolden,
      });
    }
  }

  return results;
}

export function getRankedBestSlots(slots: SlotAnalysis[], limit = 5): SlotAnalysis[] {
  // Sort by count descending, then by isGolden, then by chronological order
  return [...slots]
    .filter((s) => s.availableCount > 0)
    .sort((a, b) => {
      if (b.availableCount !== a.availableCount) {
        return b.availableCount - a.availableCount;
      }
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.hour - b.hour;
    })
    .slice(0, limit);
}
