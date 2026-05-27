import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Footer } from "@/components/Footer";
import { QuizLobby } from "@/components/Quiz/QuizLobby";
import { QuizActive } from "@/components/Quiz/QuizActive";
import { QuizFinished } from "@/components/Quiz/QuizFinished";
import type { QuizHistoryItem, QuizQuestion } from "@/types/quiz";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function QuizPage() {
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
      const response = await fetch(`${API_BASE_URL}/api/quiz/history`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
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
        const response = await fetch(`${API_BASE_URL}/api/quiz/history`, {
          credentials: "include",
        });
        if (response.ok && isMounted) {
          const data = await response.json();
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

      const response = await fetch(`${API_BASE_URL}/api/quiz/questions`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil soal kuis dari server.");
      }

      const data = await response.json();
      setQuestions(data);
      setGameState("playing");
    } catch (err) {
      console.error(err);
      setError("Gagal memuat kuis. Pastikan server FastAPI Anda aktif.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (option: string) => {
    if (selectedAns !== null) return; 
    setSelectedAns(option);

    const isCorrect = option.toUpperCase() === questions[currentIdx].correct_answer.toUpperCase();
    if (isCorrect) {
      setCorrectCount(c => c + 1);
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(idx => idx + 1);
        setSelectedAns(null);
      } else {
        finishQuiz(isCorrect ? correctCount + 1 : correctCount);
      }
    }, 1500);
  };

  const finishQuiz = async (finalCorrectCount: number) => {
    setGameState("finished");
    const finalScore = Math.round((finalCorrectCount / questions.length) * 100);

    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score: finalScore,
          correct_answers: finalCorrectCount,
          total_questions: questions.length,
        }),
        credentials: "include",
      });

      if (response.ok) {
        fetchHistory();
      }
    } catch (err) {
      console.error("Gagal menyimpan skor kuis", err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      
      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {gameState === "lobby" && (
            <QuizLobby
              loading={loading}
              error={error}
              startQuiz={startQuiz}
              loadingHistory={loadingHistory}
              history={history}
            />
          )}

          {gameState === "playing" && (
            <QuizActive
              currentIdx={currentIdx}
              questions={questions}
              selectedAns={selectedAns}
              handleAnswerSelect={handleAnswerSelect}
              API_BASE_URL={API_BASE_URL}
            />
          )}

          {gameState === "finished" && (
            <QuizFinished
              correctCount={correctCount}
              totalQuestions={questions.length}
              startQuiz={startQuiz}
            />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
