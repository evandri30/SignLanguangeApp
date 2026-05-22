import { useEffect, useState, useCallback } from "react";
import { SibiAlphabetPicker } from "@/components/SibiAlphabetPicker";
import { ChevronLeft, ChevronRight, Info, BookOpen, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SibiLetterData {
  id: number;
  letter: string;
  name: string;
  description: string;
  gesture_steps: string[];
  image_url: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

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

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">

      {/* ── PAGE HEADER ── */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-xs font-medium text-neutral-400 mb-2 flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5" />
            Panduan Belajar Mandiri
          </p>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Informasi Abjad SIBI
          </h1>
          <p className="mt-2 text-sm text-neutral-500 max-w-xl leading-relaxed">
            Panduan visual abjad A–Z Sistem Isyarat Bahasa Indonesia.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10 flex flex-col gap-12">

        {/* ── LOADING ── */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3">
            <div className="h-5 w-5 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
            <span className="text-sm text-neutral-400">Memuat data abjad...</span>
          </div>
        )}

        {/* ── ERROR ── */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4 max-w-sm mx-auto">
            <div className="text-2xl">⚠️</div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Server belum tersedia</p>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-700 transition-colors"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        {!loading && !error && letters.length > 0 && (
          <>
            {/* Alphabet Picker */}
            <div className="flex flex-col gap-4">
              <SibiAlphabetPicker
                letters={letters}
                selectedLetter={selectedLetter}
                onSelect={(item) => {
                  const idx = letters.findIndex((l) => l.id === item.id);
                  if (idx !== -1) setSelectedIndex(idx);
                }}
              />
            </div>

            {/* ── CENTERED SHOWCASE ── */}
            {selectedLetter && (
              <div className="flex flex-col gap-8">

                {/* Navigation + Big Letter */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={goPrev}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-neutral-500 hover:text-neutral-900 border border-neutral-200 rounded-md hover:border-neutral-400 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {letters[(selectedIndex - 1 + letters.length) % letters.length]?.letter.toUpperCase()}
                    </span>
                  </button>

                  {/* Center: Big letter display with smooth fade & transition */}
                  <div className="flex flex-col items-center gap-3 min-w-35">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedLetter.letter}
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="flex items-center justify-center h-32 w-32 rounded-2xl border border-neutral-200 bg-neutral-50 shadow-xs">
                          <span className="text-7xl font-semibold text-neutral-900 select-none">
                            {selectedLetter.letter.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-base font-semibold text-neutral-900">{selectedLetter.name}</p>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {selectedIndex + 1} / {letters.length}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={goNext}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-neutral-500 hover:text-neutral-900 border border-neutral-200 rounded-md hover:border-neutral-400 transition-all cursor-pointer"
                  >
                    <span className="hidden sm:inline">
                      {letters[(selectedIndex + 1) % letters.length]?.letter.toUpperCase()}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-100" />

                {/* Detail content: description + steps with smooth crossfade */}
                <div className="relative min-h-35">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedLetter.letter}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18, ease: "easeInOut" }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-8"
                    >
                      {/* Description */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                          <Info className="h-3.5 w-3.5" />
                          Deskripsi Gerakan
                        </div>
                        <p className="text-sm text-neutral-700 leading-relaxed">
                          {selectedLetter.description}
                        </p>
                      </div>

                      {/* Steps */}
                      {selectedLetter.gesture_steps?.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                            <BookOpen className="h-3.5 w-3.5" />
                            Langkah Pembentukan
                          </div>
                          <ol className="flex flex-col gap-2.5">
                            {selectedLetter.gesture_steps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-sm text-neutral-700">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white text-[10px] font-semibold mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
