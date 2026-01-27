// src/utils/form-normalizers/ds160.js
export function normalizeDs160(input) {
  /**
   * =========================
   * 0️⃣ ZATEN NORMALIZE EDİLMİŞ Mİ?
   * =========================
   * CRM edit / merge / tekrar save sonrası
   */
  if (
    input &&
    typeof input === "object" &&
    ("GIVEN_NAME" in input || "SURNAME" in input)
  ) {
    return input
  }

  /**
   * =========================
   * 1️⃣ HAM DATA KAYNAĞINI BELİRLE
   * =========================
   * Bazen data direkt gelir
   * Bazen data.__raw içindedir
   */
  const raw =
    input?.__raw && typeof input.__raw === "object"
      ? input.__raw
      : input

  const steps = raw?.steps || {}

  const s1 = steps["1"] || {}
  const s2 = steps["2"] || {}
  const s3 = steps["3"] || {}
  const s4 = steps["4"] || {}
  const s5 = steps["5"] || {}
  const s6 = steps["6"] || {}
  const s7 = steps["7"] || {}
  const s8 = steps["8"] || {}

  /**
   * =========================
   * 2️⃣ NAME (AKILLI PARSE)
   * =========================
   */
  let GIVEN_NAME = ""
  let SURNAME = ""
  let FULL_NAME_NATIVE = ""

  if (typeof s1.fullName === "string" && s1.fullName.trim()) {
    const parts = s1.fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)

    if (parts.length === 1) {
      GIVEN_NAME = parts[0]
      SURNAME = parts[0]
      FULL_NAME_NATIVE = parts[0]
    } else {
      GIVEN_NAME = parts.slice(0, -1).join(" ")
      SURNAME = parts.slice(-1)[0]
      FULL_NAME_NATIVE = parts.join(" ")
    }
  }

  /**
   * =========================
   * 3️⃣ BIRTH DATE
   * =========================
   */
  let BIRTH_DAY = ""
  let BIRTH_MONTH = ""
  let BIRTH_YEAR = ""

  if (typeof s1.birthDate === "string") {
    const [year, month, day] = s1.birthDate.split("-")
    BIRTH_DAY = day || ""
    BIRTH_MONTH = month || ""
    BIRTH_YEAR = year || ""
  }

  /**
   * =========================
   * 4️⃣ YES / NO NORMALIZER
   * =========================
   */
  const yn = (v) =>
    v === "EVET" || v === true
      ? "YES"
      : v === "HAYIR" || v === false
      ? "NO"
      : ""

  /**
   * =========================
   * 5️⃣ DS-160 FINAL FLAT OBJECT
   * (ds160Schema birebir)
   * =========================
   */
  return {
    __raw: raw,

    /* ===== Personal Information 1 ===== */
    SURNAME,
    GIVEN_NAME,
    FULL_NAME_NATIVE,

    OTHER_NAME: "",
    OTHER_SURNAME_1: "",
    OTHER_GIVEN_NAME_1: "",
    GENDER: s1.gender || "",
    MARITAL_STATUS: s1.maritalStatus || "",

    BIRTH_DAY,
    BIRTH_MONTH,
    BIRTH_YEAR,
    BIRTH_CITY: s1.birthPlace || "",
    BIRTH_COUNTRY: s1.birthCountry || "",
    BIRTH_STATE: "",

    /* ===== Personal Information 2 ===== */
    NATIONALITY: s2.nationality || "",
    OTHER_NATIONALITY: yn(s2.otherNationalityExist),
    OTHER_NATIONALITY_1_COUNTRY: s2.otherNationality || "",
    OTHER_NATIONALITY_1_HAS_PASSPORT: yn(s2.otherNationalityExist),
    OTHER_NATIONALITY_1_PASSPORT_NUMBER:
      s2.otherNationalityPassportNo || "",

    PERMANENT_RESIDENT_OTHER_COUNTRY: yn(s2.otherSessionExist),
    PERMANENT_RESIDENT_1_COUNTRY:
      s2.otherSessionExistCountry || "",
    PERMANENT_RESIDENT_2_COUNTRY:
      s2.otherSessionExistCountry || "",

    NATIONAL_ID: s2.tcId || "",
    SSN: s2.ssn || "",
    TAX_ID: s2.vkn || "",

    /* ===== Travel ===== */
    PURPOSE_OF_TRIP: s3.visaType || "",
    PURPOSE_OF_TRIP_SUB: s3.visaTypeDesc || "",
    HAS_SPECIFIC_TRAVEL_PLANS: yn(s3.tourismPlanFinalized),

    ARRIVAL_DAY: "",
    ARRIVAL_MONTH: "",
    ARRIVAL_YEAR: "",
    ARRIVAL_CITY: s3.usaArrivalCity || "",

    DEPARTURE_DAY: "",
    DEPARTURE_MONTH: "",
    DEPARTURE_YEAR: "",
    DEPARTURE_CITY: s3.usaDepartureCity || "",

    TRAVEL_LOCATION_1: s3.usaLocations || "",
    TRAVEL_LOS_VALUE: s3.stayDurationValue || "",
    TRAVEL_LOS_UNIT: s3.stayDurationUnit || "",

    US_ADDRESS1: s3.usaAddress || "",
    US_ADDRESS2: "",
    US_CITY: s3.usaAddressCity || "",
    US_STATE: s3.usaAddressState || "",

    /* ===== Contact ===== */
    HOME_ADDRESS: s5.homeAddress || "",
    HOME_CITY: s5.home_city || "",
    HOME_POSTAL_CODE: s5.post_code || "",
    HOME_COUNTRY: s5.home_country || "",
    MAILING_SAME_AS_HOME: "YES",

    PRIMARY_PHONE: s5.phone1 || "",
    MOBILE_PHONE: s5.phone2 || "",
    WORK_PHONE: s5.workPhone || "",
    HAS_ADDITIONAL_PHONE: "NO",

    EMAIL: s5.email || "",
    HAS_ADDITIONAL_EMAIL: "NO",

    SOCIAL_MEDIA: s5.socialMediaAccounts || "",
    SOCIAL_MEDIA_USERNAME: s5.socialMediaAccounts || "",
    ADDITIONAL_SOCIAL: "NO",
  }
}
