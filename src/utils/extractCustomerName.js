export function extractCustomerName(data) {
  if (!data || typeof data !== "object") {
    return "Web Form"
  }
// console.log( data?.__raw?.GIVEN_NAME,"data")
  const givenName =
    data?.GIVEN_NAME ||
    data?.given_name ||
    null

  const surname =
    data?.SURNAME ||
    data?.surname ||
    null

  // 1️⃣ GIVEN_NAME + SURNAME (öncelikli)
  if (givenName || surname) {
    return [givenName, surname]
      .filter(Boolean)
      .join(" ")
      .trim()
  }

  // 2️⃣ FULL_NAME_NATIVE (fallback)
  const nativeFullName =
    data?.FULL_NAME_NATIVE ||
    data?.full_name_native ||
    null

  if (nativeFullName) {
    return nativeFullName.trim()
  }

  // 3️⃣ En son fallback
  return "Web Form"
}
