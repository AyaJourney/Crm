import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req) {
  try {
    const { job_id, answer } = await req.json()

    if (!job_id || !answer) {
      return NextResponse.json(
        { error: "job_id ve answer zorunlu" },
        { status: 400 }
      )
    }

    await supabaseAdmin
      .from("jobs")
      .update({
        captcha_answer: answer,
        status: "captcha_entered",
        updated_at: new Date().toISOString(),
      })
      .eq("id", job_id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("CAPTCHA ANSWER ERROR:", err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
