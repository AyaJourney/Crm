export function normalizeName(name) {
  if (!name) return null

  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // aksan sil
    .replace(/\s+/g, " ")
    .trim()
}
