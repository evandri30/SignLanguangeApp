import type { QuizHistoryItem, QuizQuestion } from "@/types/quiz";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchQuizHistory(): Promise<QuizHistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/quiz/history`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Gagal mengambil riwayat kuis.");
  }
  return response.json();
}

export async function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  const response = await fetch(`${API_BASE_URL}/api/quiz/questions`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Gagal mengambil soal kuis dari server.");
  }
  return response.json();
}

export interface SubmitQuizPayload {
  score: number;
  correct_answers: number;
  total_questions: number;
}

export async function submitQuizScore(payload: SubmitQuizPayload): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Gagal menyimpan skor kuis.");
  }
  return response.ok;
}
