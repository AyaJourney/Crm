"use client"

import { useEffect, useRef, useState } from "react"

export default function MultiSelectDropdown({
  label,
  options,
  value,
  onChange,
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selectedValues = (value || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () =>
      document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleValue = (val) => {
    let updated
    if (selectedValues.includes(val)) {
      updated = selectedValues.filter((v) => v !== val)
    } else {
      updated = [...selectedValues, val]
    }
    onChange(updated.join(","))
  }

  const displayLabel =
    selectedValues.length > 0
      ? options
          .filter((o) => selectedValues.includes(o.value))
          .map((o) => o.label)
          .join(", ")
      : "Select"

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm cursor-pointer"
      >
        {displayLabel}
      </div>

      {open && (
        <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg p-2">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm py-1 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(opt.value)}
                onChange={() => toggleValue(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
