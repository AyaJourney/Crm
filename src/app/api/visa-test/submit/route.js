import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* =========================
   SUPABASE CLIENT (SERVER)
========================= */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    /* =========================
       AUTH – SADECE WEB SİTESİ
    ========================= */
    const secret = req.headers.get("x-web-secret");

    if (secret !== process.env.WEB_TO_CRM_SECRET) {
      return NextResponse.json(
        { ok: false, error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const body = await req.json();

    /* =========================
       VALIDATION
    ========================= */
    const name = (body?.name || "").trim();
    const email = (body?.email || "").trim().toLowerCase();
    const phoneNumber = (body?.phoneNumber || "").trim();
    const score = Number(body?.score);
    const testKey = (body?.testKey || "unknown_test").trim();
    const answers = Array.isArray(body?.answers) ? body.answers : [];

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "EMAIL_REQUIRED" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(score)) {
      return NextResponse.json(
        { ok: false, error: "INVALID_SCORE" },
        { status: 400 }
      );
    }

    if (answers.length === 0) {
      return NextResponse.json(
        { ok: false, error: "ANSWERS_REQUIRED" },
        { status: 400 }
      );
    }

    /* =========================
       NORMALIZE ANSWERS
       (tek deneme garantisi)
    ========================= */
    const answersMap = new Map();

    for (const a of answers) {
      if (!a?.step) continue;

      answersMap.set(a.step, {
        step: a.step,
        question: a.question || "",
        answer: a.answer || "",
        points: Number(a.points) || 0,
      });
    }

    const normalizedAnswers = Array.from(answersMap.values());

    /* =========================
       META
    ========================= */
    const userAgent = req.headers.get("user-agent") || null;
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;

    /* =========================
       INSERT → SUPABASE
    ========================= */
    const { data, error } = await supabase
      .from("visa_test_submissions")
      .insert([
        {
          test_key: testKey,
          name,
          email,
          phone_number: phoneNumber || null,
          score,
          answers: normalizedAnswers,
          source: "web", // önemli (CRM vs WEB ayrımı)
          user_agent: userAgent,
          ip,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("SUPABASE INSERT ERROR:", error);
      return NextResponse.json(
        { ok: false, error: "DB_INSERT_FAILED" },
        { status: 500 }
      );
    }

    /* =========================
       SUCCESS
    ========================= */
    return NextResponse.json({
      ok: true,
      submissionId: data.id,
    });
  } catch (err) {
    console.error("CRM API ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "BAD_REQUEST" },
      { status: 400 }
    );
  }
}
