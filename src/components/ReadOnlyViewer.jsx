// components/ReadOnlyViewer.jsx
export default function ReadOnlyViewer({ data, schema }) {
  if (!Array.isArray(schema)) return null
console.log(data,"data")
  return (
    <div className="space-y-10">
      {schema.map((section) => (
        <div
          key={section.section}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
        >
          {/* SECTION TITLE */}
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-6">
            {section.section}
          </h3>

          {/* FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            {section.fields.map((fieldKey) => {
              const value = data?.[fieldKey]

              return (
                <div key={fieldKey} className="space-y-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {fieldKey}
                  </div>

                  <div
                    className={`text-sm font-medium ${
                      value ? "text-gray-900" : "text-gray-400 italic"
                    }`}
                  >
                    {value || "—"}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
