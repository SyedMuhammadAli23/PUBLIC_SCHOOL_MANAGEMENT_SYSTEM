from sqlalchemy.orm import Session
from app import models, schemas
from datetime import datetime

def get_assignments(db: Session, class_id: int = None):
    if class_id:
        return db.query(models.Assignment).filter(models.Assignment.class_id == class_id).all()
    return db.query(models.Assignment).all()

def create_assignment(db: Session, data: schemas.AssignmentCreate, due_date):
    db_obj = models.Assignment(
        title=data.title,
        description=data.description,
        due_date=due_date,
        class_id=data.class_id
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_submissions(db: Session, assignment_id: int = None, student_id: int = None):
    query = db.query(models.Submission)
    if assignment_id:
        query = query.filter(models.Submission.assignment_id == assignment_id)
    if student_id:
        query = query.filter(models.Submission.student_id == student_id)
    return query.all()

def create_submission(db: Session, data: schemas.SubmissionCreate):
    db_obj = models.Submission(
        assignment_id=data.assignment_id,
        student_id=data.student_id,
        file_name=data.file_name,
        submission_content=data.submission_content,
        submission_date=datetime.now()
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_quizzes(db: Session, class_id: int = None):
    if class_id:
        return db.query(models.Quiz).filter(models.Quiz.class_id == class_id).all()
    return db.query(models.Quiz).all()

def create_quiz(db: Session, data: schemas.QuizCreate):
    db_obj = models.Quiz(
        title=data.title,
        duration_minutes=data.duration_minutes,
        class_id=data.class_id
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_quiz_questions(db: Session, quiz_id: int):
    return db.query(models.QuizQuestion).filter(models.QuizQuestion.quiz_id == quiz_id).all()

def create_quiz_question(db: Session, quiz_id: int, data: schemas.QuestionCreate):
    db_obj = models.QuizQuestion(
        quiz_id=quiz_id,
        question_text=data.question_text,
        option_a=data.option_a,
        option_b=data.option_b,
        option_c=data.option_c,
        option_d=data.option_d,
        correct_option=data.correct_option.upper()
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_quiz_attempts(db: Session, student_id: int = None, quiz_id: int = None):
    query = db.query(models.QuizAttempt)
    if student_id:
        query = query.filter(models.QuizAttempt.student_id == student_id)
    if quiz_id:
        query = query.filter(models.QuizAttempt.quiz_id == quiz_id)
    return query.all()
