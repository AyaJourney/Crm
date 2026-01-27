"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"

export default function CrmLayout({ children }) {
  const router = useRouter()
  const [role, setRole] = useState(null)

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      setRole(profile.role)
    }

    init()
  }, [])

  if (!role) return <p>Yükleniyor...</p>

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
