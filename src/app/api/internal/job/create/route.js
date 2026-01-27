import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req) {
  try {
    const { visa_form_id, type } = await req.json()

    if (!visa_form_id || !type) {
      return NextResponse.json(
        { error: "visa_form_id ve type zorunlu" },
        { status: 400 }
      )
    }

    // 1️⃣ Formu çek (barcode DAHİL)
    const { data: form, error: formErr } = await supabaseAdmin
      .from("visa_forms")
      .select("id, data, barcode, status")
      .eq("id", visa_form_id)
      .single()

    if (formErr) throw formErr
    if (!form) {
      return NextResponse.json({ error: "Form bulunamadı" }, { status: 404 })
    }

    // 2️⃣ PAYLOAD OLUŞTUR (EN ÖNEMLİ KISIM)
    const payload = {
      ...(form.data || {}),
    }

    // 🔥 BARCODE ayrı kolondaysa payload’a ekle
    if (form.barcode) {
      payload.BARCODE = form.barcode
    }

    console.log("JOB PAYLOAD FINAL:", payload)

    // 3️⃣ Job oluştur
    const { data: job, error: jobErr } = await supabaseAdmin
      .from("jobs")
      .insert({
        visa_form_id: form.id,
        type,
        status: "queued",
        payload,
      })
      .select("id")
      .single()

    if (jobErr) throw jobErr

    // 4️⃣ Form status update
    await supabaseAdmin
      .from("visa_forms")
      .update({
        status: "queued",
        updated_at: new Date().toISOString(),
      })
      .eq("id", visa_form_id)

    return NextResponse.json({
      success: true,
      job_id: job.id,
      has_barcode: Boolean(payload.BARCODE),
    })
  } catch (err) {
    console.error("JOB CREATE ERROR:", err)
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    )
  }
}
