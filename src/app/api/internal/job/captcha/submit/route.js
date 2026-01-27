export async function POST(req) {
  const { job_id, captcha_text } = await req.json()

  await supabaseAdmin
    .from("jobs")
    .update({
      captcha_text,
      captcha_status: "solved",
    })
    .eq("id", job_id)

  return NextResponse.json({ success: true })
}
