// 1993-01-01  →  01-01-1993
export function isoToTR(value) {
  if (!value) return ""

  // zaten TR formatındaysa
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    return value
  }

  // ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-")
    return `${d}-${m}-${y}`
  }

  return value
}

// 01-01-1993 → 1993-01-01 (gerekirse)
export function trToISO(value) {
  if (!value) return ""

  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [d, m, y] = value.split("-")
    return `${y}-${m}-${d}`
  }

  return value
}


export function toTR(value) {
  if (!value) return ""

  // zaten TR ise
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    return value
  }

  // ISO ise
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-")
    return `${d}-${m}-${y}`
  }

  return value
}