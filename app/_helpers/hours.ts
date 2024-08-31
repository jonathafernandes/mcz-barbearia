import { addMinutes, setHours, setMinutes, format } from "date-fns"

export function generateDayTimeList(date: Date): string[] {
  let startTime, endTime

  switch (date.getDay()) {
    case 0:
      startTime = setMinutes(setHours(date, 8), 0)
      endTime = setMinutes(setHours(date, 14), 0)
      break
    case 6:
      startTime = setMinutes(setHours(date, 13), 0)
      endTime = setMinutes(setHours(date, 22), 0)
      break
    default:
      startTime = setMinutes(setHours(date, 18), 0)
      endTime = setMinutes(setHours(date, 22), 0)
      break
  }

  const interval = 45
  const timesList: string[] = []

  let currentTime = startTime

  while (currentTime < endTime) {
    timesList.push(format(currentTime, "HH:mm"))
    currentTime = addMinutes(currentTime, interval)
  }

  if (currentTime === endTime) {
    timesList.push(format(endTime, "HH:mm"))
  }

  return timesList
}
