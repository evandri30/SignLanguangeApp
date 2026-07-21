import type { SibiLetterData } from "@/types/sibi";

export const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;

export async function fetchSibiLetters(): Promise<SibiLetterData[]> {
  const response = await fetch(`${API_BASE_URL}/api/sibi/`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data SIBI dari server.");
  }
  return response.json();
}
