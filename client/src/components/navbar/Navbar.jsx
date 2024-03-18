import React, { useState, useEffect } from 'react';
import styles from "./Navbar.module.css";
import { Link } from 'react-router-dom';
import sidebarStyles from "../sidebar/SideBar.module.css";
import { FaHome, FaRocket, FaSignOutAlt, FaThLarge, FaTimes, FaSun, FaStream } from 'react-icons/fa';
import { setAuthToken, isAuthenticated, getUserDetails, logout } from '../../Global/authUtils';
import { useTheme } from '../../Global/ThemeContext';
import { useNavigate } from 'react-router-dom';
import StudentNotification from '../Notification/studentnotif';
import { c_url } from '../../Global/URL.js';


const Navbar = () => {
  const isLoggedIn = isAuthenticated();
  const [menu, setMenu] = useState(window.innerWidth < 700);
  const [showMenu, setShowMenu] = useState(false);
  const { theme: colors, toggleTheme } = useTheme();
  const [smallNav, setSmallNav] = useState(window.innerWidth < 900);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setMenu(window.innerWidth < 700);
      setShowMenu(window.innerWidth > 700)
      setSmallNav(window.innerWidth < 900)

    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const options = [
    // {
    //   name: "Internships",
    //   link: '/internships/browse'
    // },
    // {
    //   name: "Courses",
    //   link: "/courses/browse/all"
    // },
    // {
    //   name: "Contact Us",
    //   link: false
    // }
  ]

  const sideBarOptions = [
    {
      icon: <FaHome />,
      name: "Home",
      link: "/"
    },
    // {
    //   icon: <FaRocket />,
    //   name: "Explore",
    //   link: "/explore"
    // },
    // {
    //   icon: <FaThLarge />,
    //   name: "Application",
    //   link: "/my-internships"
    // },
    // {
    //   icon: <FaRocket />,
    //   name: "Profile",
    //   link: '/my-profile-settings'
    // }


  ]
  return (
    <>
      {
        (showMenu && menu && isLoggedIn) &&
        <div className={styles.blurDiv} style={{ position: 'fixed', height: 'calc(100vh - 90px)', width: '100vw', zIndex: 6 }} onClick={() => { setShowMenu(false) }}>

          <div style={{ width: '250px', backgroundColor: colors.secondary, height: '100%', boxShadow: '0 0 1px #eee', display: 'flex', justifyContent: 'center', padding: '10px' }}>

            <div className={sidebarStyles.subContainer} style={{ marginTop: '0px', padding: '0px' }}>
              {
                sideBarOptions.map((element, index) => (
                  <Link to={element.link} key={index} style={{ textDecoration: 'none' }}>
                    <div className={sidebarStyles.listItem}>
                      <span className={sidebarStyles.iconContainer}>{element.icon}</span>
                      {element.name}
                    </div>
                  </Link>

                ))

              }
              {/* <div className={sidebarStyles.listItem} onClick={toggleTheme}>
                <span className={sidebarStyles.iconContainer}><FaSun /></span>
                Change Theme
              </div> */}
              <div className={sidebarStyles.listItem} onClick={logout}>
                <span className={sidebarStyles.iconContainer}><FaSignOutAlt /></span>
                Logout
              </div>
            </div>

          </div>

        </div>
      }
      <div style={{ maxHeight: smallNav ? '90px' : '60px', height: '60px', width: '100%', backgroundColor: colors.secondary, position: 'fixed', top: '0px', zIndex: 4, boxShadow: `0 0 1px ${colors.font}` }}>

        <div style={{ height: '60px' }}>

          <div className={styles.titleContainer}>
            <img src="https://myaccount.somaiya.edu/img/somaiya-vidyavihar-brand.svg" alt="" style={{maxHeight: '40px'}}/>
            <p onClick={() => navigate(c_url)}></p>
          </div>

          {

            <div className={styles.loginContainer} >
              {/* <button className={styles.signUp} onClick={() => (window.location = "/signup")}>SignUp</button> */}
              <StudentNotification/>
            </div>}

        </div>

        <div style={{ maxHeight: smallNav ? '30px' : '0px', height: smallNav ? '30px' : '0px', backgroundColor: colors.secondary, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          {(menu && isLoggedIn) &&
            (showMenu ? <FaTimes style={{ color: colors.font, position: 'absolute', left: '15px', top: '5px' }} onClick={() => { setShowMenu(!showMenu) }} /> : < FaStream style={{ color: colors.font, position: 'absolute', left: '15px', top: '5px' }} onClick={() => { setShowMenu(!showMenu) }} />)}

          <div className={styles.linksContainer} style={{ transform: smallNav ? "translateY(0px)" : "translateY(-30px)", fontSize: smallNav ? "15px" : "18px" }}>

            {
              options.map((option, index) => (
                <Link to={option.link} style={{ textDecoration: 'none' }}>
                  <div className={styles.linkContainer}>{option.name}</div>
                </Link>

              ))
            }
          </div>
        </div>

      </div>
    </>
  )
}

export default Navbar
