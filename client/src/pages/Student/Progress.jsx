import React, { useState } from "react";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../Global/ThemeContext';
import axios from 'axios';
import { url,c_url } from '../../Global/URL';
import showToast from '../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import { color } from "framer-motion";

const Progress = () => {
    const [startdate, setStartDate] = useState('');
    const [enddate, setEndDate] = useState('');
    const [task, setTask] = useState('');
    const [subID, setSubID] = useState('');
    const weekData = JSON.parse(localStorage.getItem('week'));
    const {week, late} = weekData;
    const [isLate, setIsLate] = useState(late);
    const [weekNo, setWeekNo] = useState(parseInt('', 10));
    const toast = useToast();
    const { theme: colors } = useTheme();

    const accessToken = localStorage.getItem('IMPaccessToken');
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
        try {
            const data = {
                sub_id: subID,
                week: weekNo,
                description: task,
                isLateSubmission: isLate
            };
            const response = await axios.post(url + `/student/progress/add`, data);
            if (response.data.success) {
                showToast(toast, 'Success', 'success', 'Data Submitted...Redirecting...');
            } else {
                showToast(toast, 'Error', 'error', response.data.msg);
            }
            setTimeout(() => {
                window.location.href = c_url + 'student/progress/view'; 
              }, 2000);
            if (response.ok) {
                console.log('Data successfully submitted to the backend!');
            } else {
                console.error('Failed to submit data to the backend.');
            }
        } catch (error) {
            console.error('Error occurred while submitting data:', error);
        }
    };




    const fetchData = async () => {
        try {
            const userInfo = await getUser();
            if (userInfo) {
                const weekData = JSON.parse(localStorage.getItem('week'));
                const {week, late} = weekData;
                setWeekNo(week);
                setSubID(userInfo.sub_id);
                setStartDate(new Date(userInfo.internships[0].progress[week - 1].startDate).toISOString().substring(0, 10));
                setEndDate(new Date(userInfo.internships[0].progress[week- 1].endDate).toISOString().substring(0, 10));
                setIsLate(late);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {      
        fetchData();
    }, []);

    return (
        <section class={`bg-${colors.secondary} py-8 lg:py-16 antialiased min-h-screen`}>
            <div class="max-w-2xl mx-auto px-4">
                <div class="flex justify-between items-center mb-6">
                    <h2 class={`text-xl lg:text-3xl font-bold text-${colors.font}`}>Weekly Progress:</h2>
                </div>
                <form class="mb-6" onSubmit={handleSubmit}>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Week Start Date:</h2>
                    </div>
                    <div class={`py-2 px-4 mb-4 text-${colors.font} rounded-lg rounded-t-lg border border-${colors.accent}`}>
                        <h1>{startdate}</h1>
                    </div>

                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Week End Date:</h2>
                    </div>
                    <div class={`py-2 px-4 mb-4 text-${colors.font} rounded-lg rounded-t-lg border border-${colors.accent}`}>
                        <h1>{enddate}</h1>
                    </div>

                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Task:</h2>
                    </div>
                    <div class={`py-2 px-4 mb-4 bg-${colors.secondary} rounded-lg rounded-t-lg border border-${colors.accent} text-${colors.font}`}>
                        <textarea id="comment" rows="6" value={task}
                            style={{ backgroundColor: colors.secondary2, color: colors.font}}
                            onChange={(e) => {setTask(e.target.value);
                            setCharCount(e.target.value.length);}}
                            maxLength={1000}

                            class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            placeholder="Write a comment..." required></textarea>
                            <p>Character count: {charCount}/1000</p>
                    </div>
                    <button type="submit" class="text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit Data</button>
                </form>
            </div>
        </section>
    );
};

export default Progress;