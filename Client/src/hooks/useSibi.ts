import { useState, useEffect, useCallback } from "react";
import type { SibiLetterData } from "@/types/sibi";
import { fetchSibiLetters } from "@/services/sibiService";

export function useSibi() {
  const [letters, setLetters] = useState<SibiLetterData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchSibiLetters();
        setLetters(data);
      } catch (err) {
        console.error("[useSibi]", err);
        setError("Koneksi gagal. Pastikan server sudah aktif.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
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

  return {
    letters,
    selectedIndex,
    selectedLetter,
    loading,
    error,
    goNext,
    goPrev,
    setSelectedIndex,
  };
}
