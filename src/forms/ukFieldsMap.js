import {
  evet_hayir,
  GENDER_OPTIONS_UK,allCountries,MARITAL_STATUS_OPTIONS_UK,home_owner,work_boolean,travel_select,other_visited_country
} from "@/forms/ds160Options"
export const fieldTypeMap = {
  // SELECT
  gender: {
    type: "select",
    options: GENDER_OPTIONS_UK,
  },
  maritalStatus: {
    type: "select",
    options: MARITAL_STATUS_OPTIONS_UK,
  },
  nationality: {
    type: "select",
    options: allCountries,
  },
  other_nationality_country: {
    type: "select",
    options: allCountries,
  },
  partner_nationality: {
    type: "select",
    options: allCountries,
  },
  mother_nationality: {
    type: "select",
    options: allCountries,
  },
  father_nationality: {
    type: "select",
    options: allCountries,
  },
  uk_family_nationality: {
    type: "select",
    options: allCountries,
  },
//   abroad_country: {
//     type: "select",
//     options: allCountries,
//   },
  boolean_work: {
    type: "select",
    options: evet_hayir,
  },
  boolean_traveled_adroad: {
    type: "select",
    options: evet_hayir,
  },
  boolean_refused_visa: {
    type: "select",
    options: evet_hayir,
  },
  other_nationality: {
    type: "select",
    options: evet_hayir,
  },
  bool_last_fullname: {
    type: "select",
    options: evet_hayir,
  },
  mother_travel_with_you: {
    type: "select",
    options: evet_hayir,
  },
    father_travel_with_you: {
    type: "select",
    options: evet_hayir,
  },
uk_visited_last10: {
    type: "select",
    options: evet_hayir,
  },
boolean_child:{
     type: "select",
    options: evet_hayir,
  },
have_invitation:{
     type: "select",
    options: evet_hayir,
  },
travel_with_non_family:{
     type: "select",
    options: evet_hayir,
  },
  boolean_cover_expenses:{
     type: "select",
    options: evet_hayir,
  },
  has_family_in_uk:{
     type: "select",
    options: evet_hayir,
  },
  uk_family_has_temp_visa:{
     type: "select",
    options: evet_hayir,
  },
  uk_visa_last10:{
     type: "select",
    options: evet_hayir,
  },
  uk_stay_application_last10:{
     type: "select",
    options: evet_hayir,
  },
  uk_public_funds:{
     type: "select",
    options: evet_hayir,
  },
  visa_refused_or_banned:{
     type: "select",
    options: evet_hayir,
  },
  medical_treatment_uk:{
     type: "select",
    options: evet_hayir,
  },
  national_insurance_number_exist:{
     type: "select",
    options: evet_hayir,
  },
  partner_travel_with_you:{
     type: "select",
    options: evet_hayir,
  },
  partner_lives_with_you:{
     type: "select",
    options: evet_hayir,
  },
  uk_visit_purpose:{
     type: "select",
    options: evet_hayir,
  },
  home_owner:{
     type: "select",
    options: home_owner,
  },
  boolean_work:{
     type: "select",
    options: work_boolean,
  },
  travel_reason:{
     type: "select",
    options: travel_select,
  },
other_visited_countries:{
     type: "select",
    options: other_visited_country,
  },
  // DATE (🔥 yeni)
  birthDate: { type: "date" },
  partner_birth_date: { type: "date" },
  mother_birth_date: { type: "date" },
  father_birth_date: { type: "date" },
  Passport_start_date: { type: "date" },
  Passport_end_date: { type: "date" },
  tc_card_end_date: { type: "date" },
  travel_start_date: { type: "date" },
  travel_end_date: { type: "date" },
  other_nationality_start_date: { type: "date" },
  other_nationality_end_date: { type: "date" },
  uk_visa_issue_date: { type: "date" },
}
