import { useState, useEffect } from "react";
import type { QuizHistoryItem, QuizQuestion } from "@/types/quiz";
import {
  fetchQuizHistory,
  fetchQuizQuestions,
  submitQuizScore,
  API_BASE_URL,
} from "@/services/quizService";

export function useQuiz() {
  const [gameState, setGameState] = useState<"lobby" | "playing" | "finished">("lobby");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await fetchQuizHistory();
      setHistory(data);
    } catch (err) {
      console.error("Gagal mengambil riwayat kuis", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadDataOnMount() {
      await Promise.resolve();
      if (!isMounted) return;

      try {
        setLoadingHistory(true);
        const data = await fetchQuizHistory();
        if (isMounted) {
          setHistory(data);
        }
      } catch (err) {
        console.error("Gagal mengambil riwayat kuis", err);
      } finally {
        if (isMounted) {
          setLoadingHistory(false);
        }
      }
    }

    loadDataOnMount();

    return () => {
      isMounted = false;
    };
  }, []);

  const startQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedAns(null);
      setCorrectCount(0);
      setCurrentIdx(0);

      const data = await fetchQuizQuestions();
      setQuestions(data);
      setGameState("playing");
    } catch (err) {
      console.error(err);
      setError("Gagal memuat kuis. Pastikan server FastAPI Anda aktif.");
    } finally {
      setLoading(false);
    }
  };

  const finishQuiz = async (finalCorrectCount: number) => {
    setGameState("finished");
    const finalScore = Math.round((finalCorrectCount / questions.length) * 100);

    try {
      const success = await submitQuizScore({
        score: finalScore,
        correct_answers: finalCorrectCount,
        total_questions: questions.length,
      });

      if (success) {
        fetchHistory();
      }
    } catch (err) {
      console.error("Gagal menyimpan skor kuis", err);
    }
  };

  const handleAnswerSelect = (option: string) => {
    if (selectedAns !== null) return;
    setSelectedAns(option);

    const isCorrect =
      option.toUpperCase() === questions[currentIdx].correct_answer.toUpperCase();
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((idx) => idx + 1);
        setSelectedAns(null);
      } else {
        finishQuiz(isCorrect ? correctCount + 1 : correctCount);
      }
    }, 1500);
  };

  return {
    gameState,
    questions,
    currentIdx,
    selectedAns,
    correctCount,
    loading,
    error,
    history,
    loadingHistory,
    startQuiz,
    handleAnswerSelect,
    API_BASE_URL,
  };
}
