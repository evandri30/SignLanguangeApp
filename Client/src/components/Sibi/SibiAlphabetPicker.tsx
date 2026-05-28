import { motion } from "motion/react";
import type { SibiAlphabetPickerProps} from "@/types/sibi"
 
export function SibiAlphabetPicker({ letters, selectedLetter, onSelect }: SibiAlphabetPickerProps) {
  return (
    <div className="grid grid-cols-7 gap-1 select-none">
      {letters.map((item) => {
        const isSelected = selectedLetter?.id === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            title={item.name}
            className="relative aspect-square flex items-center justify-center rounded text-xs font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            {isSelected && (
              <motion.span
                layoutId="activeLetterBackdrop"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded bg-neutral-900"
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-100 ${
                isSelected
                  ? "text-white"
                  : "text-neutral-400 hover:text-neutral-800"
              }`}
            >
              {item.letter.toUpperCase()}
            </span>
          </button>
        );
      })}
    </div>
  );
}