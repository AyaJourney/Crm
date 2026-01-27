import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const job_id = searchParams.get("job_id")

    if (!job_id) {
      return NextResponse.json(
        { error: "job_id zorunlu" },
        { status: 400 }
      )
    }

    const { data: job, error } = await supabaseAdmin
      .from("jobs")
      .select(`
        id,
        status,
        captcha_answer,
        captcha_image_base64,
        visa_form_id
      `)
      .eq("id", job_id)
      .maybeSingle()

    if (error || !job) {
      return NextResponse.json(
        { error: "Job bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json(job)

  } catch (err) {
    console.error("JOB STATE ERROR:", err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
