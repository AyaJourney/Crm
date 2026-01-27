import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req) {
  try {
    const { job_id, barcode } = await req.json()

    if (!job_id || !barcode) {
      return NextResponse.json(
        { error: "job_id and barcode required" },
        { status: 400 }
      )
    }

    // 1️⃣ Job güncelle (barcode + status)
    const { data: job, error: jobError } = await supabaseAdmin
      .from("jobs")
      .update({
        barcode,
        status: "entered_form",
        updated_at: new Date().toISOString(),
      })
      .eq("id", job_id)
      .select("visa_form_id")
      .single()

    if (jobError || !job) {
      throw jobError || new Error("Job not found")
    }

    // 2️⃣ Visa form güncelle (AYNI BARCODE + STATUS)
    const { error: formError } = await supabaseAdmin
      .from("visa_forms")
      .update({
        barcode,
        status: "entered_form",
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.visa_form_id)

    if (formError) throw formError
    
    return NextResponse.json({
      success: true,
      visa_form_id: job.visa_form_id,
      barcode,
    })
  } catch (err) {
    console.error("JOB BARCODE ERROR:", err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
