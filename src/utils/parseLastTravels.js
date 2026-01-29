export function parseLastTravels(step5 = {}) {
  const result = {}

  Object.entries(step5).forEach(([key, value]) => {
    const match = key.match(/^lastTravel(\d+)_(.+)$/)
    if (!match) return

    const index = Number(match[1]) - 1
    const field = match[2]

    if (!result[index]) result[index] = {}

    if (field === "duration") {
      result[index].durationDays = value
    } else {
      result[index][field] = value
    }
  })

  return Object.values(result)
}
