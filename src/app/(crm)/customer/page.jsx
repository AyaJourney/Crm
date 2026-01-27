"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function Admin() {
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return router.push("/login")

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profile.role !== "customer") {
        router.push("/login")
      }
    }

    check()
  }, [])

  return <h1>Customer Panel</h1>
}
