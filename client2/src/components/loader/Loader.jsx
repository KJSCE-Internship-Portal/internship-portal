import React from 'react'
import styles from "./Loader.module.css";
import { useTheme } from '../../Global/ThemeContext';
import { Spinner } from '@chakra-ui/react'

const Loader = () => {
  const { theme: colors } = useTheme();
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div className={styles.container}>
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color= 'red'
          size='xl'
        />
      </div>
    </div>
  )
}
export default Loader;
