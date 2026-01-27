import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req) {
  try {
    const { visa_form_id } = await req.json()

    if (!visa_form_id) {
      return NextResponse.json(
        { error: "visa_form_id required" },
        { status: 400 }
      )
    }

    // 1️⃣ Formu al
    const { data: form } = await supabaseAdmin
      .from("visa_forms")
      .select("id, visa_type, data")
      .eq("id", visa_form_id)
      .single()

    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      )
    }

    // 2️⃣ Status güncelle
    await supabaseAdmin
      .from("visa_forms")
      .update({
        status: "bot_running",
        bot_started_at: new Date().toISOString(),
      })
      .eq("id", visa_form_id)

    // 3️⃣ Selenium LOCAL’e sinyal
    // (şimdilik sadece flag)
    return NextResponse.json({
      success: true,
      message: "Bot başlatıldı",
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
