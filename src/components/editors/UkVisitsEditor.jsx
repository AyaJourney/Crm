"use client"

export default function UkVisitsEditor({ data = [], onChange }) {
  const addVisit = () => {
    onChange([
      ...(data || []),
      {
        purpose: "",
        arrivalDate: "",
        departureDate: "",
      },
    ])
  }

  const updateItem = (index, key, value) => {
    const arr = [...data]
    arr[index] = { ...arr[index], [key]: value }
    onChange(arr)
  }

  const removeItem = (index) => {
    const arr = [...data]
    arr.splice(index, 1)
    onChange(arr)
  }

  return (
    <div className="md:col-span-2 space-y-4 mt-6">

      {data.map((item, index) => (
        <div
          key={index}
          className="relative p-4 border rounded-2xl bg-gray-50 shadow-sm"
        >
          <h4 className="absolute -top-3 left-4 bg-gray-50 px-2 text-sm font-medium">
            {index + 1}. UK Visit
          </h4>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Purpose */}
            <div>
              <label className="text-sm font-medium block">
                Purpose of Visit
              </label>
              <input
                className={inputClass}
                value={item.purpose || ""}
                onChange={(e) =>
                  updateItem(index, "purpose", e.target.value)
                }
                placeholder="Tourism, Business, Study..."
              />
            </div>

            {/* Arrival */}
            <div>
              <label className="text-sm font-medium block">
                Arrival Date
              </label>
              <input
                type="date"
                className={inputClass}
                value={item.arrivalDate || ""}
                onChange={(e) =>
                  updateItem(index, "arrivalDate", e.target.value)
                }
              />
            </div>

            {/* Departure */}
            <div>
              <label className="text-sm font-medium block">
                Departure Date
              </label>
              <input
                type="date"
                className={inputClass}
                value={item.departureDate || ""}
                onChange={(e) =>
                  updateItem(index, "departureDate", e.target.value)
                }
              />
            </div>
          </div>

          {/* ❌ REMOVE */}
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="absolute top-3 right-3 px-3 py-1 text-xs bg-red-500 text-white rounded-lg"
          >
            Remove
          </button>
        </div>
      ))}

      {/* ➕ ADD */}
      <button
        type="button"
        onClick={addVisit}
        className="px-2 py-1 bg-blue-600 text-white rounded-xl"
      >
        Add UK Visit
      </button>
    </div>
  )
}

const inputClass =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
