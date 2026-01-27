import { supabaseAdmin } from "@/lib/supabaseAdmin"

/* =========================
   BASE64 TESPİT
   ========================= */
function detectBase64File(value) {
  if (typeof value !== "string") return null
  if (value.length < 50) return null

  if (value.startsWith("data:")) {
    if (value.includes("image/jpeg")) return "jpg"
    if (value.includes("image/png")) return "png"
    if (value.includes("application/pdf")) return "pdf"
  }

  if (value.startsWith("/9j/")) return "jpg"
  if (value.startsWith("iVBORw0KGgo")) return "png"
  if (value.startsWith("JVBERi0")) return "pdf"
  if (value.startsWith("UklGR")) return "webp"

  return null
}

/* =========================
   RECURSIVE CLEAN
   ========================= */
export async function cleanObjectRecursive(obj, folder = "public") {
  if (Array.isArray(obj)) {
    const arr = []
    for (const item of obj) {
      arr.push(await cleanObjectRecursive(item, folder))
    }
    return arr
  }

  if (typeof obj === "object" && obj !== null) {
    const cleaned = {}

    for (const key of Object.keys(obj)) {
      const value = obj[key]
      const ext = detectBase64File(value)

      // 📎 BASE64 DOSYA
      if (ext) {
        const base64 = value.startsWith("data:")
          ? value.split(",")[1]
          : value

        const buffer = Buffer.from(base64, "base64")
        const filePath = `${folder}/${key}_${Date.now()}.${ext}`

        const { error } = await supabaseAdmin.storage
          .from("customer-files")
          .upload(filePath, buffer, {
            contentType:
              ext === "pdf"
                ? "application/pdf"
                : `image/${ext}`,
            upsert: true,
          })

        if (!error) {
          const { data } = supabaseAdmin.storage
            .from("customer-files")
            .getPublicUrl(filePath)

          cleaned[key] = data.publicUrl
        }

        continue
      }

      // 🔁 NORMAL FIELD
      cleaned[key] = await cleanObjectRecursive(value, folder)
    }

    return cleaned
  }

  return obj
}
