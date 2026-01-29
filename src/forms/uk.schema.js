export const ukVisaSchema = [
  {
    section: "Personal Information",
    fields: [
      "tcId",
      "fullName",
      "nationality",
      "other_nationality",
      "other_nationality_country",
      "other_nationality_start_date",
      "other_nationality_end_date",
      "gender",
      "maritalStatus",
      "maidenName",
      "bool_last_fullname",
      "last_fullname",
      "birthDate",
      "birthPlace",
      "phone_number",
      "phone_number2",
      "email",
      "email2",
    ],
  },

  {
    section: "Home Address & Residence",
    fields: [
      "home_address",
      "home_city",
      "home_district",
      "home_neighborhood",
      "home_street",
      "home_avenue",
      "home_building_no",
      "home_apartment_no",
      "post_code",
      "home_owner",
      "home_owner_info",
      "residence_duration",
      "past_addresses",
    ],
  },

  {
    section: "Partner / Spouse Information",
    fields: [
      "partner_full_name",
      "partner_birth_date",
      "partner_nationality",
      "partner_travel_with_you",
      "partner_passport_number",
      "partner_lives_with_you",
    ],
  },

  {
    section: "Family Information",
    fields: [
      "boolean_child",
      "child_count",
      "mother_full_name",
      "mother_birth_date",
      "mother_nationality",
      "mother_travel_with_you",
      "father_full_name",
      "father_birth_date",
      "father_nationality",
      "father_travel_with_you",
      // "child_names",
      // "child_travel_with_you",
    ],
  },

  {
    section: "Passport & Identity",
    fields: [
      "passport_number",
      "Passport_start_date",
      "Passport_end_date",
      "passport_issuing_authority",
      "tc_card_end_date",
    ],
  },

  {
    section: "Work & Financial Information",
    fields: [
      "boolean_work",
      "work_name",
      "work_address",
      "work_phone",
      "worker_title",
      "work_year",
      "employee",
      "monthly_money",
      "savings",
      "sideline",
      "monthly_expenditure_amount",
    ],
  },

  {
    section: "Travel Information",
    fields: [
      "uk_address",
      "travel_start_date",
      "travel_end_date",
      "travel_reason",
      "travel_reason_other",
      "have_invitation",
      "inviter_fullname",
      "inviter_phone",
      "inviter_email",
      "inviter_address",
      "invitation_type",
      "invitation_reason",
      "travel_with_non_family",
      "travel_non_family_fullname",
      "travel_non_family_relation",
      "travel_non_family_phone",
    ],
  },

  {
    section: "Previous Travel History",
    fields: [
      "boolean_traveled_adroad",
      // "abroad_country",
      "other_visited_countries",
      // "lastTravels",
      "uk_visited_last10",
      "uk_visited_count",
      // "uk_visits",
      // "uk_visit_purpose",
      // "uk_visit_dates",
    ],
  },

  {
    section: "Expenses & Sponsorship",
    fields: [
      "boolean_cover_expenses",
      "who_cover_expenses",
      "money_cover_expenses",
      "cover_expenses_phone",
      "cover_expenses_email",
      "cover_expenses_reason",
      "spend_pound",
    ],
  },

  {
    section: "UK Family & Connections",
    fields: [
      "has_family_in_uk",
      "uk_family_relation",
      "uk_family_fullname",
      "uk_family_nationality",
      "uk_family_legal_status",
      "uk_family_has_temp_visa",
      "uk_family_is_resident",
      "uk_family_passport",
      "uk_family_visa_explanation",
    ],
  },

  {
    section: "Visa & Immigration History",
    fields: [
      "boolean_refused_visa",
      "when_refused",
      "refused_about",
      "uk_visa_last10",
      "uk_visa_issue_date",
      "uk_stay_application_last10",
      "uk_stay_application_explanation",
      "uk_public_funds",
      "uk_public_funds_details",
      "visa_refused_or_banned",
      "visa_refused_details",
    ],
  },

  {
    section: "Medical & National Insurance",
    fields: [
      "medical_treatment_uk",
      "medical_treatment_details",
      "national_insurance_number_exist",
      "national_insurance_number",
    ],
  },

  {
    section: "Documents Upload",
    fields: [
      "passportFile",
      "photoFile",
    ],
  },
]
