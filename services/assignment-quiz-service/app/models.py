from sqlalchemy import Column, Integer, String, Float, Text, Date, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(Date, nullable=False)
    class_id = Column(Integer, nullable=False)

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, nullable=False)
    file_name = Column(String(255), nullable=False)
    submission_content = Column(Text, nullable=True)
    submission_date = Column(DateTime, default=datetime.utcnow)
    score = Column(Float, nullable=True)
    grade_feedback = Column(Text, nullable=True)
    grader_id = Column(Integer, nullable=True)

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    duration_minutes = Column(Integer, default=30)
    class_id = Column(Integer, nullable=False)

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    option_a = Column(String(255), nullable=False)
    option_b = Column(String(255), nullable=False)
    option_c = Column(String(255), nullable=False)
    option_d = Column(String(255), nullable=False)
    correct_option = Column(String(10), nullable=False)

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, nullable=False)
    score = Column(Float, nullable=False)
    max_score = Column(Float, nullable=False)
    attempt_date = Column(DateTime, default=datetime.utcnow)
