import React from 'react'
import styles from "./Loader.module.css";
import { useTheme } from '../../Global/ThemeContext';

const Loader = () => {
  const {theme: colors} = useTheme();
  return (
    <div style={{height: '100%', width: '100%'}}>
    <div className={styles.container}>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <p style={{color: colors.font}}>Opportune</p>
    </div>  
    </div>
  )
}
export default Loader;
