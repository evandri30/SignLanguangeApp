import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Camera, BookOpen, ArrowRight } from "lucide-react";
import {containerVariants, itemVariants} from "@/utils/home"

export function HomeFeatures() {
  return (
    <section className="py-16 md:py-24 bg-neutral-50/50 border-b border-neutral-100">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Fitur Utama Website
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Dua Pilar Pembelajaran SIBI
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 font-medium">
            Platform ini menyediakan instrumen lengkap untuk membantu Anda mempelajari dan mempraktikkan abjad bahasa isyarat secara mandiri.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-2xl border border-neutral-200/60 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:border-neutral-300 group"
          >
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0">
                <Camera className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                Deteksi Kamera AI
              </h3>
              <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
                Lakukan deteksi abjad jari SIBI secara instan dengan kamera web perangkat Anda. Teknologi pemrosesan komputer vision berjalan langsung secara aman di peramban Anda.
              </p>
            </div>
            <div className="pt-6 border-t border-neutral-50 mt-4">
              <Link to="/detect" className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:gap-2.5 transition-all">
                Mulai Deteksi Kamera
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-2xl border border-neutral-200/60 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:border-neutral-300 group"
          >
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                Informasi & Kamus SIBI
              </h3>
              <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
                Akses pustaka abjad lengkap dari A hingga Z. Dilengkapi dengan penjelasan deskripsi gerakan dan langkah-langkah pembentukan gerakan tangan yang presisi.
              </p>
            </div>
            <div className="pt-6 border-t border-neutral-50 mt-4">
              <Link to="/sibi-info" className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:gap-2.5 transition-all">
                Buka Pustaka Informasi
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}