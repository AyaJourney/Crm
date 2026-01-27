import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req) {
  try {
    const { source_form_id, target_form_id } = await req.json()

    if (!source_form_id || !target_form_id) {
      return NextResponse.json(
        { error: "Missing form ids" },
        { status: 400 }
      )
    }

    // 1️⃣ Formları çek
    const { data: forms, error: fetchError } = await supabaseAdmin
      .from("visa_forms")
      .select("id, data")
      .in("id", [source_form_id, target_form_id])

    if (fetchError || !forms?.length) {
      return NextResponse.json(
        { error: "Forms not found" },
        { status: 404 }
      )
    }

    const sourceForm = forms.find(f => f.id === source_form_id)
    const targetForm = forms.find(f => f.id === target_form_id)

    if (!sourceForm || !targetForm) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      )
    }

    // 2️⃣ DATA MERGE (müşteri overwrite eder)
    const mergedData = {
      ...targetForm.data,
      ...sourceForm.data,
    }

    // 3️⃣ BARCODE’LU FORM (ANA FORM)
    const { error: targetUpdateError } = await supabaseAdmin
      .from("visa_forms")
      .update({
        data: mergedData,
        status: "merge",
        merged_from: source_form_id,
      })
      .eq("id", target_form_id)

    if (targetUpdateError) {
      console.error("Target update error:", targetUpdateError)
      return NextResponse.json(
        { error: "Target update failed" },
        { status: 500 }
      )
    }

    // 4️⃣ MÜŞTERİ FORMU (ARKADA TUT)
    const { error: sourceUpdateError } = await supabaseAdmin
      .from("visa_forms")
      .update({
        status: "merged",
        merged_into: target_form_id,
      })
      .eq("id", source_form_id)

    if (sourceUpdateError) {
      console.warn("Source update warning:", sourceUpdateError)
    }

    return NextResponse.json({
      success: true,
      merged_into: target_form_id,
    })
  } catch (err) {
    console.error("MERGE ERROR:", err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
