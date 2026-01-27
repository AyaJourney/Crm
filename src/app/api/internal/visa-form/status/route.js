import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req) {
  try {
    const { visa_form_id, status } = await req.json()

    if (!visa_form_id || !status) {
      return NextResponse.json(
        { error: "visa_form_id ve status zorunlu" },
        { status: 400 }
      )
    }

    await supabaseAdmin
      .from("visa_forms")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", visa_form_id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
