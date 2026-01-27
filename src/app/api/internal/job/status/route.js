import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req) {
  try {
    const { job_id, status, captcha_url, captcha_answer, captcha_image_base64 } = await req.json()

    if (!job_id || !status) {
      return NextResponse.json({ error: "job_id ve status zorunlu" }, { status: 400 })
    }

    const updateData = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (captcha_url) updateData.captcha_url = captcha_url
    if (captcha_answer) updateData.captcha_answer = captcha_answer
    if (captcha_image_base64) updateData.captcha_image_base64 = captcha_image_base64

    const { error } = await supabaseAdmin
      .from("jobs")
      .update(updateData)
      .eq("id", job_id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("JOB STATUS UPDATE ERROR:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
