export function normalizeCanadaForm(raw) {
  const out = {}

  /* =========================
     KİMLİK & İLETİŞİM
     ========================= */
  out.tcId = raw.tcId || ""
  out.fullName = raw.fullName || ""
  out.email = raw.email || ""
  out.phone = raw.phone_number || ""
  out.gender = raw.gender || ""
  out.birthDate = raw.birthDate || ""
  out.birthPlace = raw.birthPlace || ""

  out.address = {
    city: raw.home_city || "",
    district: raw.home_district || "",
    neighborhood: raw.home_neighborhood || "",
    street: raw.home_street || "",
    avenue: raw.home_avenue || "",
    buildingNo: raw.home_building_no || "",
    apartmentNo: raw.home_apartment_no || "",
    full: raw.home_address || "",
  }

  out.previousSurname = raw.previousSurname || ""
  out.tcEndDate = raw.tcEndDate || ""

  /* =========================
     EVLİLİK & ÇOCUKLAR
     ========================= */
  out.maritalStatus = raw.maritalStatus || ""

  out.currentMarriage =
    raw.maritalStatus === "EVLI"
      ? {
          marriageDate: raw.marriageDate || "",
          spouseFullName: raw.spouseFullName || "",
          spouseBirthDate: raw.spouseBirthDate || "",
          spouseBirthPlace: raw.spouseBirthPlace || "",
          spouseAddress: raw.spouseAddress || "",
          spouseOccupation: raw.spouseOccupation || "",
        }
      : null

  out.otherMarriages =
    raw.otherMarriages === "EVET" ||
    raw.otherMarriages === "YES" ||
    raw.otherMarriages === true

  out.previousMarriages = Array.isArray(raw.marriages)
    ? raw.marriages
    : []

  out.children = {
    exist:
      raw.childrenExist === "EVET" ||
      raw.childrenExist === "YES",
    count: raw.childrenCount || 0,
    list: Array.isArray(raw.children) ? raw.children : [],
  }

  /* =========================
     EBEVEYNLER & KARDEŞLER
     ========================= */
  out.mother = {
    fullName: raw.motherFullName || "",
    maritalStatus: raw.motherMaritalStatus || "",
    birthPlace: raw.motherBirthPlace || "",
    birthDate: raw.motherBirthDate || "",
    address: raw.motherAddress || "",
    occupation: raw.motherOccupation || "",
  }

  out.father = {
    fullName: raw.fatherFullName || "",
    maritalStatus: raw.fatherMaritalStatus || "",
    birthPlace: raw.fatherBirthPlace || "",
    birthDate: raw.fatherBirthDate || "",
    address: raw.fatherAddress || "",
    occupation: raw.fatherOccupation || "",
  }

  out.siblings = {
    count: raw.siblingsCount || 0,
    list: Array.isArray(raw.siblings) ? raw.siblings : [],
  }

  /* =========================
     DİL – EĞİTİM – ASKERLİK
     ========================= */
  out.language = {
    native: raw.nativeLanguage || "",
    canCommunicate:
      raw.canCommunicateInEnglishFrench === "EVET" ||
      raw.canCommunicateInEnglishFrench === "YES",
    exams: Array.isArray(raw.exams) ? raw.exams : [],
  }

  out.education = {
    postSecondary:
      raw.postSecondaryEducation === "EVET" ||
      raw.postSecondaryEducation === "YES",
    schoolName: raw.schoolName || "",
    programName: raw.programName || "",
    city: raw.educationCity || "",
    country: raw.educationCountry || "",
    startDate: raw.educationStartDate || "",
    endDate: raw.educationEndDate || "",
  }

  out.military = {
    served:
      raw.boolean_military === "EVET" ||
      raw.boolean_military === "YES",
    city: raw.military_city || "",
    startDate: raw.military_start_date || "",
    endDate: raw.military_end_date || "",
  }

  /* =========================
     İŞ DENEYİMİ
     ========================= */
  out.employment = {
    status: raw.employmentStatus || "",
    current: {
      company: raw.currentCompanyName || "",
      position: raw.currentPosition || "",
      startDate: raw.currentJobStartDate || "",
      city: raw.currentWorkCity || "",
      country: raw.currentWorkCountry || "",
      retirementDate: raw.retirementDate || "",
    },
    history: Array.isArray(raw.last10YearsWorkExperience)
      ? raw.last10YearsWorkExperience
      : [],
  }

  /* =========================
     SEYAHAT & VİZE
     ========================= */
  out.travel = {
    previousRefusal:
      raw.previousVisaRefusal === "EVET" ||
      raw.previousVisaRefusal === "YES",
    refusalReason: raw.refusalReason || "",
    previousCanadaApplication:
      raw.previousCanadaApplication === "EVET" ||
      raw.previousCanadaApplication === "YES",
    period: {
      start: raw.travelStartDate || "",
      end: raw.travelEndDate || "",
      address: raw.travelAddress || "",
    },
    funds: raw.totalMoney || "",
    last5Years: Array.isArray(raw.last5YearsTravel)
      ? raw.last5YearsTravel
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
     ORİJİNAL VERİ (ÇOK ÖNEMLİ)
     ========================= */
  out.__raw = raw

  return out
}
