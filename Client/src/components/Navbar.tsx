import { NavLink } from "react-router-dom";
import { Camera, BookOpen } from "lucide-react";
import { motion } from "motion/react";

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex h-14 items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-white">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold text-neutral-900 tracking-tight">
              SIBI
            </span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            <NavLink
              to="/detect"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${isActive
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                }`
              }
            >
              <Camera className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Deteksi</span>
              <span className="inline sm:hidden">Deteksi</span>
            </NavLink>

            <NavLink
              to="/sibi-info"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${isActive
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                }`
              }
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Informasi</span>
              <span className="inline sm:hidden">Informasi</span>
            </NavLink>
          </div>

        </div>
      </div>
    </motion.nav>
  );
}