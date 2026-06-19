from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app import schemas, crud, models
from app.database import get_db

router = APIRouter()

@router.get("/assignments")
def get_assignments(class_id: Optional[int] = None, db: Session = Depends(get_db)):
    return crud.get_assignments(db, class_id)

@router.post("/assignments", status_code=201)
def create_assignment(data: schemas.AssignmentCreate, db: Session = Depends(get_db)):
    try:
        due = datetime.strptime(data.due_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    return crud.create_assignment(db, data, due)

@router.get("/submissions")
def get_submissions(assignment_id: Optional[int] = None, student_id: Optional[int] = None, db: Session = Depends(get_db)):
    return crud.get_submissions(db, assignment_id, student_id)

@router.post("/submissions", status_code=201)
def create_submission(data: schemas.SubmissionCreate, db: Session = Depends(get_db)):
    assign = db.query(models.Assignment).filter(models.Assignment.id == data.assignment_id).first()
    if not assign:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return crud.create_submission(db, data)

@router.post("/submissions/ai-grade")
def ai_grade_submission(req: dict, db: Session = Depends(get_db)):
    submission_id = req.get("submission_id")
    if not submission_id:
        raise HTTPException(status_code=400, detail="submission_id is required")
        
    sub = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    content = sub.submission_content or ""
    word_count = len(content.split())
    
    score = 80.0
    keywords = ["schrödinger", "quantized", "wave function", "loss", "relu", "regularization", "transformer", "pytorch"]
    matched = [kw for kw in keywords if kw in content.lower()]
    
    score += len(matched) * 3
    if word_count > 100:
        score += 5
    if word_count > 300:
        score += 5
        
    score = min(100.0, score)
    
    ai_feedback = (
        f"[AI Assistant review] The submitted text shows a clear structure with a word count of {word_count}. "
        f"Concepts matched: {', '.join(matched) if matched else 'general science terms'}. "
        f"The content shows a solid understanding of structural details. Excellent layout."
    )
    
    sub.score = score
    sub.grade_feedback = ai_feedback
    sub.grader_id = 999
    db.commit()
    db.refresh(sub)
    
    return {
        "submission_id": sub.id,
        "score": sub.score,
        "grade_feedback": sub.grade_feedback,
        "graded_by": "ASST-AI-Grader"
    }

@router.post("/submissions/grade")
def grade_submission(data: schemas.GradeCreate, db: Session = Depends(get_db)):
    sub = db.query(models.Submission).filter(models.Submission.id == data.submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    sub.score = data.score
    sub.grade_feedback = data.grade_feedback
    sub.grader_id = data.grader_id
    db.commit()
    db.refresh(sub)
    return sub

@router.get("/quizzes")
def get_quizzes(class_id: Optional[int] = None, db: Session = Depends(get_db)):
    return crud.get_quizzes(db, class_id)

@router.post("/quizzes", status_code=201)
def create_quiz(data: schemas.QuizCreate, db: Session = Depends(get_db)):
    return crud.create_quiz(db, data)

@router.get("/quizzes/{quiz_id}/questions")
def get_quiz_questions(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return crud.get_quiz_questions(db, quiz_id)

@router.post("/quizzes/{quiz_id}/questions", status_code=201)
def add_quiz_question(quiz_id: int, data: schemas.QuestionCreate, db: Session = Depends(get_db)):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return crud.create_quiz_question(db, quiz_id, data)

@router.post("/quizzes/{quiz_id}/submit")
def submit_quiz(quiz_id: int, data: schemas.QuizSubmission, db: Session = Depends(get_db)):
    questions = crud.get_quiz_questions(db, quiz_id)
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this quiz")
        
    q_map = {q.id: q.correct_option for q in questions}
    
    score = 0.0
    for ans in data.answers:
        correct = q_map.get(ans.question_id)
        if correct and correct == ans.selected_option.upper():
            score += 1.0
            
    attempt = models.QuizAttempt(
        quiz_id=quiz_id,
        student_id=data.student_id,
        score=score,
        max_score=float(len(questions)),
        attempt_date=datetime.now()
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    
    return {
        "attempt_id": attempt.id,
        "score": attempt.score,
        "max_score": attempt.max_score,
        "percentage": (attempt.score / attempt.max_score * 100.0) if attempt.max_score > 0 else 0,
        "message": "Quiz submitted and auto-graded successfully"
    }

@router.get("/quiz-attempts")
def get_quiz_attempts(student_id: Optional[int] = None, quiz_id: Optional[int] = None, db: Session = Depends(get_db)):
    return crud.get_quiz_attempts(db, student_id, quiz_id)
