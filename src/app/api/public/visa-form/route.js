import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

import { cleanObjectRecursive } from "@/utils/cleanObjectRecursive"
import { normalizeFormData } from "@/utils/form-normalizers"
import { extractCustomerName } from "@/utils/extractCustomerName"
import { normalizeUkFormData } from "@/utils/normalizeUkFormData"

/* =========================
   🔧 İSİM NORMALIZE HELPER
   ========================= */
function normalizeName(name) {
  if (!name) return null

  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // aksan sil
    .replace(/\s+/g, " ")
    .trim()
}

export async function POST(req) {
  try {
    /* =========================
       1️⃣ WEB'DEN GELEN HAM DATA
       ========================= */
    const body = await req.json()

    const visa_type =
      body.visa_type ||
      body.type ||
      "unknown"

    const rawFormData =
      body.form_data ||
      body.data ||
      body

   let email = null
let phone = null

if (visa_type === "uk") {
  email =
    rawFormData?.steps?.[1]?.email ?? null

  phone =
    rawFormData?.steps?.[1]?.phone_number ??
    null
} else {
  // ds-160 veya diğer formlar
  email = body.email ?? null
  phone = body.phone ?? null
}
    /* =========================
       2️⃣ BASE64 → STORAGE
       ========================= */
    const cleanedFormData = await cleanObjectRecursive(
      rawFormData,
      "temp"
    )

    /* =========================
       3️⃣ FORM NORMALIZE
       ========================= */
  let normalizedFormData = null

if (visa_type === "ds-160") {
  normalizedFormData = normalizeFormData(
    visa_type,
    cleanedFormData
  )
} else if (visa_type === "uk") {
  normalizedFormData = normalizeUkFormData(
    cleanedFormData
  )
} else {
  normalizedFormData = cleanedFormData
}

    /* =========================
       4️⃣ CUSTOMER NAME ÇIKAR 
       (GIVEN_NAME / SURNAME)
       ========================= */
   let customerName = "Web Form"

if (visa_type === "ds-160") {
  customerName = extractCustomerName(normalizedFormData)
} else if (visa_type === "uk") {
  customerName =
    normalizedFormData?.fullName ||
    normalizedFormData?.steps?.[1]?.fullName ||
    "Web Form"
}



    /* =========================
       5️⃣ CUSTOMER BUL
       ÖNCELİK:
       1. Email
       2. Phone
       3. Name (normalize)
       ========================= */
    let customerId = null
    let matchedBy = null

    // 5️⃣-1 Email / Phone
    if (email || phone) {
      const { data: existing } = await supabaseAdmin
        .from("customers")
        .select("id,name")
        .or(
          [
            email ? `email.eq.${email}` : null,
            phone ? `phone.eq.${phone}` : null,
          ]
            .filter(Boolean)
            .join(",")
        )
        .maybeSingle()

      if (existing) {
        customerId = existing.id
        matchedBy = "contact"
      }
    }

    // 5️⃣-2 Name match (SADECE BULUNAMADIYSA)
    if (
      !customerId &&
      customerName &&
      customerName !== "Web Form"
    ) {
      const normalizedIncoming = normalizeName(customerName)

      const { data: customers } = await supabaseAdmin
        .from("customers")
        .select("id,name")
        .not("name", "is", null)

      const matched = customers?.find(
        (c) =>
          normalizeName(c.name) === normalizedIncoming
      )

      if (matched) {
        customerId = matched.id
        matchedBy = "name"
      }
    }

    /* =========================
       6️⃣ CUSTOMER OLUŞTUR
       ========================= */
    if (!customerId) {
      const { data: customer } = await supabaseAdmin
        .from("customers")
        .insert({
          name: customerName,
          email,
          phone,
          source: "web_form",
        })
        .select("id")
        .single()

      customerId = customer.id
      matchedBy = "created"
    }

    /* =========================
       7️⃣ CUSTOMER NAME FIX
       (Web Form → Gerçek İsim)
       ========================= */
    if (matchedBy === "contact" && customerName !== "Web Form") {
      await supabaseAdmin
        .from("customers")
        .update({ name: customerName })
        .eq("id", customerId)
        .eq("name", "Web Form")
    }

    /* =========================
       8️⃣ VISA FORM KAYDET
       ========================= */
    await supabaseAdmin
      .from("visa_forms")
      .insert({
        customer_id: customerId,
        visa_type,
        status: "new",
        source: "customer",
        data: normalizedFormData,
      })

    return NextResponse.json({
      success: true,
      matched_by: matchedBy,
    })
  } catch (err) {
    console.error("CRM POST ERROR:", err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
