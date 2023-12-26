import React, { useState } from "react";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../Global/URL';

const Comment = () => {
    const [startdate, setStartDate] = useState('');
    const [enddate, setEndDate] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentProfilePicture, setStudentProfilePicture] = useState('');
    const [mentorName, setMentorName] = useState('');
    const [mentorEmail, setMentorEmail] = useState('');
    const [mentorProfilePicture, setMentorProfilePicture] = useState('');
    const [weekDescription, setWeekDescription] = useState('');
    const [mentorComment, setMentorComment] = useState('');
    // const [image, setImage] = useState('');

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = await getUser();
                if (userInfo) {
                    const weekData = JSON.parse(localStorage.getItem('week'));
                    const {week, late} = weekData;
                    setStartDate(new Date(userInfo.internships[0].progress[week - 1].startDate).toISOString().substring(0, 10));
                    setEndDate(new Date(userInfo.internships[0].progress[week - 1].endDate).toISOString().substring(0, 10));
                    setStudentName(userInfo.name);
                    setStudentEmail(userInfo.email);
                    setStudentProfilePicture(userInfo.profile_picture_url);
                    setWeekDescription(userInfo.internships[0].progress[week - 1].description);
                    const privComment = userInfo.internships[0].progress[week - 1].mentor_comment;
                    if (privComment != "No Comments Yet") {
                        setMentorName(userInfo.mentor.name);
                        setMentorEmail(userInfo.mentor.email);
                        setMentorProfilePicture(userInfo.profile_picture_url);  
                    }
                    setMentorComment(privComment);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (

        <section class="bg-white dark:bg-gray-200 py-8 lg:py-16 antialiased min-h-screen">
            <div class="max-w-2xl mx-auto px-4">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-lg lg:text-3xl font-bold text-gray-900 dark:text-black">Weekly Report:</h2>
                </div>
                <div class="flex justify-between items-center mb-6 text-black">
                    <h2>Start Date: {startdate}</h2>
                </div>
                <div class="flex justify-between items-center mb-6 text-black">
                    <h2>End Date: {enddate}</h2>
                </div>
                <article class="p-6 text-base bg-white rounded-lg dark:bg-gray-300">
                    <footer class="flex justify-between items-center mb-2">
                        <div class="flex items-center">
                            <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-black font-semibold"><img
                                class="mr-2 w-6 h-6 rounded-full"
                                src={studentProfilePicture}
                                alt="Student" />{studentName}</p>
                            <p class="text-sm text-gray-600 dark:text-black">{studentEmail}</p>
                        </div>
                    </footer>
                    <p class="text-gray-500 dark:text-black">{weekDescription}</p>
                </article>
                {!mentorProfilePicture && (<hr className="border-gray-300" />)}
                <article class="p-6 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-300">
                    <footer class="flex justify-between items-center mb-2">
                        <div class="flex items-center">
                            <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-black font-semibold">{mentorProfilePicture && (
                                <img
                                    className="mr-2 w-6 h-6 rounded-full"
                                    src={mentorProfilePicture}
                                    alt="Mentor"
                                />
                            )}{mentorName}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">{mentorEmail}</p>
                        </div>
                    </footer>
                    <p class="text-gray-500 dark:text-black">{mentorComment}</p>
                </article>
                {mentorProfilePicture && (<hr className="border-gray-300" />)}
            </div>
        </section>
    );
};

export default Comment;