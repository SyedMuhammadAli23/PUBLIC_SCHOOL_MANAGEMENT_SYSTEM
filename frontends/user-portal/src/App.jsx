import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { API_BASE } from './config/api';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { CourseworkPage } from './pages/CourseworkPage';
import { CampusPage } from './pages/CampusPage';
import { ResearchAlumniPage } from './pages/ResearchAlumniPage';
import { WalletFeesPage } from './pages/WalletFeesPage';

function MainApp() {
  const { token, user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Shared & Role Specific States
  const [courses, setCourses] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [wallet, setWallet] = useState({ balance: 0 });
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [cafeMenu, setCafeMenu] = useState([]);
  const [cafeOrders, setCafeOrders] = useState([]);
  const [parkingSlots, setParkingSlots] = useState([]);
  const [researchProjects, setResearchProjects] = useState([]);
  const [alumniMentors, setAlumniMentors] = useState([]);
  
  // Assignments & Quiz Specifics
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  
  // Form submission states
  const [submitAssignmentText, setSubmitAssignmentText] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [topupAmount, setTopupAmount] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [newProject, setNewProject] = useState({ title: '', abstract: '', funding: 0 });
  
  // Teacher Forms
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', due_date: '', class_id: 1 });
  const [newQuiz, setNewQuiz] = useState({ title: '', duration: 15, class_id: 1 });
  const [markAttendance, setMarkAttendance] = useState({ class_id: 1, student_id: 3, status: 'present' });
  const [uploadMark, setUploadMark] = useState({ exam_id: 1, student_id: 3, score: '', max_score: 100 });
  const [newLabBooking, setNewLabBooking] = useState({ lab_name: 'Curie Physics Lab B', booking_date: '', start_time: '09:00', end_time: '11:00', purpose: '' });
  
  // Announcements Feeds
  const [notifications, setNotifications] = useState([]);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  // WebSockets for Live notifications
  useEffect(() => {
    if (!token) return;
    
    const ws = new WebSocket(API_BASE.replace('http', 'ws'));
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'auth', token }));
    };
    
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'notification') {
        setNotifications((prev) => [msg.data, ...prev]);
        showFeedback('info', `Notification: ${msg.data.title}`);
      }
    };
    
    return () => ws.close();
  }, [token]);

  // Load Tab Specific Data
  useEffect(() => {
    if (!token || !user) return;
    loadTabData();
  }, [token, user, activeTab]);

  const loadTabData = () => {
    setFeedback({ type: '', msg: '' });
    
    if (activeTab === 'dashboard') {
      fetchList(`/api/notifications`, setNotifications);
      if (user.role === 'student') {
        fetchList(`/api/finance/invoices?user_id=${user.id}`, setInvoices);
        fetchList(`/api/cafe/wallet?user_id=${user.id}`, setWallet);
        fetchList(`/api/schedule/timetables?student_id=${user.id}`, setTimetables);
      } else {
        fetchList(`/api/schedule/timetables?teacher_id=${user.id}`, setTimetables);
      }
    } else if (activeTab === 'academics') {
      if (user.role === 'student') {
        fetchList(`/api/schedule/timetables?student_id=${user.id}`, setTimetables);
        fetchList(`/api/academics/marks?student_id=${user.id}`, setMarks);
      } else {
        fetchList(`/api/schedule/timetables?teacher_id=${user.id}`, setTimetables);
        fetchList(`/api/academics/courses`, setCourses);
      }
    } else if (activeTab === 'classroom') {
      fetchList(`/api/assignments`, (data) => {
        setAssignments(data);
        if (data.length > 0) setSelectedAssignmentId(data[0].id.toString());
      });
      fetchList(`/api/quizzes`, setQuizzes);
      if (user.role === 'student') {
        fetchList(`/api/assignments/submissions?student_id=${user.id}`, setSubmissions);
        fetchList(`/api/assignments/quiz-attempts?student_id=${user.id}`, setQuizAttempts);
      } else {
        fetchList(`/api/assignments/submissions`, setSubmissions);
      }
    } else if (activeTab === 'campus') {
      fetchList(`/api/library/books`, setBooks);
      fetchList(`/api/cafe/menu`, setCafeMenu);
      fetchList(`/api/parking/slots`, setParkingSlots);
      if (user.role === 'student') {
        fetchList(`/api/library/borrows?user_id=${user.id}`, setBorrows);
        fetchList(`/api/cafe/orders?user_id=${user.id}`, setCafeOrders);
      } else {
        fetchList(`/api/library/borrows`, setBorrows);
        fetchList(`/api/cafe/orders`, setCafeOrders);
      }
    } else if (activeTab === 'research-alumni') {
      fetchList(`/api/research/projects`, setResearchProjects);
      fetchList(`/api/alumni/directory`, setAlumniMentors);
    } else if (activeTab === 'wallet-fees' && user.role === 'student') {
      fetchList(`/api/finance/invoices?user_id=${user.id}`, setInvoices);
      fetchList(`/api/cafe/wallet?user_id=${user.id}`, setWallet);
    }
  };

  const fetchList = async (path, setter) => {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setter(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  const handlePost = async (path, body, successMsg, callback) => {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        showFeedback('success', successMsg);
        if (callback) callback();
        loadTabData();
      } else {
        const err = await res.json();
        showFeedback('danger', err.error || 'Operation failed');
      }
    } catch (e) {
      showFeedback('danger', 'Network error');
    }
  };

  const triggerPayInvoice = async (invoiceId) => {
    handlePost('/api/finance/invoices/pay', { invoice_id: invoiceId }, 'Tuition Fee paid successfully!');
  };

  const triggerTopupWallet = () => {
    if (!topupAmount || parseFloat(topupAmount) <= 0) return;
    handlePost('/api/cafe/wallet/topup', { user_id: user.id, amount: parseFloat(topupAmount) }, 'Cafe Wallet topped up successfully!', () => {
      setTopupAmount('');
    });
  };

  const triggerBorrowBook = async (bookId) => {
    handlePost('/api/library/borrow', { user_id: user.id, book_id: bookId }, 'Book checked out from Library!');
  };

  const triggerReturnBook = async (borrowId) => {
    handlePost('/api/library/return', { borrow_id: borrowId }, 'Book returned successfully!');
  };

  const triggerOrderMeal = async (item) => {
    const orderItems = [{ name: item.name, quantity: 1, price: item.price }];
    handlePost('/api/cafe/order', {
      user_id: user.id,
      items: orderItems,
      total_price: item.price
    }, `Pre-ordered ${item.name}! Paid using Cafe Card.`);
  };

  const triggerParkingAllocation = async (slotCode) => {
    if (!vehicleNumber) {
      showFeedback('warning', 'Please enter your Vehicle Registration Number first.');
      return;
    }
    handlePost('/api/parking/allocate', {
      slot_code: slotCode,
      vehicle_number: vehicleNumber,
      allocated_to: user.id
    }, `Parking Spot ${slotCode} reserved successfully!`, () => {
      setVehicleNumber('');
    });
  };

  const triggerParkingRelease = async (slotCode) => {
    handlePost('/api/parking/release', { slot_code: slotCode }, `Parking spot ${slotCode} released.`);
  };

  const triggerSubmitHomework = () => {
    if (!selectedAssignmentId || !submitAssignmentText) return;
    handlePost('/api/assignments/submissions', {
      assignment_id: parseInt(selectedAssignmentId),
      student_id: user.id,
      file_name: `hw_submission_student_${user.id}.txt`,
      submission_content: submitAssignmentText
    }, 'Homework submitted to teacher portal!', () => {
      setSubmitAssignmentText('');
    });
  };

  const triggerAiGrading = async (submissionId) => {
    try {
      const res = await fetch(`${API_BASE}/api/assignments/submissions/ai-grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ submission_id: submissionId })
      });
      if (res.ok) {
        showFeedback('success', 'AI Grader successfully analyzed homework!');
        loadTabData();
      } else {
        showFeedback('danger', 'AI grading failed.');
      }
    } catch (e) {
      showFeedback('danger', 'Network error');
    }
  };

  const startQuizAttempt = async (quiz) => {
    try {
      const res = await fetch(`${API_BASE}/api/quizzes/${quiz.id}/questions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setQuizQuestions(data);
        setActiveQuiz(quiz);
        setQuizAnswers({});
      } else {
        showFeedback('danger', 'Could not load quiz questions');
      }
    } catch (e) {
      showFeedback('danger', 'Network error');
    }
  };

  const submitQuizAnswers = async () => {
    const answersPayload = Object.keys(quizAnswers).map((qId) => ({
      question_id: parseInt(qId),
      selected_option: quizAnswers[qId]
    }));

    handlePost(`/api/quizzes/${activeQuiz.id}/submit`, {
      student_id: user.id,
      answers: answersPayload
    }, 'Quiz submitted and auto-graded successfully!', () => {
      setActiveQuiz(null);
      setQuizQuestions([]);
    });
  };

  const cancelQuizAttempt = () => {
    setActiveQuiz(null);
    setQuizQuestions([]);
  };

  if (!token) {
    return <LoginPage />;
  }

  const isStudent = user?.role === 'student';

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ASST Campus
          </h2>
          <span style={{ fontSize: '10px', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {isStudent ? 'Student Workspace' : 'Teacher Workspace'}
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </button>
          <button className={`btn ${activeTab === 'academics' ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('academics')}>
            🎓 Academics
          </button>
          <button className={`btn ${activeTab === 'classroom' ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('classroom')}>
            📝 Coursework
          </button>
          <button className={`btn ${activeTab === 'campus' ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('campus')}>
            🏫 Campus Life
          </button>
          <button className={`btn ${activeTab === 'research-alumni' ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('research-alumni')}>
            🔬 Research & Alumni
          </button>
          {isStudent && (
            <button className={`btn ${activeTab === 'wallet-fees' ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('wallet-fees')}>
              💳 Wallet & Fees
            </button>
          )}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            User: <strong style={{ color: 'var(--text-main)' }}>{user?.firstName} {user?.lastName}</strong>
          </div>
          <button className="btn btn-danger" style={{ width: '100%', padding: '8px' }} onClick={logout}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="main-content animate-fade">
        {feedback.msg && (
          <div className={`badge badge-${feedback.type}`} style={{ position: 'fixed', top: '20px', right: '20px', padding: '16px 24px', borderRadius: '12px', zIndex: 9999, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontSize: '14px' }}>
            {feedback.msg}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage 
            user={user} 
            wallet={wallet} 
            invoices={invoices} 
            timetables={timetables} 
            notifications={notifications} 
          />
        )}
        {activeTab === 'academics' && (
          <AcademicsPage 
            user={user} 
            timetables={timetables} 
            marks={marks} 
            markAttendance={markAttendance} 
            setMarkAttendance={setMarkAttendance} 
            uploadMark={uploadMark} 
            setUploadMark={setUploadMark} 
            handlePost={handlePost} 
          />
        )}
        {activeTab === 'classroom' && (
          <CourseworkPage 
            user={user} 
            assignments={assignments} 
            submissions={submissions} 
            quizzes={quizzes} 
            quizAttempts={quizAttempts} 
            activeQuiz={activeQuiz} 
            quizQuestions={quizQuestions} 
            quizAnswers={quizAnswers} 
            setQuizAnswers={setQuizAnswers} 
            startQuizAttempt={startQuizAttempt} 
            submitQuizAnswers={submitQuizAnswers} 
            cancelQuizAttempt={cancelQuizAttempt} 
            selectedAssignmentId={selectedAssignmentId} 
            setSelectedAssignmentId={setSelectedAssignmentId} 
            submitAssignmentText={submitAssignmentText} 
            setSubmitAssignmentText={setSubmitAssignmentText} 
            triggerSubmitHomework={triggerSubmitHomework} 
            triggerAiGrading={triggerAiGrading} 
            newAssignment={newAssignment} 
            setNewAssignment={setNewAssignment} 
            newQuiz={newQuiz} 
            setNewQuiz={setNewQuiz} 
            handlePost={handlePost} 
          />
        )}
        {activeTab === 'campus' && (
          <CampusPage 
            user={user} 
            books={books} 
            borrows={borrows} 
            cafeMenu={cafeMenu} 
            cafeOrders={cafeOrders} 
            parkingSlots={parkingSlots} 
            vehicleNumber={vehicleNumber} 
            setVehicleNumber={setVehicleNumber} 
            triggerBorrowBook={triggerBorrowBook} 
            triggerReturnBook={triggerReturnBook} 
            triggerOrderMeal={triggerOrderMeal} 
            triggerParkingAllocation={triggerParkingAllocation} 
            triggerParkingRelease={triggerParkingRelease} 
          />
        )}
        {activeTab === 'research-alumni' && (
          <ResearchAlumniPage 
            user={user} 
            researchProjects={researchProjects} 
            alumniMentors={alumniMentors} 
            newProject={newProject} 
            setNewProject={setNewProject} 
            newLabBooking={newLabBooking} 
            setNewLabBooking={setNewLabBooking} 
            handlePost={handlePost} 
          />
        )}
        {activeTab === 'wallet-fees' && isStudent && (
          <WalletFeesPage 
            wallet={wallet} 
            invoices={invoices} 
            topupAmount={topupAmount} 
            setTopupAmount={setTopupAmount} 
            triggerPayInvoice={triggerPayInvoice} 
            triggerTopupWallet={triggerTopupWallet} 
          />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
