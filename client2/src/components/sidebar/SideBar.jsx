import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaAngleDoubleLeft, FaAngleDoubleRight, FaHome, FaRocket, FaSignOutAlt, FaThLarge } from 'react-icons/fa';
import styles from "./SideBar.module.css";
import {Link} from 'react-router-dom';
// import { colors } from '../../Global/colors';
import { useTheme } from '../../Global/ThemeContext';
import { logout } from '../../Global/authUtils';

const SideBar = () => {
    const [isMinimized, setMinimized] = useState(false);
    const [smallNav, setSmallNav] = useState(window.innerWidth < 900);

    useEffect(() => {
        const handleResize = () => {
        setSmallNav(window.innerWidth < 900)
        };
        window.addEventListener('resize', handleResize);
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);

    const { theme: colors, toggleTheme } = useTheme();
    const container_style = {
        height: smallNav ? 'calc(100vh - 90px)' : 'calc(100vh - 60px)',
        width: isMinimized ? '80px' : '250px', 
        backgroundColor: colors.secondary,
        padding: '10px',
        zIndex: 5,
        transition: 'width 0.3s ease-in-out',
        float: 'left',
        position: 'relative',
        boxShadow: `0 0 1px ${colors.font}`
    };
    const options = [
        {
            icon: <FaHome/>,
            name: "Home",
            link: "/"
        },
        {
            icon: <FaRocket/>,
            name: "Explore",
            link: "/explore"
        },
        {
            icon: <FaThLarge/>,
            name: "Application",
            link: "/my-internships"
        },
        {
            icon: <FaRocket/>,
            name: "Profile",
            link: '/my-profile-settings'
        }
       
        
    ]
    
    return (
        <div style={container_style}>
            <span onClick={() => setMinimized(!isMinimized)} className={styles.openButton}>
                {isMinimized ? <FaAngleDoubleRight style={{ color: colors.font }} /> : <FaAngleDoubleLeft style={{ color: colors.font }} />}
            </span>
            <div className={styles.subContainer}>
                {
                    options.map((element, index) => (
                        <Link to={element.link} key={index} style={{textDecoration: 'none'}}>
                            <div className={styles.listItem}>
                                <span className={styles.iconContainer}>{element.icon}</span>
                                {element.name}
                            </div>
                        </Link>
                    ))
                }
                <div className={styles.listItem} onClick={toggleTheme}>
                    <span className={styles.iconContainer} ><FaSun/></span>
                    Change Theme
                </div>
                <div className={styles.listItem} onClick={
                    ()=>{
                        logout();
                        window.location = '/';
                    }
                }>
                    <span className={styles.iconContainer}><FaSignOutAlt/></span>
                    Logout
                </div>
            </div>
        </div>
    );
}

export default SideBar;
