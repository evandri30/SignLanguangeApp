import { motion } from "motion/react";
import { Play, Loader2 } from "lucide-react";
import { InfoCard } from "@/components/Quiz/InfoCard";
import type { QuizLobbyProps } from "@/types/quiz";


export function QuizLobby({
  loading,
  error,
  startQuiz,
  loadingHistory,
  history,
}: QuizLobbyProps) {
  return (
    <motion.div
      key="lobby"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-12"
    >
      <div className="text-center space-y-4 max-w-xl mx-auto">
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
        <InfoCard 
          number="01"
          title="Format Soal"
          description="Soal visual gambar isyarat abjad & soal analisis deskripsi gerakan tangan."
        />
        <InfoCard 
          number="02"
          title="Sesi Acak"
          description="10 soal yang diacak dari bank soal berisi lebih dari 100 pertanyaan"
        />
        <InfoCard 
          number="03"
          title="Skor Kuis"
          description="100% berdasarkan akurasi jawaban kamu"
        />
      </div>

      <div className="max-w-3xl mx-auto space-y-4 pt-4 border-t border-neutral-100">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            📊 Riwayat Skor Anda
          </h2>
          <span className="text-xs text-neutral-400 tabular-nums font-semibold">
            {history.length} Attempt{history.length !== 1 ? "s" : ""}
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
  );
}
