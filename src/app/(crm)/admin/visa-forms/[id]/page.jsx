"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import RecursiveEditor from "@/components/RecursiveEditor"
import { ds160Schema } from "@/forms/ds160.schema"
import CaptchaModal from "../modal/CaptchaModal"
import ReadOnlyViewer from "@/components/ReadOnlyViewer"
import BarcodeSelectModal from "../modal/BarcodeSelectModal"
export default function VisaFormDetailPage() {
const {id} =useParams()

  const [form, setForm] = useState(null)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const[jobs, setJobs] = useState(null)
const [showCaptcha, setShowCaptcha] = useState(false)
const [captchaLoading, setCaptchaLoading] = useState(false)
const [value, setValue] = useState("")
const [captchaKey, setCaptchaKey] = useState(0)
const [isRefreshingCaptcha, setIsRefreshingCaptcha] = useState(false)
const [isSubmittingCaptcha, setIsSubmittingCaptcha] = useState(false)
const [isBotStarting, setIsBotStarting] = useState(false)
const [showSuccess, setShowSuccess] = useState(false)
const [showMergeModal, setShowMergeModal] = useState(false)
const [adminForms, setAdminForms] = useState([])
const [selectedAdminForm, setSelectedAdminForm] = useState(null)
const [mergeLoading, setMergeLoading] = useState(false)
const [showBarcodeModal, setShowBarcodeModal] = useState(false)
const [barcodeForms, setBarcodeForms] = useState([])
const mode = form?.source // customer | admin | merged

const isCustomer = mode === "customer"
const isAdmin = mode === "admin"
const isMerged = mode === "merged"


  useEffect(() => {
  const load = async () => {
    const { data: row } = await supabase
      .from("visa_forms")
      .select("*")
      .eq("id", id)
      .single()

    if (row) {
      setForm(row)
      // Eğer __raw varsa onu kullan, yoksa direkt data'yı kullan
      const finalData = row.data?.__raw || row.data || {}
      setData(finalData)
    }
    setLoading(false)
  }
  load()
}, [id])

useEffect(() => {
  if (!id) return

  let cancelled = false

  const load = async () => {
    const { data: item } = await supabase
      .from("jobs")
      .select("*")
      .eq("visa_form_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!cancelled && item) {
      setJobs({ ...item }) // 🔥 kritik
    }
  }

  load()

  const interval = setInterval(load, 2000)

  return () => {
    cancelled = true
    clearInterval(interval)
  }
}, [id])


  const save = async () => {
    setSaving(true)

    await supabase
      .from("visa_forms")
      .update({ data })
      .eq("id", id)

    setSaving(false)
  
  }

 

const submitCaptcha = async (value) => {
  if (!jobs?.id || isSubmittingCaptcha) return

  setIsSubmittingCaptcha(true)

  await fetch("/api/internal/job/captcha/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      job_id: jobs?.id,
      answer: value,
    }),
  })

  setIsSubmittingCaptcha(false)
   setIsBotStarting(true)
}


const refreshCaptcha = async () => {
  if (!jobs?.id || isRefreshingCaptcha) return

  setIsRefreshingCaptcha(true)

  await fetch("/api/internal/job/captcha/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_id: jobs?.id }),
  })
  // 🔥 burada false YOK
}



async function updateStatus(status) {
  await fetch("/api/internal/visa-form/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visa_form_id: form?.id, // 🔥 BU ÖNEMLİ
      status,
    }),
  })

  alert("Durum güncellendi")
}
const startBot = async () => {
  setIsBotStarting(true)

  const res = await fetch("/api/internal/job/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visa_form_id: form?.id,
      type: form?.visa_type,
    }),
  })

  if (res.ok) {
    // Bot başladı ama captcha gelene kadar overlay açık kalacak
  } else {
    setIsBotStarting(false)
   
  }
}
const mergeForms = async () => {
  if (!form?.id) {
   
    return
  }

  if (!selectedAdminForm?.id) {
  
    return
  }

  setMergeLoading(true)

  const { data: adminForm } = await supabase
    .from("visa_forms")
    .select("*")
    .eq("id", selectedAdminForm?.id)
    .single()

  if (!adminForm) {
   
    setMergeLoading(false)
    return
  }

  const mergedData = {
    ...adminForm.data,
    ...form.data,
  }

  await supabase
    .from("visa_forms")
    .update({
      data: mergedData,
      status: "draft",
    })
    .eq("id", adminForm?.id)

  await supabase
    .from("visa_forms")
    .delete()
    .eq("id", form?.id)

  setMergeLoading(false)
  setShowMergeModal(false)

  window.location.href = `/admin/visa-forms/${adminForm?.id}`
}

const mergeWithSelectedBarcode = async (barcodeForm) => {
  if (!form?.id || !barcodeForm?.id) return

  const res = await fetch("/api/internal/visa-form/merge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source_form_id: form.id,          // müşteri formu
      target_form_id: barcodeForm.id,   // seçilen barcode
    }),
  })

  if (!res.ok) {
    alert("Birleştirme başarısız")
    return
  }

  const json = await res.json()

  // barcode’lu forma git
  window.location.href = `/admin/visa-forms/${json.merged_into}`
}

const openMergeModal = async () => {
  if (!form?.customer_id) return

  const { data } = await supabase
    .from("visa_forms")
    .select("id, barcode, updated_at")
    .eq("customer_id", form?.customer_id)
    .eq("visa_type", form?.visa_type)
    .not("barcode", "is", null)   // 🔥 barcode şart
    .neq("id", form?.id)
           

  if (!data || data?.length === 0) {

    return
  }

  setBarcodeForms(data)
  setShowBarcodeModal(true)
}
const handleMerge = async (targetFormId) => {
  if (!targetFormId) return

  const { error } = await supabase
    .from("visa_forms")
    .update({
      status: "merge",
      merged_into: form.id, // kime merge edildiği bilgisi
    })
    .eq("id", targetFormId)

  if (error) {
    console.error("Merge update error:", error)
    return
  }

  setShowBarcodeModal(false)
}

useEffect(() => {
  if (jobs?.captcha_image_base64) {
    setValue("")   // kullanıcı inputu
  }
}, [jobs?.captcha_image_base64])

useEffect(() => {
  if (jobs?.captcha_image_base64 && isRefreshingCaptcha) {
    setIsRefreshingCaptcha(false)
    setCaptchaKey(prev => prev + 1)
  }
}, [jobs?.captcha_image_base64])

useEffect(() => {
  if (jobs?.captcha_image_base64) {
    setIsBotStarting(false)
  }
}, [jobs?.captcha_image_base64])



useEffect(() => {
  if (!jobs) return

  if (jobs.status == "captcha_verified") {
    setIsBotStarting(false)
    setShowSuccess(true)
  }
}, [jobs?.status])
useEffect(() => {
  if (!showMergeModal || !form?.customer_id) return

  const loadAdminForms = async () => {
    const { data } = await supabase
      .from("visa_forms")
      .select("id, barcode")
      .eq("customer_id", form.customer_id)
      .eq("visa_type", form.visa_type)
      .eq("source", "admin")
      .is("merged_into", null)
      .not("barcode", "is", null)

    setAdminForms(data || [])
  }

  loadAdminForms()
}, [showMergeModal, form])

if (loading || !form) {
  return <p>Yükleniyor...</p>
}
  const baseBtn ="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"

  return (
    <div style={{ maxWidth: 1200 }}>


{isBotStarting && !showSuccess && (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-4 bg-white/90 px-8 py-6 rounded-xl shadow-lg">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm font-semibold text-gray-700">
        Bot başlatılıyor, lütfen bekleyiniz...
      </p>
    </div>
  </div>
)}
{showSuccess && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-5 bg-white px-8 py-6 rounded-xl shadow-xl min-w-[320px]">
      
      <div className="text-4xl">✅</div>

      <p className="text-center font-semibold text-gray-800">
        Bot başarıyla başlatıldı
      </p>

      <button
        onClick={() => setShowSuccess(false)}
        className="px-6 py-2 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
      >
        Tamam
      </button>
    </div>
  </div>
)}
{!isCustomer && (
  <div className="w-full flex flex-col items-start justify-start">
    <h2 className="font-bold underline mb-1">
      DS-160 KODU:
    </h2>
    <h2 className="text-base">
      {form?.barcode || "-"}
    </h2>
  </div>
)}
{form?.source === "customer" && (
<button
  onClick={()=>{openMergeModal();handleMerge()}}
  className={`${baseBtn} bg-indigo-600 text-white hover:bg-indigo-700`}
>
  🔗 Formu Birleştir
</button>

)}

<div className="w-full flex items-center justify-center">
   <h2 className="font-bold underline mb-1">{form.visa_type.toUpperCase()} Formu</h2>
</div>

{!isCustomer ? (
  <RecursiveEditor
    data={data}
    onChange={setData}
    schema={ds160Schema}
  />
) : (
  <ReadOnlyViewer data={data} schema={ds160Schema} />
)}
{["waiting_captcha", "captcha_refresh"].includes(jobs?.status) &&
  jobs?.captcha_image_base64 && (
    <CaptchaModal
      job={jobs}
      onRefresh={refreshCaptcha}
      onSubmit={submitCaptcha}
      isRefreshing={isRefreshingCaptcha}
      isSubmitting={isSubmittingCaptcha}
      value={value}
      setValue={setValue}
      captchaKey={captchaKey}
    />
)}



{!isCustomer && (
  <div className="flex gap-2 mt-4">
  <button
  onClick={save}
  disabled={saving}
  className={`${baseBtn} bg-blue-600 text-white hover:bg-blue-700`}
>
  {saving ? "Kaydediliyor..." : "Kaydet"}
</button>

  {(form?.status === "new" || form?.status == "merge" || form?.status == "entered_form")  && (
    <button
      onClick={startBot}
      className={`${baseBtn} bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2`}
    >
      ▶️ Botu Başlat
    </button>
  )}

  {/* ⏸ / ⛔ RUNNING */}
  {form?.status === "running" && (
    <>
      <button
        onClick={() => updateStatus("paused")}
        className={`${baseBtn} bg-yellow-500 text-black hover:bg-yellow-600 flex items-center gap-2`}
      >
        ⏸ Duraklat
      </button>

      <button
        onClick={() => updateStatus("stopped")}
        className={`${baseBtn} bg-red-600 text-white hover:bg-red-700 flex items-center gap-2`}
      >
        ⛔ Durdur
      </button>
    </>
  )}

  {/* ▶️ / ⛔ PAUSED */}
  {form?.status === "paused" && (
    <>
      <button
        onClick={() => updateStatus("running")}
        className={`${baseBtn} bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2`}
      >
        ▶️ Devam Et
      </button>

      <button
        onClick={() => updateStatus("stopped")}
        className={`${baseBtn} bg-red-600 text-white hover:bg-red-700 flex items-center gap-2`}
      >
        ⛔ Durdur
      </button>
    </>
  )}
</div>
)}

{showBarcodeModal && (
  <BarcodeSelectModal
    forms={barcodeForms}
    onSelect={(f) => {
      setShowBarcodeModal(false)
      mergeWithSelectedBarcode(f)
    }}
    onClose={() => setShowBarcodeModal(false)}
  />
)}

    </div>
  )
}
