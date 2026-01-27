export function normalizeUKForm(raw) {
  const out = {}

  /* =========================
     STEP 1 – KİMLİK & İLETİŞİM
     ========================= */
  out.tcId = raw.tcId || ""
  out.fullName = raw.fullName || ""
  out.nationality = raw.natinolity || ""
  out.gender = raw.gender || ""
  out.maritalStatus = raw.maritalStatus || ""
  out.birthDate = raw.birthDate || ""
  out.birthPlace = raw.birthPlace || ""

  out.phone = raw.phone_number || ""
  out.phone2 = raw.phone_number2 || ""
  out.email = raw.email || ""
  out.email2 = raw.email2 || ""

  out.homeAddress = raw.home_address || ""
  out.postCode = raw.post_code || ""

  out.maidenName =
    raw.maidenName ||
    raw.last_fullname ||
    ""

  out.hasPreviousName =
    raw.bool_last_fullname === "EVET" ||
    raw.bool_last_fullname === "YES" ||
    raw.bool_last_fullname === true

  /* =========================
     STEP 2 – AİLE
     ========================= */
  out.hasChildren =
    raw.boolean_child === "EVET" ||
    raw.boolean_child === "YES" ||
    raw.boolean_child === true

  out.children = Array.isArray(raw.child_names)
    ? raw.child_names.map((name, i) => ({
        name,
        travelWithYou: raw.child_travel_with_you?.[i] || false,
      }))
    : []

  out.mother = {
    fullName: raw.mother_full_name || "",
    birthDate: raw.mother_birth_date || "",
    nationality: raw.mother_nationality || "",
    travelWithYou:
      raw.mother_travel_with_you === "EVET" ||
      raw.mother_travel_with_you === "YES",
  }

  out.father = {
    fullName: raw.father_full_name || "",
    birthDate: raw.father_birth_date || "",
    nationality: raw.father_nationality || "",
    travelWithYou:
      raw.father_travel_with_you === "EVET" ||
      raw.father_travel_with_you === "YES",
  }

  /* =========================
     STEP 3 – PASAPORT
     ========================= */
  out.passport = {
    number: raw.passport_number || "",
    startDate: raw.Passport_start_date || "",
    endDate: raw.Passport_end_date || "",
    authority: raw.passport_issuing_authority || "",
    tcCardEndDate: raw.tc_card_end_date || "",
  }

  /* =========================
     STEP 4 – İŞ & FİNANS
     ========================= */
  out.work = {
    isWorking:
      raw.boolean_work === "EVET" ||
      raw.boolean_work === "YES",
    company: raw.work_name || "",
    address: raw.work_address || "",
    phone: raw.work_phone || "",
    title: raw.worker_title || "",
    years: raw.work_year || "",
    monthlyIncome: raw.monthly_money || "",
    savings: raw.savings || "",
    sideIncome: raw.sideline || "",
    monthlyExpense: raw.monthly_expenditure_amount || "",
  }

  /* =========================
     STEP 5 – SEYAHAT & UK
     ========================= */
  out.travel = {
    ukAddress: raw.uk_address || "",
    startDate: raw.travel_start_date || "",
    endDate: raw.travel_end_date || "",
    reason: raw.travel_reason || raw.travel_reason_other || "",
    hasInvitation:
      raw.have_invitation === "EVET" ||
      raw.have_invitation === "YES",
    inviter: {
      name: raw.inviter_fullname || "",
      phone: raw.inviter_phone || "",
      email: raw.inviter_email || "",
      address: raw.inviter_address || "",
      type: raw.invitation_type || "",
      reason: raw.invitation_reason || "",
    },
    lastTravels: Array.isArray(raw.lastTravels)
      ? raw.lastTravels
      : [],
  }

  /* =========================
     DOSYALAR
     ========================= */
  out.files = {
    passportFile: raw.passportFile || null,
    photoFile: raw.photoFile || null,
  }

  /* =========================
     ORİJİNAL VERİYİ KORU
     ========================= */
  out.__raw = raw

  return out
}
