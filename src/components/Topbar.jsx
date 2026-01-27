"use client"

import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function Topbar({ role }) {
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header style={{ padding: 16, borderBottom: "1px solid #ddd" }}>
      <span>Rol: {role}</span>
      <button onClick={logout} style={{ float: "right" }}>
        Çıkış
      </button>
    </header>
  )
}
