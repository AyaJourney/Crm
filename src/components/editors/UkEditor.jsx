"use client"

import { ukVisaSchema } from "@/forms/uk.schema"
import { ukStepMap } from "@/forms/ukStepMap"
import { toTR } from "@/utils/dateTr"
import { fieldTypeMap } from "@/forms/ukFieldsMap"
import ChildInfoEditor from "./ChildInfoEditor"
import AbroadCountryEditor from "./AbroadCountryEditor"
import UkVisitsEditor from "./UkVisitsEditor"
import LastTravelsEditor from "./LastTravelsEditor"
import { parseLastTravels } from "@/utils/parseLastTravels"
import { useEffect } from "react"
/* =========================
   UK SELECT MAP
   ========================= */


/* =========================
   COMPONENT
   ========================= */
export default function UkEditor({ data, onChange }) {


  const update = (key, value) => {
    onChange({ ...data, [key]: value })
  }
const step5Raw =
  data?.__raw?.steps?.[5] || data?.["5"] || {}

const parsedLastTravels = parseLastTravels(step5Raw)

const step5 = data["5"] || {}
useEffect(() => {
  if (!data?.__raw?.steps?.[5]) return

  const parsed = parseLastTravels(data.__raw.steps[5])

  setData((prev) => ({
    ...prev,
    5: {
      ...prev[5],
      lastTravels: parsed,
    },
  }))
}, [])
const getOtherVisitedCount = (val) => {
  if (!val || val === "HIC") return 0
  if (val === "1 KEZ") return 1
  if (val === "2 KEZ") return 2
  if (val === "3 KEZ") return 3
  if (val === "4 KEZ") return 4
  return 5 // 5 ve üzeri
}

const handleOtherVisitedChange = (val) => {
  const count = getOtherVisitedCount(val)
  const current = step5.lastTravels || []

  let next = [...current]

  // fazla varsa kes
  if (next.length > count) next = next.slice(0, count)

  // eksik varsa doldur
  while (next.length < count) {
    next.push({
      country: "",
      purpose: "",
      monthYear: "",
      durationDays: "",
    })
  }

  updateStepField("5", "other_visited_countries", val)
  updateStepField("5", "lastTravels", next)
}


const otherVisitedCountMap  = {
  "HIC": 0,
  "1 KEZ": 1,
  "2 KEZ": 2,
  "3 KEZ": 3,
  "4 KEZ": 4,
  "5 KEZ": 5,
  "6 VE UZERI": 5,
}

const step2 = data["2"] || {}

const addChild = () => {
  const currentCount = Number(step2.child_count || 0)
  const newIndex = currentCount

  onChange({
    ...data,
    ["2"]: {
      ...step2,
      child_count: String(currentCount + 1),
      child_names: {
        ...(step2.child_names || {}),
        [newIndex]: "",
      },
      child_birth_date: {
        ...(step2.child_birth_date || {}),
        [newIndex]: "",
      },
      child_travel_with_you: {
        ...(step2.child_travel_with_you || {}),
        [newIndex]: "",
      },
      child_live: {
        ...(step2.child_live || {}),
        [newIndex]: "",
      },
      child_visa: {
        ...(step2.child_visa || {}),
        [newIndex]: "",
      },
      child_passport_numbers: {
        ...(step2.child_passport_numbers || {}),
        [newIndex]: "",
      },
    },
  })
}

const removeChild = (index) => {
  const count = Number(step2.child_count || 0)
  if (count <= 0) return

  const removeIndex = (obj) => {
    const copy = { ...(obj || {}) }
    delete copy[index]
    return copy
  }

  onChange({
    ...data,
    ["2"]: {
      ...step2,
      child_count: String(count - 1),
      child_names: removeIndex(step2.child_names),
      child_birth_date: removeIndex(step2.child_birth_date),
      child_travel_with_you: removeIndex(step2.child_travel_with_you),
      child_live: removeIndex(step2.child_live),
      child_visa: removeIndex(step2.child_visa),
      child_passport_numbers: removeIndex(step2.child_passport_numbers),
    },
  })
}
const updateChildField = (field, index, value) => {
  onChange({
    ...data,
    ["2"]: {
      ...data["2"],
      [field]: {
        ...(data["2"]?.[field] || {}),
        [index]: value,
      },
    },
  })
}
const updateStepField = (stepNo, field, value) => {
  onChange({
    ...data,
    [stepNo]: {
      ...data[stepNo],
      [field]: value,
    },
  })
}
const renderAfterField = (field) => {
  // STEP 5
  if (
    field === "boolean_traveled_adroad" &&
    step5.boolean_traveled_adroad === "EVET"
  ) {
    return (
      <div className="md:col-span-2 space-y-4 mt-4">
        {(step5.abroad_country || []).map((item, index) => (
          <div
            key={index}
            className="relative p-4 border rounded-2xl bg-gray-50 shadow-sm"
          >
            <h4 className="absolute -top-3 left-4 bg-gray-50 px-2 text-sm font-medium">
              {index + 1}. Ülke
            </h4>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ülke */}
              <div>
                <label className="text-sm font-medium block">
                  Gidilen Ülke
                </label>
                <select
                  className={inputClass}
                  value={item.country || ""}
                  onChange={(e) => {
                    const arr = [...(step5.abroad_country || [])]
                    arr[index] = {
                      ...arr[index],
                      country: e.target.value,
                    }
                    updateStepField("5", "abroad_country", arr)
                  }}
                >
                  <option value="">Seçiniz</option>
                  {allCountries.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amaç */}
              <div>
                <label className="text-sm font-medium block">
                  Seyahat Amacı
                </label>
                <input
                  className={inputClass}
                  value={item.purpose || ""}
                  onChange={(e) => {
                    const arr = [...(step5.abroad_country || [])]
                    arr[index] = {
                      ...arr[index],
                      purpose: e.target.value,
                    }
                    updateStepField("5", "abroad_country", arr)
                  }}
                />
              </div>

              {/* Giriş */}
              <div>
                <label className="text-sm font-medium block">
                  Giriş Tarihi
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={item.start || ""}
                  onChange={(e) => {
                    const arr = [...(step5.abroad_country || [])]
                    arr[index] = {
                      ...arr[index],
                      start: e.target.value,
                    }
                    updateStepField("5", "abroad_country", arr)
                  }}
                />
              </div>

              {/* Çıkış */}
              <div>
                <label className="text-sm font-medium block">
                  Çıkış Tarihi
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={item.end || ""}
                  onChange={(e) => {
                    const arr = [...(step5.abroad_country || [])]
                    arr[index] = {
                      ...arr[index],
                      end: e.target.value,
                    }
                    updateStepField("5", "abroad_country", arr)
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const arr = [...(step5.abroad_country || [])]
                arr.splice(index, 1)
                updateStepField("5", "abroad_country", arr)
              }}
              className="absolute top-3 right-3 px-3 py-1 text-xs bg-red-500 text-white rounded-lg"
            >
              Sil
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            const newArray = [
              ...(step5.abroad_country || []),
              { country: "", purpose: "", start: "", end: "" },
            ]
            updateStepField("5", "abroad_country", newArray)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl"
        >
          Yeni Ülke Ekle
        </button>
      </div>
    )
  }

  return null
}

const emptyLastTravel = () => ({
  country: "",
  purpose: "",
  monthYear: "",
  durationDays: "",
})



// const getOtherVisitedCount = (val) =>
//   otherVisitedCountMap[val] ?? 0

useEffect(() => {
  const count = getOtherVisitedCount(step5.other_visited_countries)

  let nextTravels = [...(step5.lastTravels || [])]

  // 🔻 Fazlaysa kırp
  nextTravels = nextTravels.slice(0, count)

  // 🔺 Eksikse doldur
  while (nextTravels.length < count) {
    nextTravels.push({
      country: "",
      purpose: "",
      monthYear: "",
      durationDays: "",
    })
  }

 
  if (nextTravels.length !== (step5.lastTravels || []).length) {
    updateStepField("5", "lastTravels", nextTravels)
  }
}, [step5.other_visited_countries])

function normalizeLastTravels(existing = [], targetCount) {
  const arr = [...existing]

  while (arr.length < targetCount) {
    arr.push(emptyLastTravel())
  }

  return arr.slice(0, targetCount)
}
console.log(step5.lastTravels?.length,"data")
  return (
    <div className="mx-auto w-full max-w-6xl p-6 space-y-8">
      {ukVisaSchema.map((section) => (
        <section
          key={section.section}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            {section.section}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map((field) => {
             const map = ukStepMap[field]
const value = map
  ? data?.[map.step]?.[map.key] ?? ""
  : ""
              /* ===== SELECT ===== */
         const fieldConfig = fieldTypeMap[field]

if (fieldConfig?.type === "select") {
  return (
    <Field key={field} label={field}>
   
<select
  className={inputClass}
  value={value}
  onChange={(e) =>
    onChange({
      ...data,
      [map.step]: {
        ...data?.[map.step],
        [map.key]: e.target.value,
      },
    })
  }
>



  <option value="">Seçiniz</option>
  {fieldConfig.options.map((opt) => (
    <option key={opt.value} value={opt.value}>
      {opt.label}
    </option>
  ))}
</select>

{field === "other_visited_countries" &&  step5.other_visited_countries !== "HIC" &&  step5.lastTravels.length > 0 && (
  <LastTravelsEditor
    data={step5.lastTravels}
    onChange={(arr) =>
      updateStepField("5", "lastTravels", arr)
    }
  />
)}   
 {field === "boolean_traveled_adroad" &&
 step5.boolean_traveled_adroad === "EVET" && (
  <AbroadCountryEditor
    data={step5.abroad_country}
    onChange={(arr) =>
      updateStepField("5", "abroad_country", arr)
    }
  />
)}
                   {field === "uk_visited_last10" &&
       step5.uk_visited_last10 === "EVET" && (
        <UkVisitsEditor
          data={step5.uk_visits || []}
          onChange={(arr) =>
            updateStepField("5", "uk_visits", arr)
          }
        />
      )}
    </Field>
  )
}
if (field === "other_visited_countries") {
  return (
    <Field key={field} label={field}>
      <select
        className={inputClass}
        value={value}
        onChange={(e) =>
          handleOtherVisitedChange(e.target.value)
        }
      >
        <option value="">Select</option>
        {fieldConfig.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* 🔥 ALTINA LAST TRAVELS */}
    
    </Field>
  )
}

if (fieldConfig?.type === "date") {
  return (
    <Field key={field} label={field}>
      <input
        type="text"
        placeholder="DD-MM-YYYY"
        className={inputClass}
        value={toTR(value)}
        onChange={(e) =>
          updateField(field, e.target.value)
        }
      />
    </Field>
  )
}

              /* ===== DEFAULT INPUT ===== */
              return (
                
                <Field key={field} label={field}>
                  <input
                    className={inputClass}
                    value={value}
                    onChange={(e) =>
                      onChange({
  ...data,
  [map.step]: {
    ...data?.[map.step],
    [map.key]: e.target.value,
  },
})
                    }
                    placeholder="-"
                  />
                  
         
                </Field>
                
              )
            })}
            
          </div>
           {section.section === "Family Information" && (
<ChildInfoEditor
  step={data["2"]}
  onAdd={addChild}
  onRemove={removeChild}
  onUpdateField={updateChildField}
/>
    )}



    
        </section>
      ))}
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
        {label.replace(/_/g, " ").toUpperCase()}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
