import React, { useState } from "react";
import { useEffect } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import showToast from '../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { url, c_url } from '../../Global/URL.js';

const Work = () => {
    const [name, setName] = useState('');
    const [workDone, setWorkDone] = useState('');
    const [subID, setSubID] = useState('');
    const {theme:colors} = useTheme();
    const accessToken = localStorage.getItem('IMPaccessToken');
    const toast = useToast();
    const [charCount, setCharCount] = useState(0);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const data = {
                sub_id: subID,
                work_done: workDone,
                student_sign: name,
                evaluation: "ESE"
            };
            const response = await axios.post(url + `/student/evaluation/add`, data);
            if (response.data.success) {
                showToast(toast, 'Success', 'success', 'Data Submitted...Redirecting...');
            } else {
                showToast(toast, 'Error', 'error', response.data.msg);
            }
            setTimeout(() => {
                window.location.href = c_url + 'student/ese/view'; 
              }, 2000);
        } catch(error){
            console.log(error);
        }
    }

    const fetchData = async () => {
        try{
            const userInfo = await getUser();
            if(userInfo){
                setSubID(userInfo.sub_id);
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
        <form class="mb-6">
            <div class="flex justify-between items-center mb-3">
                <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Work Done:</h2>
            </div>
            <div class={`py-2 px-4 mb-4 bg-${colors.secondary} rounded-lg rounded-t-lg border border-${colors.accent} text-${colors.font}`}>
                <textarea id="comment" rows="6" value={workDone}
                    style={{ backgroundColor: colors.secondary2, color: colors.font}}
                    onChange={(e) => {setWorkDone(e.target.value);
                        setCharCount(e.target.value.length);}}
                        maxLength={350}
                    class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                    placeholder="Write you work done..." required></textarea>
                    <p>Character count: {charCount}/350</p>
            </div>
            <div class="flex justify-between items-center mb-3">
                <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Enter your full name as your Signature for attendance:</h2>
            </div>
            <div class={`py-2 px-4 mb-6 bg-${colors.secondary} rounded-lg rounded-t-lg border border-${colors.accent} text-${colors.font}`}>
                <input
                class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                type="text"
                style={{ backgroundColor: colors.secondary2, color: colors.font}}
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />    
            </div>
            <button type="submit" class="text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={handleSubmit}>
            Submit Data</button>

        </form>
        </div>
        </section>
    )
}

export default Work;