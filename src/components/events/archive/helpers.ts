// Dependencies
import { getMonthMark } from "../../../lib/events/helpers";
import { KNOT_SIDE, TIMELINE_MARK } from "./constants";

// Types
import type { TimelineMonth } from "../../../lib/events/types";
import type { Point, Sparkle } from "../../opening/types";
import type {
  ArchiveDrawingLayout,
  EventKnot,
  MonthMark,
  TimelineDrawing,
  TimelineSlot,
} from "./types";

/**
 * The {@link round} helper
 * @description Rounds a coordinate to one decimal, so paths stay short
 * @param {number} value - The coordinate
 * @returns {number} The rounded coordinate
 */
function round(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * The {@link getLinePath} helper
 * @description Sews a smooth line through points: each step leaves level and arrives level, like a thread through stitches
 * @param {Point[]} points - The points in order
 * @returns {string} The SVG path
 */
export function getLinePath(points: Point[]): string {
  const [first, ...rest] = points;

  // A line needs a start
  if (!first) {
    return "";
  }

  // Each step bends halfway between its two points
  let path = `M${first.x} ${first.y}`;
  let previous = first;
  for (const point of rest) {
    const middle = round((previous.x + point.x) / 2);
    path += ` C${middle} ${previous.y} ${middle} ${point.y} ${point.x} ${point.y}`;
    previous = point;
  }
  return path;
}

/**
 * The {@link getKnots} helper
 * @description Hangs a month's events from its point, fanned evenly round the side they hang on
 * @param {TimelineMonth} month - The month and its events
 * @param {TimelineSlot} slot - The month's point and side
 * @param {ArchiveDrawingLayout} layout - The knots' size, reach, spread and most, and the bead on the line
 * @returns {EventKnot[]} Each event's knot and thread
 */
function getKnots(
  month: TimelineMonth,
  slot: TimelineSlot,
  layout: ArchiveDrawingLayout,
): EventKnot[] {
  const events = month.events.slice(0, layout.knot.max);
  const direction = slot.side === KNOT_SIDE.UP ? -1 : 1;
  const from = layout.pointBead / 2 + 2;
  const to = layout.knot.reach - layout.knot.size / 2;

  // Each event at its angle from straight up or down
  return events.map((event, index) => {
    const angle = ((index - (events.length - 1) / 2) * layout.knot.spread * Math.PI) / 180;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle) * direction;
    const thread = `M${round(slot.x + from * sin)} ${round(slot.y + from * cos)} L${round(slot.x + to * sin)} ${round(slot.y + to * cos)}`;
    return {
      key: event.id,
      type: event.type,
      x: round(slot.x + layout.knot.reach * sin),
      y: round(slot.y + layout.knot.reach * cos),
      thread,
    };
  });
}

/**
 * The {@link getTimelineDrawing} helper
 * @description Lays the recent months on a screen size's timeline: the latest ones fill its points, each with its label, its bead and its events
 * @param {TimelineMonth[]} months - The recent months, oldest first
 * @param {ArchiveDrawingLayout} layout - The screen size's drawing
 * @param {string} locale - The page's language
 * @returns {TimelineDrawing} The line, the month marks, the beads and the knots
 */
export function getTimelineDrawing(
  months: TimelineMonth[],
  layout: ArchiveDrawingLayout,
  locale: string,
): TimelineDrawing {
  const shown = months.slice(-layout.slots.length);
  const placed = shown.flatMap((month, index) => {
    const slot = layout.slots[index];
    // A month without a point is left out
    if (!slot) {
      return [];
    }
    return [{ month, slot }];
  });
  const marks: MonthMark[] = [];
  const beads: Sparkle[] = [];
  const knots: EventKnot[] = [];

  // Each month's label away from its events, its bead on the line and its knots
  for (const [index, { month, slot }] of placed.entries()) {
    const gap = slot.side === KNOT_SIDE.UP ? TIMELINE_MARK.GAP : -TIMELINE_MARK.GAP;
    const half = layout.pointBead / 2;
    marks.push({
      key: month.key,
      label: getMonthMark(month.year, month.month, locale),
      x: slot.x,
      y: slot.y + gap,
    });
    beads.push({
      x: slot.x - half,
      y: slot.y - half,
      size: layout.pointBead,
      isRinged: index % 2 === 0,
    });
    knots.push(...getKnots(month, slot, layout));
  }

  // The line from the logo through the months to its loose end
  const points = [layout.line.start, ...placed.map(({ slot }) => slot), layout.line.tail];
  return { path: getLinePath(points), months: marks, beads, knots };
}
