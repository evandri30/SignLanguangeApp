import random
import logging
from sqlalchemy.orm import Session
from app.models.sibi import SibiLetter
from app.models.quiz import SibiQuizQuestion

logger = logging.getLogger(__name__)

def seed_quiz_questions(db: Session):
    """Seed soal ke database"""
    try:
        count = db.query(SibiQuizQuestion).count()
        if count > 0:
            logger.info(f"Database SIBI Quiz sudah memiliki {count} soal. Melewati seeding.")
            return

        logger.info("Database SIBI Quiz kosong. Mulai menyemai (seeding) 104 soal...")
        
        letters = db.query(SibiLetter).all()
        if not letters:
            logger.error("Gagal melakukan quiz seeding karena data SIBI abjad (sibi_letters) kosong! Harap jalankan seeder SIBI abjad dahulu.")
            return

        all_chars = [l.letter.upper() for l in letters]

        for item in letters:
            char_upper = item.letter.upper()
            
            for v in range(3):
                wrong_choices = random.sample([c for c in all_chars if c != char_upper], 3)
                options = [char_upper] + wrong_choices
                random.shuffle(options) 
                
                question = SibiQuizQuestion(
                    question_text="Huruf apa yang ditunjukkan oleh isyarat tangan pada gambar berikut?",
                    image_path=f"/images/sibi/{item.letter.lower()}.jpg",
                    options=options,
                    correct_answer=char_upper
                )
                db.add(question)

            wrong_choices = random.sample([c for c in all_chars if c != char_upper], 3)
            options = [char_upper] + wrong_choices
            random.shuffle(options)
            
            question = SibiQuizQuestion(
                question_text=f"Berdasarkan deskripsi gerakan berikut, abjad SIBI apakah yang dimaksud?\n\n\"{item.description}\"",
                image_path=None,
                options=options,
                correct_answer=char_upper
            )
            db.add(question)

        db.commit()
        logger.info("Seeding 104 soal kuis SIBI berhasil diselesaikan!")
    except Exception as e:
        db.rollback()
        logger.error(f"Gagal melakukan seeding soal kuis SIBI: {e}")
        raise e
