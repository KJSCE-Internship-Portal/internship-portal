import React, { useState } from "react";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../Global/URL';

const Progress = () => {
    const [startdate, setStartDate] = useState('');
    const [enddate, setEndDate] = useState('');
    const [task, setTask] = useState('');
    const [subID, setSubID] = useState('');
    const [weekNo, setWeekNo] = useState(parseInt('', 10));

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                sub_id: subID,
                week: weekNo,
                description: task
            };
            const response = await axios.post(url + `/student/progress/add`, data);
            window.location.href = 'http://localhost:3000/student/progress/view';
            if (response.ok) {
                console.log('Data successfully submitted to the backend!');
            } else {
                console.error('Failed to submit data to the backend.');
            }
        } catch (error) {
            console.error('Error occurred while submitting data:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = await getUser();
                if (userInfo) {
                    const week = localStorage.getItem('week');
                    setWeekNo(week);
                    setSubID(userInfo.sub_id);
                    setStartDate(new Date(userInfo.internships[0].progress[week - 1].startDate).toISOString().substring(0, 10));
                    setEndDate(new Date(userInfo.internships[0].progress[week- 1].endDate).toISOString().substring(0, 10));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <section class="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased min-h-screen">
            <div class="max-w-2xl mx-auto px-4">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">Weekly Progress:</h2>
                </div>
                <form class="mb-6" onSubmit={handleSubmit}>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Week Start Date:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <h1>{startdate}</h1>
                    </div>

                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Week End Date:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <h1>{enddate}</h1>
                    </div>

                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Task:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <textarea id="comment" rows="6" value={task}
                            onChange={(e) => setTask(e.target.value)}
                            class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                            placeholder="Write a comment..." required></textarea>
                    </div>
                    <button type="submit" class="text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit Data</button>

                </form>
            </div>
        </section>
    );
};

export default Progress;