"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCustomers = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/login")
        return
      }

      const { data: rows, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error) setCustomers(rows)
      setLoading(false)
    }

    loadCustomers()
  }, [])

  if (loading) return <p>Yükleniyor...</p>

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ margin: 0 }}>Müşteriler</h1>

        <button
          onClick={() => router.push("/admin/customers/new")}
          style={{
            padding: "10px 16px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + Yeni Müşteri
        </button>
      </div>

      {customers.length === 0 ? (
        <div
          style={{
            background: "#f9fafb",
            padding: 24,
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          <p>Henüz müşteri yok</p>
          <button
            onClick={() => router.push("/admin/customers/new")}
            style={{
              marginTop: 10,
              padding: "8px 14px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            İlk Müşteriyi Ekle
          </button>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead style={{ background: "#f3f4f6" }}>
              <tr>
                <th style={thStyle}>Ad</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Telefon</th>
                <th style={thStyle}>Oluşturulma</th>
                <th style={thStyle}>Durum</th>

              </tr>
            </thead>
            <tbody>
              {customers?.map((c) => (
                <tr
                  key={c.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/admin/customers/${c.id}`)}
                >
                  <td style={tdStyle}>{c.name}</td>
                  <td style={tdStyle}>{c.email}</td>
                  <td style={tdStyle}>{c.phone || "-"}</td>
                  <td style={tdStyle}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                             <td style={tdStyle}>{c.durum || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const thStyle = {
  padding: "12px 14px",
  textAlign: "left",
  fontSize: 14,
  fontWeight: 600,
  borderBottom: "1px solid #e5e7eb",
}

const tdStyle = {
  padding: "12px 14px",
  fontSize: 14,
  borderBottom: "1px solid #e5e7eb",
}
