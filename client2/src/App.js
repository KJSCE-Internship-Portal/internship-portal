//Importing Modules
import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importing Components
import Navbar from "./components/navbar/Navbar";
import SideBar from "./components/sidebar/SideBar";
import Wrapper from './components/Wrapper/Wrapper';

//Importing Pages
import HomePage from './pages/Coordinators/Home/Home';
import MentorPage from './pages/Coordinators/Mentor/Mentor';
import Login from './pages/Login/login';
import StudentDetailsPage from './pages/Student/Details';
import StudentHome from './pages/Student/Home';
import StudentProgressPage from './pages/Student/Progress';
import RedirectionPage from './Global/redirection';


//importing Functions 
import { setAuthToken, isAuthenticated, getUserDetails } from './Global/authUtils';
import { colors } from './Global/colors';
import { ThemeProvider, useTheme } from './Global/ThemeContext';





function App() {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 700); 
  const isLoggedIn = isAuthenticated();
  const [smallNav, setSmallNav] = useState(window.innerWidth < 900);
  


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
      <Navbar />
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
            <Route path="/" element={<HomePage />} />
            <Route path="/coordinator/mentor/:id" element={<MentorPage />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/student/details" element={<StudentDetailsPage />} />
            <Route path="/student/home" element={<StudentHome />} />
            <Route path="/student/progress" element={<StudentProgressPage />} />
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

