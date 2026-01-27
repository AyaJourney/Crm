import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req) {
  const { name, email, phone, password } = await req.json()

  const { data: newUser, error } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const userId = newUser.user.id

  await supabaseAdmin.from("profiles").insert({
    id: userId,
    email,
    role: "customer",
  })

  await supabaseAdmin.from("customers").insert({
    user_id: userId,
    name,
    email,
    phone,
  })

  return NextResponse.json({ success: true })
}
