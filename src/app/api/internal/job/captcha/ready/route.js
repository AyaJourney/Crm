import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req) {
  const { visa_form_id, captcha_url } = await req.json()

  await supabaseAdmin
    .from("visa_forms")
    .update({
      captcha_url,
      waiting_for_captcha: true,
      status: "waiting_captcha",
    })
    .eq("id", visa_form_id)

  return NextResponse.json({ success: true })
}
