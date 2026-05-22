import { motion } from "motion/react";

interface LetterItem {
  id: number;
  letter: string;
  name: string;
}

interface SibiAlphabetPickerProps {
  letters: LetterItem[];
  selectedLetter: LetterItem | null;
  onSelect: (letter: LetterItem) => void;
}

export function SibiAlphabetPicker({ letters, selectedLetter, onSelect }: SibiAlphabetPickerProps) {
  return (
    <div className="flex flex-wrap gap-1.5 select-none">
      {letters.map((item) => {
        const isSelected = selectedLetter?.id === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            title={item.name}
            className="relative h-9 w-9 rounded-md text-sm font-medium cursor-pointer focus:outline-none border border-neutral-200"
          >
            {/* Sliding backdrop for active letter */}
            {isSelected && (
              <motion.span
                layoutId="activeLetterBackdrop"
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="absolute inset-0 rounded-md bg-neutral-900 border border-neutral-900"
              />
            )}
            
            {/* Letter Text */}
            <span className={`relative z-10 ${
              isSelected ? "text-white" : "text-neutral-500 hover:text-neutral-900"
            }`}>
              {item.letter.toUpperCase()}
            </span>
          </button>
        );
      })}
    </div>
  );
}