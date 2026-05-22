import logging
from sqlalchemy.orm import Session
from app.models.sibi import SibiLetter

logger = logging.getLogger(__name__)

SIBI_DATA = [
    {
        "letter": "a",
        "name": "Huruf A",
        "description": "Kepalkan telapak tangan kanan dengan ibu jari berada tegak lurus rapat di samping luar jari telunjuk, menghadap ke arah depan.",
        "gesture_steps": [
            "Kepalkan kelima jari tangan kanan Anda.",
            "Posisikan ibu jari tegak lurus dan rapat di samping luar jari telunjuk.",
            "Hadapkan telapak tangan ke depan menuju lawan bicara."
        ],
        "image_url": "/images/sibi/a.svg"
    },
    {
        "letter": "b",
        "name": "Huruf B",
        "description": "Buka keempat jari (telunjuk, tengah, manis, kelingking) tegak lurus ke atas dan rapat satu sama lain, lalu tekuk ibu jari rapat di depan telapak tangan.",
        "gesture_steps": [
            "Tegakkan jari telunjuk, tengah, manis, dan kelingking secara rapat ke atas.",
            "Tekuk ibu jari melintang rapat di depan telapak tangan Anda.",
            "Hadapkan telapak tangan ke depan."
        ],
        "image_url": "/images/sibi/b.svg"
    },
    {
        "letter": "c",
        "name": "Huruf C",
        "description": "Lengkungkan kelima jari tangan kanan menyerupai bentuk huruf 'C' atau setengah lingkaran terbuka ke kiri.",
        "gesture_steps": [
            "Lengkungkan keempat jari dan ibu jari Anda secara bersamaan.",
            "Atur jarak sehingga membentuk lengkungan setengah lingkaran sempurna.",
            "Arahkan bukaan lengkungan ke arah kiri Anda (ke dalam)."
        ],
        "image_url": "/images/sibi/c.svg"
    },
    {
        "letter": "d",
        "name": "Huruf D",
        "description": "Tegakkan jari telunjuk lurus ke atas. Pertemukan ujung jari tengah, manis, kelingking dengan ibu jari membentuk lingkaran di bawah.",
        "gesture_steps": [
            "Tegakkan jari telunjuk lurus ke atas.",
            "Tekuk jari tengah, manis, dan kelingking ke bawah.",
            "Satukan ujung ketiga jari tersebut dengan ibu jari sehingga membentuk lingkaran."
        ],
        "image_url": "/images/sibi/d.svg"
    },
    {
        "letter": "e",
        "name": "Huruf E",
        "description": "Tekuk keempat jari rapat ke arah telapak tangan, lalu lipat ibu jari secara mendatar (horizontal) rapat tepat di bawah jari-jari yang tertekuk tersebut.",
        "gesture_steps": [
            "Tekuk jari telunjuk, tengah, manis, dan kelingking ke arah dalam telapak tangan setengah mengepal rapat.",
            "Lipat ibu jari melintang rata di bawah kuku keempat jari yang menekuk.",
            "Pastikan bentuknya terlihat kompak seperti persegi dari depan."
        ],
        "image_url": "/images/sibi/e.svg"
    },
    {
        "letter": "f",
        "name": "Huruf F",
        "description": "Pertemukan ujung jari telunjuk dan ibu jari membentuk lingkaran kecil. Jari tengah, manis, dan kelingking tegak rapat ke atas (seperti simbol 'OK').",
        "gesture_steps": [
            "Satukan ujung ibu jari dengan ujung jari telunjuk membentuk lingkaran.",
            "Tegakkan jari tengah, manis, dan kelingking rapat lurus ke atas.",
            "Hadapkan telapak tangan ke depan."
        ],
        "image_url": "/images/sibi/f.svg"
    },
    {
        "letter": "g",
        "name": "Huruf G",
        "description": "Kepalkan jari tengah, manis, kelingking. Bentangkan jari telunjuk dan ibu jari secara horizontal saling sejajar menunjuk ke samping kiri/arah luar.",
        "gesture_steps": [
            "Kepalkan jari tengah, manis, dan kelingking ke telapak tangan.",
            "Luruskan jari telunjuk mendatar ke arah kiri/samping.",
            "Bentangkan ibu jari sejajar dengan jari telunjuk di bagian atasnya."
        ],
        "image_url": "/images/sibi/g.svg"
    },
    {
        "letter": "h",
        "name": "Huruf H",
        "description": "Bentangkan jari telunjuk dan tengah sejajar mendatar ke samping kiri/arah luar. Jari manis, kelingking dikepalkan, dan ibu jari melipat di atasnya.",
        "gesture_steps": [
            "Kepalkan jari manis dan kelingking Anda.",
            "Bentangkan jari telunjuk dan jari tengah sejajar lurus ke arah samping.",
            "Posisikan ibu jari melipat di atas jari manis yang mengepal."
        ],
        "image_url": "/images/sibi/h.svg"
    },
    {
        "letter": "i",
        "name": "Huruf I",
        "description": "Kepalkan seluruh jari (telunjuk, tengah, manis, ibu jari) rapat-rapat, kecuali jari kelingking yang tegak lurus ke atas.",
        "gesture_steps": [
            "Kepalkan erat jari telunjuk, tengah, manis, dan ibu jari.",
            "Tegakkan jari kelingking lurus ke atas.",
            "Hadapkan telapak tangan ke depan."
        ],
        "image_url": "/images/sibi/i.svg"
    },
    {
        "letter": "j",
        "name": "Huruf J",
        "description": "Tegakkan jari kelingking lurus ke atas (seperti posisi 'I'), lalu gerakkan seluruh tangan menggambar lengkungan huruf 'J' di udara ke bawah lalu naik.",
        "gesture_steps": [
            "Mulai dengan posisi tangan membentuk isyarat huruf I (hanya kelingking yang tegak).",
            "Gerakkan tangan Anda ke bawah, lalu lengkungkan ke kanan atas membentuk pola huruf J di udara.",
            "Akhiri gerakan dengan kelingking kembali tegak di posisi lebih tinggi."
        ],
        "image_url": "/images/sibi/j.svg"
    },
    {
        "letter": "k",
        "name": "Huruf K",
        "description": "Tegakkan telunjuk dan jari tengah terbuka membentuk huruf 'V'. Letakkan ujung ibu jari tepat di antara celah jari telunjuk dan jari tengah tersebut.",
        "gesture_steps": [
            "Tegakkan jari telunjuk dan jari tengah terpisah membentuk sudut (huruf V).",
            "Posisikan ibu jari tegak menempel di antara celah kedua jari tersebut.",
            "Tekuk jari manis dan kelingking rapat ke telapak tangan."
        ],
        "image_url": "/images/sibi/k.svg"
    },
    {
        "letter": "l",
        "name": "Huruf L",
        "description": "Bentangkan jari telunjuk tegak lurus ke atas dan ibu jari mendatar ke samping membentuk sudut 90 derajat (seperti huruf L). Jari-jari lainnya ditekuk rapat.",
        "gesture_steps": [
            "Tegakkan jari telunjuk lurus ke atas.",
            "Bentangkan ibu jari horizontal ke samping kanan membentuk sudut siku-siku.",
            "Tekuk rapat jari tengah, manis, dan kelingking ke dalam telapak tangan."
        ],
        "image_url": "/images/sibi/l.svg"
    },
    {
        "letter": "m",
        "name": "Huruf M",
        "description": "Lipat ibu jari ke dalam di bawah jari telunjuk, tengah, dan manis yang ditekuk mengepal, sehingga ujung ibu jari menyembul keluar di celah antara jari manis dan kelingking.",
        "gesture_steps": [
            "Tekuk jari telunjuk, tengah, dan manis mengepal ke bawah.",
            "Selipkan ibu jari di bawah ketiga jari tersebut.",
            "Munculkan ujung ibu jari di sela-sela antara jari manis dan jari kelingking."
        ],
        "image_url": "/images/sibi/m.svg"
    },
    {
        "letter": "n",
        "name": "Huruf N",
        "description": "Lipat ibu jari ke dalam di bawah jari telunjuk dan tengah yang ditekuk mengepal, sehingga ujung ibu jari menyembul keluar di celah antara jari tengah dan manis.",
        "gesture_steps": [
            "Tekuk jari telunjuk dan jari tengah mengepal ke bawah.",
            "Selipkan ibu jari di bawah kedua jari tersebut.",
            "Munculkan ujung ibu jari di celah antara jari tengah dan jari manis."
        ],
        "image_url": "/images/sibi/n.svg"
    },
    {
        "letter": "o",
        "name": "Huruf O",
        "description": "Lengkungkan kelima jari tangan kanan Anda dan pertemukan ujung-ujungnya membentuk lingkaran sempurna menyerupai huruf O.",
        "gesture_steps": [
            "Lengkungkan seluruh jari-jari tangan Anda secara melingkar.",
            "Satukan ujung seluruh jari dengan ujung ibu jari.",
            "Pastikan celah di bagian tengah membentuk lingkaran sempurna."
        ],
        "image_url": "/images/sibi/o.svg"
    },
    {
        "letter": "p",
        "name": "Huruf P",
        "description": "Posisikan jari tangan kanan seperti isyarat huruf K (telunjuk dan tengah membentuk 'V' dengan ibu jari di tengahnya), lalu arahkan pergelangan tangan ke bawah sehingga jari telunjuk lurus menunjuk ke bawah secara vertikal.",
        "gesture_steps": [
            "Bentuk konfigurasi tangan seperti huruf K.",
            "Putar pergelangan tangan Anda ke bawah.",
            "Posisikan jari telunjuk lurus mengarah ke lantai, dengan jari tengah mengikuti miring."
        ],
        "image_url": "/images/sibi/p.svg"
    },
    {
        "letter": "q",
        "name": "Huruf Q",
        "description": "Hadapkan telapak tangan ke bawah, bentangkan jari telunjuk dan ibu jari ke bawah membentuk sudut lengkung (seperti capit kepiting yang menghadap ke bawah). Jari lainnya dikepalkan.",
        "gesture_steps": [
            "Hadapkan telapak tangan ke bawah.",
            "Luruskan jari telunjuk dan ibu jari ke bawah secara terpisah.",
            "Posisikan seperti menjepit sesuatu ke arah bawah, dengan tiga jari lainnya mengepal rapat."
        ],
        "image_url": "/images/sibi/q.svg"
    },
    {
        "letter": "r",
        "name": "Huruf R",
        "description": "Silangkan jari telunjuk dan jari tengah secara rapat (jari tengah menyilang rapat di depan jari telunjuk). Jari manis, kelingking, dan ibu jari ditekuk rapat.",
        "gesture_steps": [
            "Tegakkan jari telunjuk dan tengah Anda.",
            "Silangkan jari tengah menumpuk rapat di depan jari telunjuk.",
            "Tekuk ibu jari di atas jari manis yang terlipat mengepal di bawah."
        ],
        "image_url": "/images/sibi/r.svg"
    },
    {
        "letter": "s",
        "name": "Huruf S",
        "description": "Kepalkan tangan kanan Anda erat-erat dengan posisi ibu jari dilipat horizontal melintang rapat di depan jari-jari lainnya.",
        "gesture_steps": [
            "Kepalkan kelima jari Anda membentuk tinju rapat.",
            "Lipat ibu jari melintang di depan jari telunjuk, tengah, dan manis.",
            "Hadapkan kepalan tangan Anda ke depan."
        ],
        "image_url": "/images/sibi/s.svg"
    },
    {
        "letter": "t",
        "name": "Huruf T",
        "description": "Kepalkan tangan dan selipkan ibu jari ke dalam di celah antara jari telunjuk dan jari tengah, sehingga ujung ibu jari menyembul ke depan di antara keduanya.",
        "gesture_steps": [
            "Tekuk jari-jari tangan Anda mengepal.",
            "Selipkan ibu jari ke atas di sela antara jari telunjuk dan jari tengah.",
            "Biarkan ujung ibu jari menonjol keluar di sela kedua jari tersebut."
        ],
        "image_url": "/images/sibi/t.svg"
    },
    {
        "letter": "u",
        "name": "Huruf U",
        "description": "Tegakkan jari telunjuk dan jari tengah rapat bersama-sama lurus ke atas. Jari manis, kelingking, dan ibu jari dilipat rapat ke dalam.",
        "gesture_steps": [
            "Tegakkan jari telunjuk dan jari tengah rapat berdampingan ke atas.",
            "Lipat jari manis dan kelingking ke dalam telapak tangan.",
            "Posisikan ibu jari menekuk menempel rapat di atas jari manis."
        ],
        "image_url": "/images/sibi/u.svg"
    },
    {
        "letter": "v",
        "name": "Huruf V",
        "description": "Tegakkan jari telunjuk dan jari tengah terbuka lebar membentuk huruf 'V' ke atas. Jari manis, kelingking, dan ibu jari dilipat rapat.",
        "gesture_steps": [
            "Tegakkan jari telunjuk dan jari tengah terbuka membentuk sudut.",
            "Lipat jari manis dan kelingking ke telapak tangan.",
            "Kunci jari manis dengan ibu jari di depannya."
        ],
        "image_url": "/images/sibi/v.svg"
    },
    {
        "letter": "w",
        "name": "Huruf W",
        "description": "Tegakkan jari telunjuk, tengah, dan manis terbuka membentuk huruf 'W' ke atas. Tekuk jari kelingking dan tahan dengan ujung ibu jari di depannya.",
        "gesture_steps": [
            "Tegakkan jari telunjuk, tengah, dan manis terbuka menyebar ke atas.",
            "Tekuk jari kelingking rapat ke telapak tangan.",
            "Tahan ujung kelingking dengan ibu jari Anda."
        ],
        "image_url": "/images/sibi/w.svg"
    },
    {
        "letter": "x",
        "name": "Huruf X",
        "description": "Kepalkan tangan kanan, lalu angkat jari telunjuk dan tekuk setengah lingkaran menyerupai kait atau kail pancing. Jari-jari lainnya dikepalkan rapat.",
        "gesture_steps": [
            "Kepalkan seluruh jari kecuali telunjuk.",
            "Angkat telunjuk tegak lalu tekuk sendi bagian atasnya membentuk kail melengkung.",
            "Hadapkan punggung jari telunjuk tersebut ke arah lawan bicara."
        ],
        "image_url": "/images/sibi/x.svg"
    },
    {
        "letter": "y",
        "name": "Huruf Y",
        "description": "Bentangkan ibu jari dan kelingking lebar-lebar ke samping. Lipat tiga jari lainnya (telunjuk, tengah, manis) rapat ke dalam telapak tangan.",
        "gesture_steps": [
            "Bentangkan ibu jari selebar mungkin ke kiri/samping.",
            "Bentangkan jari kelingking selebar mungkin ke kanan/samping.",
            "Tekuk rapat jari telunjuk, tengah, dan manis di tengah telapak tangan."
        ],
        "image_url": "/images/sibi/y.svg"
    },
    {
        "letter": "z",
        "name": "Huruf Z",
        "description": "Angkat jari telunjuk tegak ke atas, lalu gerakkan pergelangan tangan Anda untuk menggambar pola huruf 'Z' di udara menggunakan ujung jari telunjuk tersebut.",
        "gesture_steps": [
            "Tegakkan jari telunjuk lurus ke atas dengan jari lainnya dikepalkan.",
            "Gerakkan tangan membentuk garis horizontal ke kanan di udara.",
            "Tarik garis diagonal ke bawah-kiri, kemudian garis horizontal ke kanan lagi untuk menyempurnakan huruf Z."
        ],
        "image_url": "/images/sibi/z.svg"
    }
]

def seed_sibi_data(db: Session):
    """Seed data SIBI A-Z ke dalam database jika tabel masih kosong."""
    try:
        count = db.query(SibiLetter).count()
        if count == 0:
            logger.info("Database SIBI kosong. Mulai menyemai (seeding) data A-Z...")
            for item in SIBI_DATA:
                letter = SibiLetter(
                    letter=item["letter"],
                    name=item["name"],
                    description=item["description"],
                    gesture_steps=item["gesture_steps"],
                    image_url=item["image_url"]
                )
                db.add(letter)
            db.commit()
            logger.info("Seeding data SIBI A-Z berhasil dilakukan!")
        else:
            logger.info(f"Database SIBI sudah memiliki {count} baris data. Melewati seeding.")
    except Exception as e:
        db.rollback()
        logger.error(f"Gagal melakukan seeding database SIBI: {e}")
        raise e
