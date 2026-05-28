import { motion } from "motion/react";
import type {SibiLetterCardProps} from "@/types/sibi"

export function SibiLetterCard({ letter, name, isSelected, onClick }: SibiLetterCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center p-5 rounded-md border transition-all duration-200 cursor-pointer ${
        isSelected
          ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
          : "bg-white hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300 text-neutral-600"
      }`}
    >
      <span
        className={`text-3xl font-black tracking-widest transition-all duration-200 ${
          isSelected ? "text-white scale-105" : "text-neutral-500 group-hover:text-neutral-900"
        }`}
      >
        {letter.toUpperCase()}
      </span>
      
      <span className={`text-[9px] mt-2 font-bold tracking-wider uppercase ${
        isSelected ? "text-neutral-300" : "text-neutral-400"
      }`}>
        {name.toUpperCase()}
      </span>
    </motion.button>
  );
}
