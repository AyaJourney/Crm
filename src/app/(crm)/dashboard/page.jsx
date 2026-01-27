"use client"

import { useEffect } from "react"
import { supabase } from "../../../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const redirectByRole = async () => {
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

      if (profile.role === "admin") router.push("/admin")
      if (profile.role === "employee") router.push("/employee")
      if (profile.role === "customer") router.push("/customer")
    }

    redirectByRole()
  }, [])

  return <p>Yönlendiriliyor...</p>
}
