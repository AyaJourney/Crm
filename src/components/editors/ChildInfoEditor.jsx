export default function ChildInfoEditor({
  step,
  onAdd,
  onRemove,
  onUpdateField,
}) {
  if (step.boolean_child !== "EVET") return null

  const count = Number(step.child_count || 0)

  return (
    <div className="col-span-full mt-3">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">
          Children Information
        </h3>

        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
          onClick={onAdd}
        >
          ➕ Yeni Çocuk Ekle
        </button>
      </div>

      {/* CHILD CARDS */}
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-xl p-6 mb-6"
        >
          {/* ❌ SİL BUTONU – SOL ÜST */}
          <button
            type="button"
            className="absolute top-3 right-3 text-xs text-red-600 underline"
            onClick={() => onRemove(i)}
          >
            ❌ Çocuğu Sil
          </button>

          {/* Çocuk Adı */}
          <div>
            <label className="text-sm font-medium">
              {i + 1}. Child Full Name
            </label>
            <input
              className={inputClass}
              value={step.child_names?.[i] || ""}
              onChange={(e) =>
                onUpdateField("child_names", i, e.target.value)
              }
            />
          </div>

          {/* Doğum Tarihi */}
          <div>
            <label className="text-sm font-medium">
              {i + 1}. Date of Birth
            </label>
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              min="1900-01-01"
              className={inputClass}
              value={step.child_birth_date?.[i] || ""}
              onChange={(e) =>
                onUpdateField(
                  "child_birth_date",
                  i,
                  e.target.value
                )
              }
            />
          </div>

          <SelectYesNo
            label={`${i + 1}. Will the child travel with you?`}
            value={step.child_travel_with_you?.[i]}
            onChange={(v) =>
              onUpdateField("child_travel_with_you", i, v)
            }
          />

          <SelectYesNo
            label={`${i + 1}. Does the child live with you?`}
            value={step.child_live?.[i]}
            onChange={(v) =>
              onUpdateField("child_live", i, v)
            }
          />

          <SelectYesNo
            label={`${i + 1}. Does the child have a UK visa?`}
            value={step.child_visa?.[i]}
            onChange={(v) =>
              onUpdateField("child_visa", i, v)
            }
          />

          {/* Pasaport */}
          <div>
            <label className="text-sm font-medium">
              {i + 1}. Passport Number (if any)
            </label>
            <input
              className={inputClass}
              value={
                step.child_passport_numbers?.[i] || ""
              }
              onChange={(e) =>
                onUpdateField(
                  "child_passport_numbers",
                  i,
                  e.target.value
                )
              }
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ===== YES / NO SELECT ===== */
function SelectYesNo({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        className={inputClass}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        <option value="EVET">Yes</option>
        <option value="HAYIR">No</option>
      </select>
    </div>
  )
}

const inputClass =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
