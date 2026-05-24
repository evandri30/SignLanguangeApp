import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, RotateCcw, BookOpen, Award, Sparkles, CheckCircle2, XCircle, ChevronRight, Loader2, Play } from "lucide-react";
import { Footer } from "@/components/Footer";

interface QuizQuestion {
  id: number;
  question_text: string;
  image_path: string | null;
  options: string[];
  correct_answer: string;
}

interface QuizHistoryItem {
  id: number;
  score: number;
  correct_answers: number;
  total_questions: number;
  created_at: string;
}

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

  const getFeedbackDetails = (score: number) => {
    if (score === 100) {
      return {
        title: "Sempurna!",
        desc: "Luar biasa! Anda menguasai abjad SIBI dengan sempurna tanpa satu pun kesalahan.",
        color: "text-emerald-600 bg-emerald-50",
        icon: <Sparkles className="h-10 w-10 text-emerald-500" />,
      };
    } else if (score >= 80) {
      return {
        title: "Hebat Sekali!",
        desc: "Luar biasa! Pemahaman isyarat SIBI Anda sudah sangat matang.",
        color: "text-blue-600 bg-blue-50",
        icon: <Award className="h-10 w-10 text-blue-500" />,
      };
    } else if (score >= 60) {
      return {
        title: "Bagus!",
        desc: "Kerja bagus! Anda sudah memahami sebagian besar isyarat abjad SIBI.",
        color: "text-yellow-600 bg-yellow-50",
        icon: <Trophy className="h-10 w-10 text-yellow-500" />,
      };
    } else {
      return {
        title: "Jangan Menyerah!",
        desc: "Ayo pelajari kembali abjad SIBI di menu 'Informasi' lalu coba kuis lagi!",
        color: "text-neutral-500 bg-neutral-50",
        icon: <BookOpen className="h-10 w-10 text-neutral-500" />,
      };
    }
  };

  const currentQuestion = questions[currentIdx];
  const progressPercent = questions.length > 0 ? ((currentIdx + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      
      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {gameState === "lobby" && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider">
                  🎯 Uji Pemahaman SIBI
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
                  Kuis Abjad SIBI
                </h1>
                <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
                  Evaluasi pemahaman isyarat SIBI Anda dengan kuis 10 soal acak. 
                  Cari tahu seberapa cepat Anda mengenali bentuk visual gerakan tangan abjad A sampai Z!
                </p>

                {error && (
                  <p className="text-xs text-red-500 bg-red-50 py-2.5 px-4 rounded-lg font-medium">
                    ⚠️ {error}
                  </p>
                )}

                <div className="pt-4 flex justify-center">
                  <button
                    disabled={loading}
                    onClick={startQuiz}
                    className="group relative flex items-center gap-2.5 px-7 py-3.5 bg-neutral-900 text-white font-bold rounded-xl shadow-lg hover:bg-neutral-800 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Mempersiapkan Soal...
                      </>
                    ) : (
                      <>
                        <Play className="h-4.5 w-4.5 fill-current" />
                        Mulai Kuis Sekarang
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto border-t border-neutral-100 pt-8">
                <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-100 space-y-2">
                  <p className="text-xs font-bold uppercase text-neutral-400 tracking-wider">01. Format Soal</p>
                  <p className="text-sm font-bold text-neutral-800">Pilihan Ganda (A-D)</p>
                  <p className="text-xs text-neutral-500">Soal visual gambar isyarat abjad & soal analisis deskripsi gerakan tangan.</p>
                </div>
                <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-100 space-y-2">
                  <p className="text-xs font-bold uppercase text-neutral-400 tracking-wider">02. Sesi Acak</p>
                  <p className="text-sm font-bold text-neutral-800">10 Soal Variatif</p>
                  <p className="text-xs text-neutral-500">Diambil secara acak setiap kali bermain dari bank soal berisi 100+ pertanyaan.</p>
                </div>
                <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-100 space-y-2">
                  <p className="text-xs font-bold uppercase text-neutral-400 tracking-wider">03. Keamanan</p>
                  <p className="text-sm font-bold text-neutral-800">HTTP-Only Cookies</p>
                  <p className="text-xs text-neutral-500">Riwayat skor disimpan aman berdasarkan browser Anda tanpa perlu login akun.</p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto space-y-4 pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                    📊 Riwayat Skor Anda
                  </h2>
                  <span className="text-xs text-neutral-400 tabular-nums font-semibold">
                    {history.length} Attempt{history.length !== 1 && "s"}
                  </span>
                </div>

                {loadingHistory ? (
                  <div className="flex items-center justify-center py-10 gap-2.5 text-sm text-neutral-400">
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-600" />
                    Memuat riwayat skor...
                  </div>
                ) : history.length > 0 ? (
                  <div className="overflow-hidden border border-neutral-200 rounded-xl divide-y divide-neutral-100 max-h-72 overflow-y-auto">
                    {history.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white hover:bg-neutral-50 transition-colors">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-neutral-800">
                            Skor: <span className={item.score >= 80 ? "text-emerald-600" : item.score >= 60 ? "text-yellow-600" : "text-neutral-700"}>{item.score} / 100</span>
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            {item.correct_answers} jawaban benar dari {item.total_questions} soal
                          </p>
                        </div>
                        <span className="text-xs text-neutral-400 font-medium">
                          {new Date(item.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                    <span className="text-2xl block mb-2 opacity-50">🏆</span>
                    <p className="text-xs text-neutral-500 font-semibold">Belum ada riwayat kuis.</p>
                    <p className="text-[10px] text-neutral-400 mt-1">Selesaikan kuis pertama Anda untuk mencatat skor di sini!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {gameState === "playing" && currentQuestion && (
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="max-w-2xl mx-auto space-y-8 w-full"
            >
              <div className="space-y-2.5">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-neutral-400 uppercase tracking-widest">
                    Pertanyaan {currentIdx + 1} dari {questions.length}
                  </span>
                  <span className="font-bold text-neutral-800 tabular-nums">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-neutral-900 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-800 leading-relaxed whitespace-pre-line">
                  {currentQuestion.question_text}
                </h2>

                {currentQuestion.image_path && (
                  <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 flex flex-col items-center justify-center aspect-video max-h-64 shadow-inner overflow-hidden">
                    <img
                      src={`${API_BASE_URL}${currentQuestion.image_path}`}
                      alt="Gerakan Isyarat SIBI"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAns === option;
                  const isCorrect = option.toUpperCase() === currentQuestion.correct_answer.toUpperCase();
                  const isWrongSelected = isSelected && !isCorrect;

                  let btnStyle = "border-neutral-200 hover:border-neutral-800 hover:bg-neutral-50 text-neutral-800";
                  let indicatorIcon = null;

                  if (selectedAns !== null) {
                    if (isCorrect) {
                      btnStyle = "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold scale-[1.01]";
                      indicatorIcon = <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />;
                    } else if (isWrongSelected) {
                      btnStyle = "border-red-600 bg-red-50 text-red-900 font-bold";
                      indicatorIcon = <XCircle className="h-5 w-5 text-red-600 shrink-0" />;
                    } else {
                      btnStyle = "border-neutral-100 bg-white opacity-40 text-neutral-400";
                    }
                  }

                  return (
                    <button
                      key={option}
                      disabled={selectedAns !== null}
                      onClick={() => handleAnswerSelect(option)}
                      className={`flex items-center justify-between p-5 border-2 rounded-xl text-left text-sm font-semibold transition-all duration-150 active:scale-[0.99] ${btnStyle}`}
                    >
                      <span className="leading-snug">Pilihan {option}</span>
                      {indicatorIcon}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {gameState === "finished" && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-lg mx-auto space-y-10 text-center w-full"
            >
              <div className="space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute inset-0 bg-neutral-900 opacity-5 rounded-full scale-105" />
                  <div className="h-40 w-40 rounded-full border-4 border-neutral-950 flex flex-col items-center justify-center p-4 bg-neutral-900 text-white shadow-xl">
                    <span className="text-5xl font-extrabold tracking-tighter">
                      {Math.round((correctCount / questions.length) * 100)}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
                      Skor Akhir
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Hasil Kuis</p>
                  <p className="text-sm font-bold text-neutral-800 mt-1">
                    {correctCount} Jawaban Benar dari {questions.length} Soal
                  </p>
                </div>
              </div>

              {(() => {
                const feedback = getFeedbackDetails(Math.round((correctCount / questions.length) * 100));
                return (
                  <div className={`p-6 rounded-2xl border border-neutral-100 space-y-3 ${feedback.color}`}>
                    <div className="flex justify-center">{feedback.icon}</div>
                    <p className="text-xl font-extrabold">{feedback.title}</p>
                    <p className="text-xs leading-relaxed max-w-sm mx-auto font-medium">
                      {feedback.desc}
                    </p>
                  </div>
                );
              })()}

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={startQuiz}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl shadow hover:bg-neutral-800 transition-colors active:scale-[0.98]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Ulangi Kuis Baru
                </button>
                <Link
                  to="/sibi-info"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-neutral-200 text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Belajar Abjad SIBI
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
