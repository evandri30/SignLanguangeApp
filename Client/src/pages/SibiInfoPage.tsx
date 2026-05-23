import { useState, useCallback, useEffect } from "react";
import { SibiAlphabetPicker } from "@/components/SibiAlphabetPicker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SibiInfoHeader } from "@/components/SibiInfoHeader"
import { Footer } from "@/components/Footer"; 

interface SibiLetterData {
  id: number;
  letter: string;
  name: string;
  description: string;
  gesture_steps: string[];
}
 
const API_BASE_URL = import.meta.env.VITE_API_URL;
 
export function SibiInfoPage() {
  const [letters, setLetters] = useState<SibiLetterData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    async function fetchSibiLetters() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/sibi/`);
        if (!response.ok) throw new Error("Gagal mengambil data SIBI dari server.");
        const data = await response.json();
        setLetters(data);
      } catch (err) {
        console.error("[SibiInfoPage]", err);
        setError("Koneksi gagal. Pastikan server sudah aktif.");
      } finally {
        setLoading(false);
      }
    }
    fetchSibiLetters();
  }, []);
 
  const selectedLetter = letters[selectedIndex] ?? null;
 
  const goNext = useCallback(() => {
    if (letters.length === 0) return;
    setSelectedIndex((i) => (i + 1) % letters.length);
  }, [letters.length]);
 
  const goPrev = useCallback(() => {
    if (letters.length === 0) return;
    setSelectedIndex((i) => (i - 1 + letters.length) % letters.length);
  }, [letters.length]);
 
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);
 
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <SibiInfoHeader />
 
      {loading && (
        <div className="flex items-center justify-center py-36 gap-3">
          <div className="h-4 w-4 border-2 border-neutral-200 border-t-neutral-700 rounded-full animate-spin" />
          <span className="text-sm text-neutral-400">Memuat data abjad...</span>
        </div>
      )}
 
      {error && (
        <div className="flex flex-col items-center justify-center py-28 text-center gap-4 px-6">
          <div className="text-2xl select-none">⚠️</div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">Server belum tersedia</p>
            <p className="text-xs text-neutral-400 mt-1.5 max-w-xs leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 transition-colors"
          >
            Coba lagi
          </button>
        </div>
      )}
 
      {!loading && !error && letters.length > 0 && (
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-14">
            <div className="w-full lg:w-56 lg:shrink-0">
              <div className="lg:sticky lg:top-20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
                  Pilih Huruf
                </p>
                <SibiAlphabetPicker
                  letters={letters}
                  selectedLetter={selectedLetter}
                  onSelect={(item) => {
                    const idx = letters.findIndex((l) => l.id === item.id);
                    if (idx !== -1) setSelectedIndex(idx);
                  }}
                />
                <p className="mt-5 text-[10px] text-neutral-300 font-medium leading-relaxed">
                  Gunakan tombol ← → untuk navigasi antar huruf
                </p>
              </div>
            </div>
 
            {selectedLetter && (
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedLetter.letter}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <div className="flex items-start justify-between mb-8 gap-4">
                      <div className="flex items-baseline gap-5 min-w-0">
                        <span className="text-8xl font-extrabold text-neutral-900 leading-none tracking-tighter shrink-0">
                          {selectedLetter.letter.toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xl font-bold text-neutral-700 leading-snug">
                            {selectedLetter.name}
                          </p>
                          <p className="text-xs text-neutral-400 font-medium mt-0.5 tabular-nums">
                            {String(selectedIndex + 1).padStart(2, "0")} / {String(letters.length).padStart(2, "0")}
                          </p>
                        </div>
                      </div>
 
                      <div className="flex items-center gap-1.5 shrink-0 mt-1">
                        <button
                          onClick={goPrev}
                          aria-label="Huruf sebelumnya"
                          className="h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-neutral-900 transition-all"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={goNext}
                          aria-label="Huruf berikutnya"
                          className="h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-neutral-900 transition-all"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
 
                    <div className="border-t border-neutral-100 mb-8" />
 
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
                      <div className="md:col-span-1 bg-neutral-50 rounded-2xl border border-neutral-100 p-6 flex flex-col items-center justify-center aspect-square shadow-sm overflow-hidden group">
                        <img
                          src={`/images/sibi/${selectedLetter.letter.toLowerCase()}.jpg`}
                          alt={`Isyarat tangan untuk ${selectedLetter.name}`}
                          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              const fallbackText = parent.querySelector('.fallback-text');
                              if (fallbackText) (fallbackText as HTMLElement).style.display = 'block';
                            }
                          }}
                        />
                        <div className="fallback-text hidden text-center">
                          <span className="text-3xl block mb-2 opacity-40">🔤</span>
                          <span className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                            Gambar {selectedLetter.letter.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-8">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
                            Deskripsi Gerakan
                          </p>
                          <p className="text-sm text-neutral-600 leading-relaxed">
                            {selectedLetter.description}
                          </p>
                        </div>

                        {selectedLetter.gesture_steps?.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
                              Langkah Pembentukan
                            </p>
                            <ol className="flex flex-col gap-3.5">
                              {selectedLetter.gesture_steps.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-neutral-600">
                                  <span className="text-[10px] font-bold text-neutral-300 mt-0.5 shrink-0 tabular-nums w-4">
                                    {String(idx + 1).padStart(2, "0")}
                                  </span>
                                  <span className="leading-relaxed">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}