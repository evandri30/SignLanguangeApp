export type FeedbackIconType = "Sparkles" | "Award" | "Trophy" | "BookOpen";

export interface FeedbackDetails {
  title: string;
  desc: string;
  color: string;
  iconName: FeedbackIconType;
}

export const getFeedbackDetails = (score: number): FeedbackDetails => {
  if (score === 100) {
    return {
      title: "Sempurna!",
      desc: "Luar biasa! Anda menguasai abjad SIBI dengan sempurna tanpa satu pun kesalahan.",
      color: "text-emerald-600 bg-emerald-50",
      iconName: "Sparkles",
    };
  } else if (score >= 80) {
    return {
      title: "Hebat Sekali!",
      desc: "Luar biasa! Pemahaman isyarat SIBI Anda sudah sangat matang.",
      color: "text-blue-600 bg-blue-50",
      iconName: "Award",
    };
  } else if (score >= 60) {
    return {
      title: "Bagus!",
      desc: "Kerja bagus! Anda sudah memahami sebagian besar isyarat abjad SIBI.",
      color: "text-yellow-600 bg-yellow-50",
      iconName: "Trophy",
    };
  } else {
    return {
      title: "Jangan Menyerah!",
      desc: "Ayo pelajari kembali abjad SIBI di menu 'Informasi' lalu coba kuis lagi!",
      color: "text-neutral-500 bg-neutral-50",
      iconName: "BookOpen",
    };
  }
};
