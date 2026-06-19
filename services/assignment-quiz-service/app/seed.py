from sqlalchemy.orm import Session
from app import models
from datetime import datetime, date

def seed_mock_data(db: Session):
    if db.query(models.Assignment).count() > 0:
        return
    
    print("Seeding assignments and quizzes...")
    assign1 = models.Assignment(
        title="Quantum Mechanics Schrodinger Equation Analysis",
        description="Write a 500-word analysis of the time-independent Schrodinger equation and its applications in 1D infinite potential wells.",
        due_date=date(2026, 6, 30),
        class_id=3
    )
    assign2 = models.Assignment(
        title="AI & Deep Learning Transformer Notebook",
        description="Build a simple character-level GPT using PyTorch. Submit your Jupyter notebook with comments.",
        due_date=date(2026, 7, 5),
        class_id=2
    )
    db.add(assign1)
    db.add(assign2)
    db.commit()

    sub1 = models.Submission(
        assignment_id=assign1.id,
        student_id=3,
        file_name="quantum_mechanics_1d_well_smith.pdf",
        submission_content="The Schrödinger equation describes the wave function of a quantum-mechanical system. For a 1D potential well of width L, the boundary conditions force the wave function to be zero at the walls (x=0 and x=L). This leads to quantized energy levels E_n = (n^2 * h^2) / (8 * m * L^2).",
        submission_date=datetime.now(),
        score=90.0,
        grade_feedback="Great derivation of energy levels. Keep up the clean math formatting.",
        grader_id=2
    )
    db.add(sub1)
    db.commit()

    quiz1 = models.Quiz(
        title="Introduction to Machine Learning Concepts",
        duration_minutes=15,
        class_id=2
    )
    db.add(quiz1)
    db.commit()

    q1 = models.QuizQuestion(
        quiz_id=quiz1.id,
        question_text="What does 'gradient descent' minimize in machine learning?",
        option_a="Accuracy",
        option_b="Learning Rate",
        option_c="Loss Function",
        option_d="Number of Epochs",
        correct_option="C"
    )
    q2 = models.QuizQuestion(
        quiz_id=quiz1.id,
        question_text="Which activation function is commonly used in hidden layers of Deep Neural Networks?",
        option_a="Sigmoid",
        option_b="ReLU",
        option_c="Softmax",
        option_d="Linear",
        correct_option="B"
    )
    q3 = models.QuizQuestion(
        quiz_id=quiz1.id,
        question_text="Overfitting can be reduced by using which of the following techniques?",
        option_a="Increasing model parameters",
        option_b="Removing regularization",
        option_c="Adding L1/L2 regularization or Dropout",
        option_d="Training for 10x more epochs",
        correct_option="C"
    )
    db.add_all([q1, q2, q3])
    db.commit()

    attempt1 = models.QuizAttempt(
        quiz_id=quiz1.id,
        student_id=3,
        score=3.0,
        max_score=3.0,
        attempt_date=datetime.now()
    )
    db.add(attempt1)
    db.commit()
