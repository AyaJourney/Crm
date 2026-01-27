import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET() {
  try {
    // 1️⃣ Captcha girilmiş job al
    const { data: job } = await supabaseAdmin
      .from("jobs")
      .select(`
        id,
        visa_form_id,
        captcha_answer,
        visa_forms (
          id,
          data,
          visa_type
        )
      `)
      .eq("type", "ds160")
      .eq("status", "captcha_entered")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle()

    if (!job) {
      return new NextResponse(null, { status: 204 })
    }

    // 2️⃣ Job → running
    await supabaseAdmin
      .from("jobs")
      .update({
        status: "running",
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id)

    // 3️⃣ Visa form → running
    await supabaseAdmin
      .from("visa_forms")
      .update({
        status: "running",
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.visa_form_id)

    // 4️⃣ Selenium payload
    return NextResponse.json({
      job_id: job.id,
      visa_form_id: job.visa_form_id,
      captcha_answer: job.captcha_answer,
      data: job.visa_forms.data, // ✅ normalized DS-160 JSON
    })
  } catch (err) {
    console.error("QUEUE DS160 ERROR:", err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
