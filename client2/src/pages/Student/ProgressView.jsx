import React, { useState } from "react";
import { useEffect } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import { Avatar, AvatarBadge } from '@chakra-ui/react';
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
    const { theme: colors } = useTheme();
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
                    console.log(userInfo);
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

        <section className={`bg-${colors.secondary} py-8 lg:py-16 antialiased min-h-screen`}>
        <div className={`max-w-2xl mx-auto px-4 text-${colors.font} dark:text-black`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-lg lg:text-3xl font-bold text-${colors.font}`}>Weekly Report:</h2>
                </div>
                <div className={`flex justify-between items-center mb-6 text-${colors.font}`}>
                    <h2>Start Date: {startdate}</h2>
                </div>
                <div className={`flex justify-between items-center mb-6 text-${colors.font}`}>
                    <h2>End Date: {enddate}</h2>
                </div>
                <article className={`p-6 text-base bg-${colors.secondary} rounded-lg`}>
                    <footer className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                            <p className={`inline-flex items-center mr-3 text-sm text-${colors.font} font-semibold`}>
                            <Avatar size="xs" bg='red.700' color="white" name={studentName} src={studentProfilePicture} className="h-10 w-10 mr-2"></Avatar>
                                {studentName}
                            </p>
                            <p className={`text-sm text-${colors.font}`}>{studentEmail}</p>
                        </div>
                    </footer>
                    <p className={`text-${colors.font}`}>{weekDescription}</p>
                </article>
                {!mentorProfilePicture && (<hr className="border-gray-300" />)}
                <article className={`p-2 mb-3 ml-6 lg:ml-12 text-base bg-${colors.secondary} rounded-lg`}>
                    <footer className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                            <p className={`inline-flex items-center mr-3 text-sm text-${colors.font} font-semibold`}>
                                {mentorProfilePicture && (
                                    <Avatar size="xs" bg='red.700' color="white" name={mentorName} className="h-10 w-10 mr-2"></Avatar>
                                )}
                                {mentorName}
                            </p>
                            <p className={`text-sm text-${colors.font}`}>{mentorEmail}</p>
                        </div>
                    </footer>
                    <p className={`text-${colors.font}`}>{mentorComment}</p>
                </article>
                {mentorProfilePicture && (<hr className={`border border-${colors.accent}`} />)}
            </div>
        </section>
    );
};

export default Comment;