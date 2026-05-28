export interface SibiLetterData {
  id: number;
  letter: string;
  name: string;
  description: string;
  gesture_steps: string[];
}

export interface LetterItem {
  id: number;
  letter: string;
  name: string;
}

export interface SibiAlphabetPickerProps {
  letters: LetterItem[];
  selectedLetter: LetterItem | null;
  onSelect: (letter: LetterItem) => void;
}

export interface SibiLetterCardProps {
  letter: string;
  name: string;
  isSelected: boolean;
  onClick: () => void;
}