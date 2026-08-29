const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => persianDigits[Number(digit)])
}

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  const parts = [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ]

  return toPersianDigits(parts.join(':'))
}

export function formatDurationShort(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0) {
    return toPersianDigits(`${hours} ساعت و ${minutes} دقیقه`)
  }

  if (minutes > 0) {
    const seconds = Math.floor(totalSeconds % 60)
    return toPersianDigits(`${minutes} دقیقه و ${seconds} ثانیه`)
  }

  return toPersianDigits(`${Math.floor(totalSeconds)} ثانیه`)
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(isoDate))
}

export function formatTodayDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('fa-IR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', {
    day: 'numeric',
    month: 'long',
  }).format(date)
}

export function formatTime(isoDate: string): string {
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate))
}

export function getStartOfDay(date: Date = new Date()): Date {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}

export function getStartOfWeek(date: Date = new Date()): Date {
  return getStartOfPersianWeek(date)
}

/** First day of the Persian week (Saturday / شنبه) */
export function getStartOfPersianWeek(date: Date = new Date()): Date {
  const start = getStartOfDay(date)
  const jsDay = start.getDay() // 0=Sun … 6=Sat
  const daysSinceSaturday = (jsDay + 1) % 7
  start.setDate(start.getDate() - daysSinceSaturday)
  return start
}

export function getStartOfMonth(date: Date = new Date()): Date {
  const start = getStartOfDay(date)
  start.setDate(1)
  return start
}
