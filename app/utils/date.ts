import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(duration)
dayjs.extend(relativeTime)

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

/**
 * Formats a duration in milliseconds into a human-readable string using dayjs.
 * For example, 120000 milliseconds (2 minutes) would be formatted as "2 minutes".
 * This uses `dayjs.duration().humanize()`.
 *
 * @param milliseconds The duration in milliseconds.
 * @returns A human-readable string representing the duration, or "Invalid duration" if input is not a valid number.
 */
export function formatDuration(seconds: number): string {
  return dayjs.duration(seconds, 'seconds').humanize()
}
