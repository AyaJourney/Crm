"use client"

export default function CaptchaModal({
  job,
  onSubmit,
  onRefresh,
  isRefreshing = false,
  isSubmitting = false,
  value,
  setValue,
  captchaKey,
}) {
  const isDisabled = isRefreshing || isSubmitting

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          CAPTCHA Doğrulama
        </h2>

        {/* CAPTCHA IMAGE */}
        <div className="mb-4 flex justify-center">
          {job?.captcha_image_base64 ? (
            <img
              key={captchaKey}
              src={job.captcha_image_base64}
              alt="CAPTCHA"
              className={`w-56 rounded-xl border ${
                isRefreshing ? "opacity-50" : ""
              }`}
            />
          ) : (
            <div className="text-sm text-gray-500">
              CAPTCHA yükleniyor…
            </div>
          )}
        </div>

        {/* LOADING TEXT (REFRESH) */}
        {isRefreshing && (
          <p className="mb-3 text-center text-sm text-gray-500 animate-pulse">
            Doğrulama kodu yükleniyor…
          </p>
        )}

        {/* INPUT */}
        <input
          value={value}
          disabled={isDisabled}
          onChange={(e) => setValue(e.target.value)}
          placeholder="CAPTCHA'yı girin"
          className="mb-4 w-full rounded-lg border px-3 py-2 text-sm outline-none
                     disabled:bg-gray-100 disabled:cursor-not-allowed
                     focus:border-blue-500"
        />

        {/* BUTTONS */}
        <div className="flex gap-2">
          <button
            disabled={isDisabled || !value}
            onClick={() => {
              onSubmit(value)
              setValue("")
            }}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm
                       font-medium text-white disabled:opacity-50
                       disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Doğrulanıyor…" : "Gönder"}
          </button>

          <button
            disabled={isDisabled}
            onClick={onRefresh}
            className="rounded-lg border px-4 py-2 text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Yenile
          </button>
        </div>
      </div>
    </div>
  )
}
