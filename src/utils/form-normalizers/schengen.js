export function normalizeSchengenForm(raw) {
  const out = {}

  /* =========================
     KİMLİK & İLETİŞİM
     ========================= */
  out.tcId = raw.tcId || ""
  out.fullName = raw.fullName || ""
  out.gender = raw.gender || ""
  out.maritalStatus = raw.maritalStatus || ""
  out.maidenName = raw.maidenName || ""
  out.birthDate = raw.birthDate || ""
  out.birthPlace = raw.birthPlace || ""
  out.phone = raw.phone_number || ""
  out.email = raw.email || ""

  out.address = {
    postCode: raw.post_code || "",
    city: raw.home_city || "",
    district: raw.home_district || "",
    neighborhood: raw.home_neighborhood || "",
    street: raw.home_street || "",
    avenue: raw.home_avenue || "",
    buildingNo: raw.home_building_no || "",
    apartmentNo: raw.home_apartment_no || "",
    full: raw.home_address || "",
  }

  /* =========================
     PASAPORT
     ========================= */
  out.passport = {
    number: raw.passport_number || "",
    startDate: raw.Passport_start_date || "",
    endDate: raw.Passport_end_date || "",
    authority: raw.passport_issuing_authority || "",
  }

  /* =========================
     MESLEK & İŞ
     ========================= */
  out.employment = {
    sector: raw.sector || "",
    companyType: raw.company_type || "",
    companyName: raw.company_name || "",
    companyStatus: raw.company_statu || "",
    address: raw.company_address || "",
    phone: raw.company_phone_number || "",
    title: raw.your_title || "",
    isWorking:
      raw.boolean_work === "EVET" ||
      raw.boolean_work === "YES" ||
      raw.boolean_work === true,
    startDate: raw.work_start_date || "",
  }

  /* =========================
     DAVET
     ========================= */
  out.invitation = {
    exists:
      raw.boolean_invitation === "EVET" ||
      raw.boolean_invitation === "YES" ||
      raw.boolean_invitation === true,

    type: raw.invitation_type || "",

    person: {
      fullName: raw.invitation_sender_fullname || "",
      birthDate: raw.invitation_sender_birthdate || "",
      phone: raw.invitation_sender_phone_number || "",
      email: raw.invitation_sender_email || "",
      tcId: raw.invitation_sender_tc_id || "",
      address: raw.invitation_sender_home_address || "",
    },

    company: {
      name: raw.invitation_company_fullname || "",
      phone: raw.invitation_company_phone_number || "",
      email: raw.invitation_company_email || "",
      address: raw.invitation_company_address || "",
    },
  }

  /* =========================
     SEYAHAT & SCHENGEN
     ========================= */
  out.travel = {
    startDate: raw.travel_start_date || "",
    endDate: raw.travel_end_date || "",

    hadSchengenVisa:
      raw.boolean_schengen_visa === "EVET" ||
      raw.boolean_schengen_visa === "YES",

    fingerprintTaken:
      raw.fingerprint_taken === "EVET" ||
      raw.fingerprint_taken === "YES",

    fingerprintDate: raw.fingerprint_taken_date || "",

    schengenVisaLabelNumber:
      raw.schengen_visa_label_number || "",

    beenAbroad:
      raw.boolean_abroad_country === "EVET" ||
      raw.boolean_abroad_country === "YES",

    abroadCountries: Array.isArray(raw.abroad_country)
      ? raw.abroad_country
      : [],
  }

  /* =========================
     DOSYALAR
     ========================= */
  out.files = {
    passport: raw.passportFile || null,
    photo: raw.photoFile || null,
  }

  /* =========================
     RAW VERİYİ KORU (ÇOK ÖNEMLİ)
     ========================= */
  out.__raw = raw

  return out
}
