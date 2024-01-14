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
    const [wantToReply, setWantToReply] = useState('');
    const [subID, setSubID] = useState('');
    const [weekNo, setWeekNo] = useState('');
    const [charCount, setCharCount] = useState(0);
    const { theme: colors } = useTheme();

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

    const replyOnClick = () => {
        const val = !wantToReply;
        setWantToReply(val);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                sub_id: subID,
                week: weekNo,
                mentor_comment: mentorComment
            };
            const response = await axios.post(url + `/mentor/comment/add`, data);
            window.location.reload();
        } catch (error) {
            console.error('Error occurred while submitting data:', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = await getUser();
                if (userInfo) {
                    // console.log(student);
                    const student_id = localStorage.getItem('student');
                    const weekNo = localStorage.getItem('week');
                    const response = await axios
                        .get(url + `/students/all?sub_id=${student_id}`);
                    const student = response.data.data[0];
                    // console.log(studentData);
                    setWantToReply(false);
                    setSubID(student.sub_id);
                    setWeekNo(weekNo);
                    setStartDate(new Date(student.internships[0].progress[weekNo - 1].startDate).toISOString().substring(0, 10));
                    setEndDate(new Date(student.internships[0].progress[weekNo - 1].endDate).toISOString().substring(0, 10));
                    setStudentName(student.name);
                    setStudentEmail(student.email);
                    setStudentProfilePicture(student.profile_picture_url);
                    setWeekDescription(student.internships[0].progress[weekNo - 1].description);
                    const privComment = student.internships[0].progress[weekNo - 1].mentor_comment;
                    if (privComment != "No Comments Yet") {
                        setMentorName(userInfo.name);
                        setMentorEmail(userInfo.email);
                        setMentorProfilePicture(userInfo.profile_picture_url);
                        setMentorComment(privComment);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);
    return (
        <section class={`bg-${colors.secondary} py-8 lg:py-16 antialiased h-screen`}>
            <div class="max-w-2xl mx-auto px-4">
                <div class="flex justify-between items-center mb-6">
                    <h2 class={`text-lg lg:text-3xl font-bold text-${colors.font}`}>Weekly Report:</h2>
                </div>
                <div class={`flex justify-between items-center mb-6 text-${colors.font}`}>
                    <h2>Start Date: {startdate}</h2>
                </div>
                <div class={`flex justify-between items-center mb-6 text-${colors.font}`}>
                    <h2>End Date: {enddate}</h2>
                </div>
                <article class={`p-6 text-base bg-${colors.secondary} rounded-lg`}>
                    <footer class="flex justify-between items-center mb-2">
                        <div class="flex items-center">
                            <p class={`inline-flex items-center mr-3 text-sm text-${colors.font} font-semibold`}>
                                <Avatar size="xs" bg='red.700' color="white" name={studentName} src={studentProfilePicture} className="h-10 w-10 mr-2"></Avatar>
                                {studentName}
                            </p>
                            <p class={`text-sm text-${colors.font}`}>{studentEmail}</p>
                        </div>
                    </footer>
                    <p class={`text-${colors.font}`}>{weekDescription}</p>
                    {!mentorProfilePicture && (<div class="flex items-center mt-4 space-x-4 mb-3">
                        <button type="button"
                            class={`flex items-center text-sm text-${colors.font} hover:underline font-medium`} onClick={replyOnClick}>
                            <svg class="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                            </svg>
                            Feedback
                        </button>
                    </div>)}
                    {wantToReply && wantToReply === true ? (
                        <form className="mb-6" onSubmit={handleSubmit}>
                            <div className={`py-2 px-4 mb-4 bg-${colors.secondary} rounded-lg rounded-t-lg border border-${colors.accent}`}>
                                <label htmlFor="comment" className="sr-only">Your comment</label>
                                <textarea
                                    id="comment"
                                    rows="6"
                                    value={mentorComment}
                                    onChange={(e) => {setMentorComment(e.target.value);
                                        setCharCount(e.target.value.length);}}
                                        maxLength={500}
                                    className={`px-0 w-full text-sm text-${colors.font} border-0 focus:ring-0 focus:outline-none bg-${colors.secondary} dark:text-${colors.font} dark:placeholder-${colors.font} dark:bg-${colors.secondary}`}
                                    placeholder="Write a comment..."
                                    required
                                    style={{ backgroundColor: colors.secondary2 }}
                                ></textarea>
                                <p>Character count: {charCount}/500</p>
                            </div>
                            
                            <button
                                type="submit"
                                className={`inline-flex items-center py-2.5 px-4 font-medium text-center text-${colors.font} bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800`}
                            >
                                Post comment
                            </button>
                        </form>
                    ) : (
                        <div></div>
                    )}
                </article>
                
                {mentorProfilePicture && (<article class={`p-2 mb-3 ml-6 lg:ml-12 text-base bg-${colors.secondary} rounded-lg`}>
                    <footer class="flex justify-between items-center mb-2">
                        <div class="flex items-center">
                            <p class={`inline-flex items-center mr-3 text-sm text-${colors.font} font-semibold`}>{mentorProfilePicture && (
                                <Avatar size="xs" bg='red.700' color="white" name={mentorName} src={mentorProfilePicture} className="h-10 w-10 mr-2"></Avatar>
                            )}{mentorName}</p>
                            <p class={`text-sm text-${colors.font}`}>{mentorEmail}</p>
                        </div>
                    </footer>
                    <p class={`text-${colors.font}`}>{mentorComment}</p>
                </article>)}
                <hr className={`border border-${colors.accent}`} />
            </div>
        </section>
    );
};

export default Comment;