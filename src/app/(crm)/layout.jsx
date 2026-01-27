"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useRouter, usePathname } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"

export default function CrmLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()

      // 🔴 login yoksa → login
      if (!data?.user) {
        router.replace("/login")
        return
      }

      // 🟢 login var → role çek
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      // ⭐ KURAL: root path'teyse otomatik yönlendir
      if (pathname === "/") {
        if (profile?.role === "admin") {
          router.replace("/admin")
          return
        }
      }

      setRole(profile.role)
      setLoading(false)
    }

    init()
  }, [router, pathname])

  if (loading) return <p>Yükleniyor...</p>

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar role={role} />
      <div style={{ flex: 1 }}>
        <Topbar role={role} />
        <main style={{ padding: 24 }}>{children}</main>
      </div>
    </div>
  )
}
