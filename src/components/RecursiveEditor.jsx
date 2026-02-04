"use client"

import { ds160Labels } from "@/forms/labels"
import {
  YES_NO_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  COUNTRY_OPTIONS,languages_option,allCountries,monthOptions,state,
  dateList,
  payerList,
  visatype,
  visaselect
} from "@/forms/ds160Options"
import MultiSelectDropdown from "@/components/MultiSelectDropdown"
/* =========================
   ARRAY FIELD CONFIG
   ========================= */
const selectFieldMap = {
  // YES / NO
  STUDY_IN_US: YES_NO_OPTIONS,
  OTHER_NAME: YES_NO_OPTIONS,
  OTHER_NATIONALITY: YES_NO_OPTIONS,
  PERMANENT_RESIDENT_OTHER_COUNTRY: YES_NO_OPTIONS,
  PASSPORT_LOST: YES_NO_OPTIONS,
  PREV_US_TRAVEL: YES_NO_OPTIONS,
  PREV_VISA: YES_NO_OPTIONS,
  ESTA_DENIED: YES_NO_OPTIONS,
OTHER_NATIONALITY_1_HAS_PASSPORT: YES_NO_OPTIONS,
MAILING_SAME_AS_HOME: YES_NO_OPTIONS,
PAYER_ADDRESS_SAME:YES_NO_OPTIONS,
HAS_ADDITIONAL_PHONE:YES_NO_OPTIONS,
HAS_ADDITIONAL_EMAIL:YES_NO_OPTIONS,
// SOCIAL_MEDIA:YES_NO_OPTIONS,
US_DRIVER_LICENSE:YES_NO_OPTIONS,
ADDITIONAL_SOCIAL:YES_NO_OPTIONS,
  // ENUM
  GENDER: GENDER_OPTIONS,
  MARITAL_STATUS: MARITAL_STATUS_OPTIONS,

  // COUNTRY
  VISAEDUCOUNTRY1:COUNTRY_OPTIONS,
  VISAEDUCOUNTRY2:COUNTRY_OPTIONS,
  NATIONALITY: COUNTRY_OPTIONS,
  BIRTH_COUNTRY: COUNTRY_OPTIONS,
  PASSPORT_ISSUED_COUNTRY: COUNTRY_OPTIONS,
  PASSPORT_ISSUED_IN_COUNTRY: COUNTRY_OPTIONS,
  PERMANENT_RESIDENT_1_COUNTRY: COUNTRY_OPTIONS,
  PERMANENT_RESIDENT_2_COUNTRY: COUNTRY_OPTIONS,
  BIRTH_COUNTRY:COUNTRY_OPTIONS,
  OTHER_NATIONALITY_1_COUNTRY:COUNTRY_OPTIONS,
  // STATE
  US_STATE:state,
  US_DRIVER_LICENSE_STATE:state,
  US_POC_STATE:state,
  SCHOOL_STATE:state,

  // MONTH
  BIRTH_MONTH:monthOptions,
  ARRIVAL_MONTH:monthOptions,
  DEPARTURE_MONTH:monthOptions,
  INTENDED_ARRIVAL_MONTH:monthOptions,
  SPOUSE_DOB_MONTH:monthOptions,
  DECEASED_SPOUSE_DOB_MONTH:monthOptions,

  // DATE_LIST
  TRAVEL_LOS_UNIT:dateList,
// PAYER
PAYER_TYPE:payerList,
// VISA
PURPOSE_OF_TRIP:visatype,
PURPOSE_OF_TRIP_SUB:visaselect,
}
export const multiSelectFieldMap = {
  LANGUAGES: languages_option,
  COUNTRIES_VISITED: allCountries,
}
const arrayFieldConfig = {
  EDUCATIONS: {
    prefix: "EDU_",
    label: "Educational Institutions Attended",
    fields: [
      { key: "SCHOOL_NAME", label: "School Name" },
      { key: "COURSE", label: "Course of Study" },
      { key: "DATE_FROM", label: "From" },
      { key: "DATE_TO", label: "To" },
      { key: "CITY", label: "City" },
      { key: "STATE", label: "State/Province" },
      { key: "POSTAL", label: "Postal Code" },
      { key: "COUNTRY", label: "Country" },
      { key: "ADDR1", label: "Address Line 1" },
      { key: "ADDR2", label: "Address Line 2" },
    ],
  },
}

/* =========================
   HELPERS
   ========================= */

function extractArrayData(data, prefix) {
  const result = []

  Object.keys(data || {}).forEach((key) => {
    const match = key.match(new RegExp(`^${prefix}(\\d+)_(.+)$`))
    if (!match) return

    const index = Number(match[1])
    const field = match[2]

    if (!result[index]) result[index] = {}
    result[index][field] = data[key]
  })

  return result.filter(Boolean)
}

function flattenArrayData(list, data, prefix) {
  const cleaned = { ...data }

  Object.keys(cleaned).forEach((k) => {
    if (k.startsWith(prefix)) delete cleaned[k]
  })

  list.forEach((item, i) => {
    const idx = String(i).padStart(2, "0")
    Object.entries(item).forEach(([k, v]) => {
      cleaned[`${prefix}${idx}_${k}`] = v
    })
  })

  return cleaned
}

function isImageUrl(v) {
  return typeof v === "string" && /\.(jpg|jpeg|png|webp)$/i.test(v)
}

function isPdfUrl(v) {
  return typeof v === "string" && /\.pdf(\?|$)/i.test(v)
}

function prettifyKey(key) {
  return key
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

/* =========================
   COMPONENT
   ========================= */

export default function RecursiveEditor({ data, onChange, schema }) {
  const update = (key, value) => onChange({ ...data, [key]: value })

  const arrayPrefixes = Object.values(arrayFieldConfig).map(
    (c) => c.prefix
  )

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 space-y-8">
      {schema?.map((section) => (
        <section
          key={section.section}
          className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              {section.section}
            </h2>
            <span className="text-xs text-gray-500">
              {section.fields.length} alan
            </span>
          </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
  {section.fields.map((field) => {
    const value = data?.[field]
    const label =
      ds160Labels?.[section.section]?.[field] ||
      prettifyKey(field)

    /* =====================
       1️⃣ ARRAY FIELD
       ===================== */
    if (arrayFieldConfig[field]) {
      const config = arrayFieldConfig[field]
      const list = extractArrayData(data, config.prefix)

      return (
        <Field
          key={`${section.section}-${field}`}
          label={label || config.label}
        >
          <div className="space-y-4">
            {list.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 p-4 space-y-2"
              >
                <div className="font-semibold text-sm text-gray-700">
                  {config.label} #{idx + 1}
                </div>

                {config.fields.map((f) => (
                  <input
                    key={f.key}
                    className={inputClass}
                    placeholder={f.label}
                    value={item[f.key] || ""}
                    onChange={(e) => {
                      const updated = [...list]
                      updated[idx] = {
                        ...updated[idx],
                        [f.key]: e.target.value,
                      }
                      onChange(
                        flattenArrayData(
                          updated,
                          data,
                          config.prefix
                        )
                      )
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </Field>
      )
    }
    /* ===== MULTI SELECT (CHECKBOX LIST) ===== */
if (multiSelectFieldMap[field]) {
  return (
    <Field key={field} label={label}>
      <MultiSelectDropdown
        label={label}
        options={multiSelectFieldMap[field]}
        value={data?.[field]}
        onChange={(v) => update(field, v)}
      />
    </Field>
  )
}
    /* =====================
       2️⃣ SELECT FIELD
       ===================== */
    if (selectFieldMap[field]) {
      return (
        <Field key={`${section.section}-${field}`} label={label}>
          <select
            className={inputClass}
            value={value ?? ""}
            onChange={(e) => update(field, e.target.value)}
          >
            <option value="">Select</option>
            {selectFieldMap[field].map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
      )
    }

    /* =====================
       3️⃣ IMAGE
       ===================== */
    if (isImageUrl(value)) {
      return (
        <Field key={field} label={label}>
          <img
            src={value}
            alt={label}
            className="h-auto w-56 rounded-xl border"
          />
          <input
            className={inputClass}
            value={value}
            onChange={(e) => update(field, e.target.value)}
          />
        </Field>
      )
    }

    /* =====================
       4️⃣ PDF
       ===================== */
    if (isPdfUrl(value)) {
      return (
        <Field key={field} label={label}>
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 text-sm underline"
          >
            PDF’i Aç
          </a>
          <input
            className={inputClass}
            value={value}
            onChange={(e) => update(field, e.target.value)}
          />
        </Field>
      )
    }

    /* =====================
       5️⃣ DEFAULT INPUT
       ===================== */
    return (
      <Field key={field} label={label}>
        <input
          className={inputClass}
          value={value ?? ""}
          onChange={(e) => update(field, e.target.value)}
          placeholder="-"
        />
      </Field>
    )
  })}
</div>

        </section>
      ))}

      {/* ===== OTHER FIELDS ===== */}
      {/* <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
          Diğer Alanlar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {Object.keys(data || {})
            .filter(
              (k) =>
                !schema.some((s) => s.fields.includes(k)) &&
                !arrayPrefixes.some((p) => k.startsWith(p))
            )
            .sort()
            .map((k) => (
              <Field key={k} label={prettifyKey(k)}>
                <input
                  className={inputClass}
                  value={data?.[k] ?? ""}
                  onChange={(e) => update(k, e.target.value)}
                />
              </Field>
            ))}
        </div>
      </section> */}
    </div>
  )
}

/* =========================
   UI HELPERS
   ========================= */

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-wide text-gray-500">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
