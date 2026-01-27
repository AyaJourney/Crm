// /api/internal/job/captcha/refresh/ack/route.ts
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req) {
  try {
    const { job_id } = await req.json()

    if (!job_id) {
      return NextResponse.json({ error: "job_id required" }, { status: 400 })
    }

    await supabaseAdmin
      .from("jobs")
      .update({
        captcha_refresh: false,   // 🔥 FALSE YAPILIYOR
        updated_at: new Date().toISOString(),
      })
      .eq("id", job_id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("CAPTCHA REFRESH ACK ERROR:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
