from pydantic import BaseModel
from typing import List, Optional

class AssignmentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: str
    class_id: int

class SubmissionCreate(BaseModel):
    assignment_id: int
    student_id: int
    file_name: str
    submission_content: str

class GradeCreate(BaseModel):
    submission_id: int
    score: float
    grade_feedback: str
    grader_id: int

class QuizCreate(BaseModel):
    title: str
    duration_minutes: int
    class_id: int

class QuestionCreate(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str

class QuizAnswer(BaseModel):
    question_id: int
    selected_option: str

class QuizSubmission(BaseModel):
    student_id: int
    answers: List[QuizAnswer]
