// src/app/api/internal/queue/ds160/start/route.js
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET() {
  try {
    // 1️⃣ Queue’dan 1 job al
    const { data: job, error } = await supabaseAdmin
      .from("jobs")
      .select(`
        id,
        visa_form_id,
        payload
      `)
      .eq("type", "ds-160")
      .eq("status", "queued")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle()

    if (error) throw error

    // Queue boş
    if (!job) {
      return new NextResponse(null, { status: 204 })
    }

    // 2️⃣ Job lock → waiting_captcha
    const { error: jobUpdateError } = await supabaseAdmin
      .from("jobs")
      .update({
        status: "waiting_captcha",
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id)
      .eq("status", "queued") // 🔒 race condition koruması

    if (jobUpdateError) {
      // başka bot kapmış olabilir
      return new NextResponse(null, { status: 204 })
    }

    // 3️⃣ Visa form state
    await supabaseAdmin
      .from("visa_forms")
      .update({
        status: "waiting_captcha",
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.visa_form_id)

    // 4️⃣ Bot’a selenium payload
    return NextResponse.json({
      job_id: job.id,
      visa_form_id: job.visa_form_id,
      data: job.payload, // ✅ selenium TEK KAYNAK
    })
  } catch (err) {
    console.error("QUEUE DS160 START ERROR:", err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
