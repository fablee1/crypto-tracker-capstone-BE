const timestampsAreOnSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate()

export const getTimestamp240DaysAgo = () => {
  const today = new Date()
  today.setHours(1, 0, 0)
  today.setMilliseconds(0)
  return today.valueOf() - 240 * 24 * 60 * 60 * 1000
}
