// src/app/api/internal/job/captcha/route.js
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const job_id = searchParams.get("job_id")

    // job_id yoksa bile 200 dön
    if (!job_id) {
      return NextResponse.json(
        { captcha_answer: null, refresh: false },
        { status: 200 }
      )
    }

    const { data: job, error } = await supabaseAdmin
      .from("jobs")
      .select("captcha_answer, captcha_refresh")
      .eq("id", job_id)
      .single()

    if (error || !job) {
      // ❗ 204 YOK
      return NextResponse.json(
        { captcha_answer: null, refresh: false },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        captcha_answer: job.captcha_answer ?? null,
        refresh: job.captcha_refresh ?? false,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error("JOB CAPTCHA POLL ERROR:", err)
    return NextResponse.json(
      { captcha_answer: null, refresh: false },
      { status: 200 }
    )
  }
}
