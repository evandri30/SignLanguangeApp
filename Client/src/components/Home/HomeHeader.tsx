import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Camera, BookOpen } from "lucide-react";

export function HomeHeader() {
    return(
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-neutral-100">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div 
            className="space-y-6 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.15]">
              Belajar & Deteksi Sistem Isyarat SIBI
            </h1>
            
            <p className="text-base md:text-lg text-neutral-500 max-w-2xl font-medium leading-relaxed">
              Platform interaktif berbasis kecerdasan buatan untuk mendeteksi abjad jari Sistem Isyarat Bahasa Indonesia (SIBI) secara langsung dari kamera, mempelajari kosakata gerakan, dan menguji kemampuan Anda secara langsung di browser.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3.5 pt-4 justify-center w-full sm:w-auto">
              <Link to="/detect" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors shadow-md hover:shadow-lg text-sm cursor-pointer"
                >
                  <Camera className="h-4.5 w-4.5" />
                  Mulai Deteksi Kamera
                </motion.div>
              </Link>
              
              <Link to="/sibi-info" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-neutral-200 text-neutral-800 font-semibold rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-sm text-sm cursor-pointer"
                >
                  <BookOpen className="h-4.5 w-4.5" />
                  Kamus & Informasi
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    )
}