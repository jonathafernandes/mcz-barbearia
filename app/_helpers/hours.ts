import { addMinutes, setHours, setMinutes, format } from "date-fns"

export function generateDayTimeList(date: Date): string[] {
  const starTime = setMinutes(setHours(date, 9), 0)
  const endTime = setMinutes(setHours(date, 21), 0)
  const interval = 45
  const timesList: string[] = []

  let currentTime = starTime

  while (currentTime <= endTime) {
    timesList.push(format(currentTime, "HH:mm"))
    currentTime = addMinutes(currentTime, interval)
  }

  return timesList
}
