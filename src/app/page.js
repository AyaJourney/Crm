"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser()

      // login yoksa → login
      if (!data?.user) {
        router.replace("/login")
        return
      }

      // login varsa → role bak
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profile?.role === "admin") {
        router.replace("/admin")
      } else {
        router.replace("/dashboard") // veya CRM ana sayfan
      }
    }

    check()
  }, [router])

  return null // hiçbir şey render etme
}
