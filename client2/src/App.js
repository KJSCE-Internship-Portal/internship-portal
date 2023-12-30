//Importing Modules
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importing Components
import Navbar from "./components/navbar/Navbar";
import SideBar from "./components/sidebar/SideBar";
import Wrapper from './components/Wrapper/Wrapper';

//Importing Pages
import HomePage from './pages/Coordinators/Home/Home';
import MentorPage from './pages/Coordinators/Mentor/Mentor';
import Login from './pages/Login/login';
import RedirectionPage from './Global/redirection';
import StudentDetailsPage from './pages/Student/Details';
import StudentHome from './pages/Student/Home';
import StudentProgressPage from './pages/Student/Progress';
import StudentProgressView from './pages/Student/ProgressView';
import MentorHome from './pages/Faculty_mentor/homefac';
import MentorStudentView from './pages/Faculty_mentor/studentprogress';
import MentorStudentFeedback from './pages/Faculty_mentor/feedback.jsx';
import AllStudentsInDepartment from './pages/Coordinators/Mentor/AllStudents/AllStudents.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import ISEEvaluation from './pages/Faculty_mentor/ise';
import ViewStudent from './pages/Admin/viewstudent.jsx';
import ViewMentor from './pages/Admin/viewmentor.jsx';
import ViewCoord from './pages/Admin/viewcoordinator.jsx';
import AddCoord from './pages/Admin/addcoord.jsx';

//importing Functions 
import { setAuthToken, isAuthenticated, getUserDetails } from './Global/authUtils';
import { colors } from './Global/colors';
import { ThemeProvider, useTheme } from './Global/ThemeContext';





function App() {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 700);
  const isLoggedIn = isAuthenticated();
  const [smallNav, setSmallNav] = useState(window.innerWidth < 900);

  const PrivateRoute = ({ element }) => {
    const accessToken = localStorage.getItem('IMPaccessToken');
    return accessToken ? element : <Navigate to="/login" replace />;
  };



  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 700);
      setSmallNav(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);



  return (
    <Router>
      <ThemeProvider>
        {window.location.pathname!='/' && window.location.pathname!='/login' && <Navbar />}
        <div style={{ marginTop: smallNav ? '90px' : '60px' }}>
          {(showSidebar && isLoggedIn) && <SideBar />}
          <div
            style={{
              width: 'auto',
              minHeight: smallNav ? 'calc(100vh - 90px)' : 'calc(100vh - 60px)',
              maxHeight: smallNav ? 'calc(100vh - 90px)' : 'calc(100vh - 60px)',
              overflowY: 'hidden',
            }}
          >

            <Wrapper>

              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/admin/dashboard" element={<PrivateRoute element={<Dashboard/>} />} />
                <Route path="/coordinator/home" element={<PrivateRoute element={<HomePage />} />} />
                <Route path="/coordinator/mentor/:id/students" element={<PrivateRoute element={<MentorPage />} />} />
                <Route path='/coordinator/:department/all-students' element={<PrivateRoute element={<AllStudentsInDepartment />} />} />
                <Route path='/admin/dashboard/viewstudent' element={<PrivateRoute element={<ViewStudent/>} />}></Route>
                <Route path='/admin/dashboard/viewmentor' element={<PrivateRoute element={<ViewMentor/>} />}></Route>
                <Route path='/admin/dashboard/viewcoordinator' element={<PrivateRoute element={<ViewCoord/>} />}></Route>
                <Route path='/admin/dashboard/addcoordinator' element={<AddCoord/>}></Route>
                {/* <Route
                  path="/student/details"
                  element={<PrivateRoute element={<StudentDetailsPage />} />}
                /> */}
                <Route path="/student/details" element={<StudentDetailsPage />} />
                <Route
                  path="/student/home"
                  element={<PrivateRoute element={<StudentHome />} />}
                />
                <Route
                  path="/student/progress"
                  element={<PrivateRoute element={<StudentProgressPage />} />}
                />
                <Route
                  path="/student/progress/view"
                  element={<PrivateRoute element={<StudentProgressView />} />}
                />
                <Route
                  path="/mentor/home"
                  element={<PrivateRoute element={<MentorHome />} />}
                />
                <Route
                  path="/mentor/studentprogress"
                  element={<PrivateRoute element={<MentorStudentView />} />}
                />
                <Route
                  path="/mentor/studentprogress/feedback"
                  element={<PrivateRoute element={<MentorStudentFeedback />} />}
                />
                <Route
                  path="/mentor/studentprogress/evaluation/ise"
                  element={<PrivateRoute element={<ISEEvaluation />} />}
                />
                <Route path="/redirection/:accessToken" element={<RedirectionPage />} />

              </Routes>
            </Wrapper>
          </div>
        </div>
      </ThemeProvider>
    </Router>

  );
}

export default App;

