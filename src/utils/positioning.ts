import { Participant } from '../types';

/**
 * Predefined scenic spots on the meadow field:
 * Thoughtfully distributed across the left hill, right hill, and foreground flower trails,
 * while keeping the central apple tree trunk (x: 42% ~ 58%, y: 35% ~ 78%) open and clear.
 */
export const SCENIC_MEADOW_SPOTS = [
  { x: 18, y: 74, zone: 'left_hill' },
  { x: 82, y: 72, zone: 'right_hill' },
  { x: 30, y: 80, zone: 'left_low' },
  { x: 70, y: 78, zone: 'right_low' },
  { x: 12, y: 82, zone: 'far_left' },
  { x: 88, y: 80, zone: 'far_right' },
  { x: 24, y: 68, zone: 'left_high' },
  { x: 76, y: 68, zone: 'right_high' },
  { x: 36, y: 84, zone: 'left_front' },
  { x: 64, y: 84, zone: 'right_front' },
  { x: 15, y: 70, zone: 'left_mid' },
  { x: 85, y: 76, zone: 'right_mid' },
  { x: 28, y: 74, zone: 'left_center' },
  { x: 72, y: 72, zone: 'right_center' },
  { x: 50, y: 88, zone: 'center_front_path' }, // Way in front of the tree fence
];

/**
 * Checks if a position is dangerously close to the center apple tree trunk.
 */
export function isTreeObstacleZone(x: number, y: number): boolean {
  return x >= 42 && x <= 58 && y < 82;
}

/**
 * Calculates Euclidean distance between two percentage coordinates.
 * Gives slightly more weight to horizontal spacing (x) since characters have horizontal widths.
 */
function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = (x1 - x2) * 1.2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Finds the optimal scenic position for a new character so they are spread out
 * across the meadow without crowding the center or colliding with existing members.
 */
export function getOptimalParticipantPosition(
  existingParticipants: { positionX?: number; positionY?: number }[]
): { positionX: number; positionY: number } {
  const existingPoints = existingParticipants
    .filter((p) => p.positionX !== undefined && p.positionY !== undefined)
    .map((p) => ({ x: p.positionX!, y: p.positionY! }));

  if (existingPoints.length === 0) {
    // First member gets a lovely spot on the left rolling hill
    return { positionX: 22, positionY: 76 };
  }

  // Evaluate candidate spots
  let bestSpot = SCENIC_MEADOW_SPOTS[0];
  let maxMinDistance = -1;

  for (const candidate of SCENIC_MEADOW_SPOTS) {
    if (isTreeObstacleZone(candidate.x, candidate.y)) continue;

    // Find distance to the closest existing character
    let minDistanceToAny = Infinity;
    for (const point of existingPoints) {
      const d = getDistance(candidate.x, candidate.y, point.x, point.y);
      if (d < minDistanceToAny) {
        minDistanceToAny = d;
      }
    }

    if (minDistanceToAny > maxMinDistance) {
      maxMinDistance = minDistanceToAny;
      bestSpot = candidate;
    }
  }

  // Add subtle organic jitter (±1.5%) so characters don't align mechanically
  const jitterX = (Math.random() - 0.5) * 3;
  const jitterY = (Math.random() - 0.5) * 2;

  let finalX = Math.round(Math.max(10, Math.min(90, bestSpot.x + jitterX)));
  let finalY = Math.round(Math.max(66, Math.min(88, bestSpot.y + jitterY)));

  // Ensure final position still avoids the tree
  if (isTreeObstacleZone(finalX, finalY)) {
    finalX = finalX < 50 ? 38 : 62;
  }

  return { positionX: finalX, positionY: finalY };
}

/**
 * Normalizes positions for all participants in a room so no two are overlapping
 * and no character is hidden behind the central tree trunk.
 */
export function distributeAllParticipants(
  participants: Participant[]
): { id: string; x: number; y: number }[] {
  const placed: { id: string; x: number; y: number }[] = [];

  participants.forEach((p, index) => {
    let x = p.positionX;
    let y = p.positionY;

    // Check if the current position is invalid (missing, in tree trunk, or collides with already placed)
    const isInTree = !x || !y || isTreeObstacleZone(x, y);
    const hasCollision =
      x && y && placed.some((other) => getDistance(x!, y!, other.x, other.y) < 9);

    if (isInTree || hasCollision) {
      // Pick a scenic spot maximizing distance from already placed members
      const optimal = getOptimalParticipantPosition(
        placed.map((item) => ({ positionX: item.x, positionY: item.y }))
      );
      x = optimal.positionX;
      y = optimal.positionY;
    }

    placed.push({ id: p.id, x: x!, y: y! });
  });

  return placed;
}
