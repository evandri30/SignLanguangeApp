import { HowItWorksCard } from "@/components/Home/HowItWorksCard"

export function HowItWorks() {
    return (
        <section className="py-16 md:py-24 border-b border-neutral-100">
                <div className="mx-auto max-w-6xl px-6">
                  <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Alur Pembelajaran
                    </p>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                      Bagaimana Cara Menggunakannya?
                    </h2>
                    <p className="text-xs md:text-sm text-neutral-500 font-medium">
                      Ikuti dua langkah praktis untuk memahami dan mempraktikkan abjad isyarat SIBI secara terstruktur.
                    </p>
                  </div>
        
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        
                    <HowItWorksCard
                    number={1}
                    title="Pelajari Abjad Isyarat"
                    description="Kunjungi menu Informasi untuk meninjau secara visual visualisasi tangan serta panduan pembentukan langkah isyarat huruf demi huruf SIBI."
                    />
        
                    <HowItWorksCard
                    number={2}
                    title="Praktikkan di Detektor"
                    description="Aktifkan kamera laptop atau HP Anda pada menu Deteksi, lalu peragakan langsung abjad jari SIBI di depan lensa kamera untuk dideteksi oleh AI secara langsung."
                    />
                  </div>
                </div>
              </section>
    )
}