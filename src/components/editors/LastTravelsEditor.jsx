"use client"

import { allCountries } from "@/forms/ds160Options"

export default function LastTravelsEditor({ data = [], onChange }) {
console.log("EDITOR DATA:", data)
  const update = (index, key, value) => {
    const arr = [...data]
    arr[index] = { ...arr[index], [key]: value }
    onChange(arr)
  }

  return (
    <div className="mt-6 space-y-6 md:col-span-2">

      {data.map((item, index) => (
        <div
          key={index}
          className="relative p-4 border rounded-2xl bg-gray-50 shadow-sm"
        >
          <h4 className="absolute -top-3 left-4 bg-gray-50 px-2 text-sm font-medium">
            Last {index + 1}. Travel
          </h4>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Ülke */}
            <div>
              <label className="text-sm font-medium block">
                Country
              </label>
              <select
                 className={inputClass}
                value={item.country || ""}
                onChange={(e) =>
                  update(index, "country", e.target.value)
                }
              >
                <option value="">Select</option>
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
                Purpose of Travel
              </label>
              <input
                 className={inputClass}
                value={item.purpose || ""}
                onChange={(e) =>
                  update(index, "purpose", e.target.value)
                }
              />
            </div>

            {/* Gidiş */}
            <div>
              <label className="text-sm font-medium block">
                Arrival Date
              </label>
              <input
                type="date"
                  className={inputClass}
                value={item.monthYear || ""}
                onChange={(e) =>
                  update(index, "monthYear", e.target.value)
                }
              />
            </div>

            {/* Dönüş */}
            <div>
              <label className="text-sm font-medium block">
                Departure Date
              </label>
              <input
                type="date"
                className={inputClass}
                value={item.durationDays || ""}
                onChange={(e) =>
                  update(index, "durationDays", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
const inputClass =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
