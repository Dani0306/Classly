export type ColorKey = "violet" | "sky" | "amber" | "rose" | "emerald" | "slate"

export type EventKind = "class" | "assignment" | "exam" | "office-hours" | "reminder"

export interface ClassEvent {
  id: string
  title: string
  courseCode: string
  color: ColorKey
  start: Date
  end: Date
  location?: string
  instructor?: string
  kind: EventKind
  description?: string
  /** All-day items (e.g. "Essay due", "Midterm week") render in the banner row instead of the timed grid. */
  allDay?: boolean
}

export type CalendarView = "day" | "week" | "month"
