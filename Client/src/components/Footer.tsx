export function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-extrabold tracking-widest uppercase text-neutral-900">
              SIBI
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">
              Sistem Isyarat Bahasa Indonesia
            </p>
          </div>
 
          <div className="flex flex-col items-start sm:items-end gap-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">
              Dibuat oleh Evandri Ridho Hasmono
            </p>
            <p className="text-[11px] text-neutral-400">
              © {new Date().getFullYear()} SIBI Project
            </p>
          </div>
 
        </div>
      </div>
    </footer>
  );
}