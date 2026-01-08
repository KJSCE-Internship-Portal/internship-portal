import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {url} from './URL';
import Loader from '../components/loader/Loader';


const RedirectionPage = () => {
    const { theme: colors } = useTheme();
    const {accessToken} = useParams();

    const getUser = async () => {
        try {
            const data = await axios.post(url + "/anyuser", {accessToken});
            const role = data.data.msg.role;
            if (role === 'STUDENT'){
                window.location.href = '/student/home';
            } else if( role === 'COORDINATOR'){
                window.location.href = '/coordinator/home';
            } else if( role === 'ADMIN'){
                window.location.href = '/admin/dashboard';
            } else if( role === 'MENTOR'){
                window.location.href = '/mentor/home';
            }
            
        } catch (error) {
            console.log(error);
            localStorage.removeItem('IMPaccessToken');
            window.location.href = '/login'
        }
    }

    useEffect(()=>{
        localStorage.setItem('IMPaccessToken', accessToken);
        getUser();
    });

    return (

        <div style={{ height: '100%', width: '100%', minHeight: '100%', maxWidth: '100%', maxHeight: '100%', overflowY: 'hidden', padding: 10, color: colors.font }}>
            
            <Loader/>
        
        </div>
    );
};

export default RedirectionPage;
