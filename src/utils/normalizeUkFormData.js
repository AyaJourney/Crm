export function normalizeUkFormData(input = {}) {
  /**
   * input genelde şuna benzer gelir:
   * {
   *   currentStep: 6,
   *   steps: { 1: {...}, 2: {...}, ... }
   * }
   */

  const steps = input?.steps || {}

  const normalized = {
    visa_type: "uk",

    // 🔥 ham veri KORUNUR
    __raw: {
      steps: steps,
    },
  }

  /**
   * STEP 1–6'yı direkt normalize edilmiş alana koy
   * (şu an için birebir kopya, ileride sadeleştirilebilir)
   */
  Object.keys(steps).forEach((stepNo) => {
    normalized[stepNo] = normalizeStep(
      stepNo,
      steps[stepNo]
    )
  })

  /**
   * 🔑 KISA YOLLAR (CRM / LIST / SEARCH için)
   */
  normalized.fullName =
    steps?.[1]?.fullName || ""

  normalized.email =
    steps?.[1]?.email || ""

  normalized.phone =
    steps?.[1]?.phone_number || ""

  return normalized
}
function normalizeStep(stepNo, stepData) {
  if (!stepData || typeof stepData !== "object") {
    return {}
  }

  // Şimdilik birebir kopya
  // (ileride field rename / transform burada yapılır)
  return { ...stepData }
}