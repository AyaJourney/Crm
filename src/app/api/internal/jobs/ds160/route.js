import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { normalizeFormData } from "@/utils/form-normalizers"

export async function POST(req) {
  try {
    const { visa_form_id } = await req.json()

    if (!visa_form_id) {
      return NextResponse.json(
        { error: "visa_form_id required" },
        { status: 400 }
      )
    }

    // 1️⃣ formu çek
    const { data: form, error: formError } = await supabaseAdmin
      .from("visa_forms")
      .select("id, visa_type, data")
      .eq("id", visa_form_id)
      .single()

    if (formError || !form) {
      return NextResponse.json(
        { error: "Visa form not found" },
        { status: 404 }
      )
    }

    if (form.visa_type !== "ds-160") {
      return NextResponse.json(
        { error: "Not a DS-160 form" },
        { status: 400 }
      )
    }

    // 2️⃣ normalize et (SELENIUM'UN KULLANACAĞI FORMAT)
    const normalized = normalizeFormData("ds-160", form.data)

    // 3️⃣ job oluştur
    const { data: job, error: jobError } = await supabaseAdmin
      .from("jobs")
      .insert({
        visa_form_id: form.id,
        type: "ds160",
        status: "queued",
        payload: normalized,
      })
      .select()
      .single()

    if (jobError) {
      throw jobError
    }

    return NextResponse.json({
      success: true,
      job_id: job.id,
      status: job.status,
    })
  } catch (err) {
    console.error("JOB CREATE ERROR:", err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
