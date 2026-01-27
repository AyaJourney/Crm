"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "../../../../../lib/supabaseClient"

export default function CustomerDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState(null)
  const [files, setFiles] = useState([])
  const [visaForms, setVisaForms] = useState([])

  useEffect(() => {
    const loadData = async () => {
      // 🔐 session kontrolü
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/login")
        return
      }

      // 👤 müşteri bilgileri
      const { data: customerData } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single()

      // 📎 dosyalar
      const { data: filesData } = await supabase
        .from("customer_files")
        .select("*")
        .eq("customer_id", id)
        .order("created_at", { ascending: false })

      // 🧾 vize formları
const { data: visaData } = await supabase
  .from("visa_forms")
  .select("*")
  .eq("customer_id", id)
  .neq("status", "merged") // 🔥 merged olanları alma
  .order("created_at", { ascending: false })

      setCustomer(customerData)
      setFiles(filesData || [])
      setVisaForms(visaData || [])
      setLoading(false)
    }

    loadData()
  }, [id])
const createVisaForm = async (visaType) => {
  const { data, error } = await supabase
    .from("visa_forms")
    .insert({
      customer_id: id,
      visa_type: visaType,
      status: "new",
      form_data: {}, 
    })
    .select()
    .single()

  if (error) {
   
    return
  }

  // 🚀 direkt form sayfasına git
  router.push(`/admin/visa-forms/${data.id}`)
}
  if (loading) return <p>Yükleniyor...</p>
  if (!customer) return <p>Müşteri bulunamadı</p>

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => router.back()} style={backBtn}>
          ← Geri
        </button>

        <h1 style={{ marginTop: 10 }}>{customer.name}</h1>
        <p style={{ color: "#6b7280" }}>{customer.email}</p>
      </div>

      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* SOL KOLON */}
        <div style={card}>
          <h2>Müşteri Bilgileri</h2>

          <Info label="Ad Soyad" value={customer.name} />
          <Info label="Email" value={customer.email} />
          <Info label="Telefon" value={customer.phone} />
          <Info label="Pasaport No" value={customer.passport_no || "-"} />
          <Info label="Notlar" value={customer.notes || "-"} />
        </div>

        {/* SAĞ KOLON */}
        <div style={card}>
          <h2>Belgeler</h2>

          {files.length === 0 ? (
            <p>Henüz belge yok</p>
          ) : (
            files.map((f) => (
              <a
                key={f.id}
                href={f.file_url}
                target="_blank"
                style={fileItem}
              >
                📎 {f.type}
              </a>
            ))
          )}

          <button style={secondaryBtn}>
            + Belge Yükle
          </button>
        </div>
      </div>

      {/* VİZE FORMLARI */}
      <div style={{ ...card, marginTop: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Vize Formları</h2>

          <div>
           <button
  style={secondaryBtn}
  onClick={() => createVisaForm("ds-160")}
>
  + DS-160
</button>

<button
  style={secondaryBtn}
  onClick={() => createVisaForm("schengen")}
>
  + Schengen
</button>
          </div>
        </div>

        {visaForms.length === 0 ? (
          <p>Henüz vize formu yok</p>
        ) : (
       visaForms.map((f) => (
  <div
    key={f.id}
    style={{ ...visaItem, cursor: "pointer" }}
    onClick={() => router.push(`/admin/visa-forms/${f.id}`)}
  >
    <strong>{f.visa_type.toUpperCase()}</strong>
    <span>{f.status}</span>
  </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ----------------- küçük componentler ----------------- */

function Info({ label, value }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <small style={{ color: "#6b7280" }}>{label}</small>
      <div style={{ fontWeight: 500 }}>{value}</div>
    </div>
  )
}

/* ----------------- stiller ----------------- */

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
}

const backBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#2563eb",
  fontWeight: 600,
}

const secondaryBtn = {
  marginTop: 12,
  padding: "8px 14px",
  background: "#f3f4f6",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  cursor: "pointer",
}

const fileItem = {
  display: "block",
  padding: "6px 0",
  color: "#2563eb",
  textDecoration: "none",
}

const visaItem = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #e5e7eb",
}
