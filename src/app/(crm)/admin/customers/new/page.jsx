"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewCustomerPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Ad, email ve şifre zorunludur")
      return
    }

    setLoading(true)

    const res = await fetch("/api/admin/create-customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (data.error) {
      alert(data.error)
    } else {
      alert("Müşteri başarıyla eklendi")
      router.push("/admin/customers")
    }
  }

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "0 auto",
        background: "#fff",
        padding: 32,
        borderRadius: 10,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 6 }}>Yeni Müşteri</h1>
        <p style={{ color: "#6b7280", fontSize: 14 }}>
          Sisteme yeni bir müşteri ekleyin
        </p>
      </div>

      {/* Form */}
      <div style={{ display: "grid", gap: 16 }}>
        <Input
          label="Ad Soyad"
          placeholder="Örn: Ahmet Yılmaz"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="ahmet@mail.com"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />

        <Input
          label="Telefon"
          placeholder="+90 5xx xxx xx xx"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
        />

        <Input
          label="Geçici Şifre"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
          hint="Müşteri ilk girişte değiştirebilir"
        />
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          marginTop: 32,
        }}
      >
        <button
          onClick={() => router.back()}
          style={secondaryButton}
        >
          İptal
        </button>

        <button
          onClick={submit}
          disabled={loading}
          style={{
            ...primaryButton,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  )
}

/* --- Küçük yardımcı bileşen --- */
function Input({ label, hint, onChange, ...props }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        {label}
      </label>

      <input
        {...props}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 6,
          border: "1px solid #d1d5db",
          fontSize: 14,
        }}
      />

      {hint && (
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
          {hint}
        </div>
      )}
    </div>
  )
}

/* --- Button styles --- */
const primaryButton = {
  padding: "10px 18px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
}

const secondaryButton = {
  padding: "10px 18px",
  background: "#f3f4f6",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  cursor: "pointer",
}
