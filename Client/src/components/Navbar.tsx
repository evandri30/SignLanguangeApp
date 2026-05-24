import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
 
export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-neutral-900 tracking-widest uppercase">
              SIBI
            </span>
            <span className="h-3.5 w-px bg-neutral-200 hidden sm:block" />
            <span className="text-xs text-neutral-400 font-medium hidden sm:block">
              Sistem Isyarat Bahasa Indonesia
            </span>
          </div>
 
          <div className="flex items-center gap-7">
            <NavLink
              to="/detect"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-150 py-1 border-b-2 ${
                  isActive
                    ? "text-neutral-900 border-neutral-900"
                    : "text-neutral-400 border-transparent hover:text-neutral-700"
                }`
              }
            >
              Deteksi
            </NavLink>
            <NavLink
              to="/sibi-info"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-150 py-1 border-b-2 ${
                  isActive
                    ? "text-neutral-900 border-neutral-900"
                    : "text-neutral-400 border-transparent hover:text-neutral-700"
                }`
              }
            >
              Informasi
            </NavLink>
            <NavLink
              to="/quiz"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-150 py-1 border-b-2 ${
                  isActive
                    ? "text-neutral-900 border-neutral-900"
                    : "text-neutral-400 border-transparent hover:text-neutral-700"
                }`
              }
            >
              Kuis
            </NavLink>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}