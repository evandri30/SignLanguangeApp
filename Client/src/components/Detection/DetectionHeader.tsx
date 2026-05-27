export function DetectionHeader() {
    return (
        <div className="border-b border-neutral-100">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
              Real-time
            </p>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Deteksi SIBI
            </h1>
            <p className="mt-2 text-sm text-neutral-500 max-w-md leading-relaxed">
              Arahkan tangan ke kamera dan peragakan abjad. Sistem akan mengenali gerakan secara langsung.
            </p>
          </div>
        </div>
    )
}