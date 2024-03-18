import React, { useState } from "react";
import { useEffect } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import showToast from '../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { url } from '../../Global/URL';

const View = () => {
    const [sign, setSign] = useState('');
    const [workDone, setWorkDone] = useState('');
    const {theme:colors} = useTheme();
    const accessToken = localStorage.getItem('IMPaccessToken');
    const getUser = async () => {
        try {
            const data = await axios.post(url + "/anyuser", { accessToken });
            const user = data.data.msg._doc;
            return user;
        } catch (error) {
            console.log(error);
            localStorage.removeItem('IMPaccessToken');
        }
    }

    const fetchData = async () => {
        try{
            const userInfo = await getUser();  
            if(userInfo){
                setSign(userInfo.internships[0].evaluation[1].student_sign);
                setWorkDone(userInfo.internships[0].evaluation[1].work_done);
            }       
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData();
      }, []);

    return(
        <section class={`bg-${colors.secondary} py-8 lg:py-16 antialiased min-h-screen`}>
        <div class="max-w-2xl mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
            <h2 class={`text-xl lg:text-3xl font-bold text-${colors.font}`}>ESE Work Done:</h2>
        </div>
        <div class="flex justify-between items-center mb-3">
            <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Work Done:</h2>
        </div>
        <div className={`flex justify-between items-center mb-6 text-${colors.font}`}>
            <h2>{workDone}</h2>
       </div>
        <div class="flex justify-between items-center mb-3">
            <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Your full name as your Signature for attendance:</h2>
        </div>
        <div className={`flex justify-between items-center mb-6 text-${colors.font}`}>
            <h2>{sign}</h2>
       </div>
        </div>
        </section>
    )
}

export default View;