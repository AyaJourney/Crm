export default function BarcodeSelectModal({ forms, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h3 className="font-semibold text-lg">
          Barcode’lu Form Seç
        </h3>

        {forms.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelect(f)}
            className="w-full text-left border rounded-md px-3 py-2 hover:bg-gray-100"
          >
            <div className="font-medium">
              {f.barcode}
            </div>
            <div className="text-xs text-gray-500">
              Güncelleme: {new Date(f.updated_at).toLocaleString()}
            </div>
          </button>
        ))}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  )
}
