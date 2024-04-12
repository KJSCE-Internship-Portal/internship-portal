import React, { useState } from "react";
import { useEffect } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import { useParams } from 'react-router-dom';
import showToast from '../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import StudentDrawer from './studentdrawer.jsx';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Avatar,
    AvatarBadge,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
} from '@chakra-ui/react'
import axios from 'axios';
import { url, c_url } from '../../Global/URL';
import Alert from '../../components/Alert/alert';


const Progress = () => {
    const [name, setName] = useState('');
    const [mentorName, setMentorName] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [department, setDepartment] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [venue, setVenue] = useState('');
    const [title, setTitle] = useState('');
    const [workdone, setWorkdone] = useState('');
    const [qreport, setQReport] = useState('');
    const [oral, setOral] = useState('');
    const [qwork, setQWork] = useState('');
    const [understanding, setUnderstanding] = useState('');
    const [interaction, setInteraction] = useState('');
    const [remarks, setRemarks] = useState('');
    const [file, setFile] = useState('');
    const [toFill, setToFill] = useState(true);
    const [pdfBuffer, setPdfBuffer] = useState(null);
    const [scheduledDate, setScheduledDate] = useState('');
    const [studentSignature, setStudentSignature] = useState('');
    const [showFileModal, setshowFileModal] = useState(false);
    const [showDataModal, setshowDataModal] = useState(false);
    const [charCount, setCharCount] = useState(0);

    const [isQReportValid, setIsQReportValid] = useState(true);
    const [isOralValid, setIsOralValid] = useState(true);
    const [isQWorkValid, setIsQWorkValid] = useState(true);
    const [isUnderstandingValid, setIsUnderstandingValid] = useState(true);
    const [isInteractionValid, setIsInteractionValid] = useState(true);

    // const [studentData, setStudentData] = useState('');
    const { theme: colors } = useTheme();
    const toast = useToast();

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    function calculateWeeks (startDate, endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        const difference = end - start;
    
        const weeks = Math.ceil(difference / (1000 * 60 * 60 * 24 * 7));
        return parseInt(weeks);
    };

    const calcPeriodicMarks = async (weeks, buffer) => {
        const onTimeWeeks = Math.min(buffer, weeks.length);

        const onTimeSubmissions = (weeks.slice(onTimeWeeks, weeks.length).filter(submission => {
            return !submission.isLateSubmission && submission.submitted;
        })).length + onTimeWeeks;

        // const onTimeSubmissions = (weeks.filter(submission => !submission.isLateSubmission && submission.submitted)).length;
        const percentageMarks = (onTimeSubmissions/weeks.length * 100).toFixed(2);
        const percentageMarksTable = [
            { percentage: 100, marks: 20 },
            { percentage: 92.86, marks: 18 },
            { percentage: 85.71, marks: 16 },
            { percentage: 78.57, marks: 16 },
            { percentage: 71.43, marks: 14 },
            { percentage: 64.29, marks: 12 },
            { percentage: 57.14, marks: 12 },
            { percentage: 50.00, marks: 10 },
            { percentage: 42.86, marks: 8 },
            { percentage: 35.71, marks: 8 },
            { percentage: 28.57, marks: 6 },
            { percentage: 21.43, marks: 6 },
            { percentage: 14.29, marks: 4 },
            { percentage: 7.14, marks: 2 },
            { percentage: 0.00, marks: 0 },
          ];

          const matchingEntry = percentageMarksTable.find(entry => percentageMarks >= entry.percentage);
          setInteraction(matchingEntry.marks);

    }

    const handleFileSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('rollno', rollNo);
        data.append('evaluation', 'ISE');
        data.append('file', file);

        const resp = await axios.post(url + "/mentor/student/evaluation/upload", data);
        if (resp.status == 200) {
            showToast(toast, 'Success', 'success', 'File Uploaded Successfully');
        } else {
            showToast(toast, 'Error', 'error', 'File Not Uploaded');
        }
        setTimeout(() => {
            window.location.href = c_url + 'mentor/studentprogress';
        }, 2000);
    }

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

    const getEvaluationSheet = async () => {
        const uint8Array = new Uint8Array(pdfBuffer.data);
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');
    }

    const fetchData = async () => {
        try {
            const userInfo = await getUser();
            setMentorName(userInfo.name);
            const student_id = localStorage.getItem('student');
            const response = await axios
                .get(url + `/students/all?sub_id=${student_id}`);
            const student = response.data.data[0];
            const currentDate = new Date();
            const filteredProgress = student.internships[0].progress.filter(progressItem => {
                const startDate = new Date(progressItem.startDate);
                return startDate < currentDate;
            });
            const buffer_date = new Date("2024-03-30");
            const buffer = calculateWeeks(student.internships[0].startDate, buffer_date);
            calcPeriodicMarks(filteredProgress, buffer);
            // calcPeriodicMarks(student.internships[0].progress);
            if (student.internships[0].evaluation[0].pdf_buffer.data.length != 0) {
                setToFill(false);
            }
            if (student?.internships?.[0]?.evaluation?.[0]?.pdf_buffer !== undefined) {
                setPdfBuffer(student.internships[0].evaluation[0].pdf_buffer);
            }
            setDepartment(student.department);
            setRollNo(student.rollno);
            setName(student.name);
            setTitle(student.internships[0].job_title);
            if (student.internships[0].evaluation[0].work_done != "" && student.internships[0].evaluation[0].student_sign != "") {
                setWorkdone(student.internships[0].evaluation[0].work_done);
                setStudentSignature(student.internships[0].evaluation[0].student_sign);
                setScheduledDate(student.internships[0].evaluation[0].scheduled_date);
            }
            else {
                showToast(toast, 'Error', 'error', 'Work Done not Submitted by student');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validateMarks = (value, max) => {
            const numValue = parseInt(value);
            return numValue >= 0 && numValue <= max;
        };
        const isQReportValid = validateMarks(qreport, 20);
        const isOralValid = validateMarks(oral, 30);
        const isQWorkValid = validateMarks(qwork, 15);
        const isUnderstandingValid = validateMarks(understanding, 15);
        const isInteractionValid = validateMarks(interaction, 20);

        setIsQReportValid(isQReportValid);
        setIsOralValid(isOralValid);
        setIsQWorkValid(isQWorkValid);
        setIsUnderstandingValid(isUnderstandingValid);
        setIsInteractionValid(isInteractionValid);

        if (!isQReportValid || !isOralValid || !isQWorkValid || !isUnderstandingValid || !isInteractionValid) {
            showToast(toast, 'Error', 'error', 'Marks should be within the specified range');
        return;
    }
        try {
            const data = {
                department_name: department,
                evaluation_name: 'ISE',
                student_rollno: rollNo,
                student_name: name,
                mentor_name: mentorName,
                exam_date: date,
                scheduled_date: scheduledDate,
                exam_time: time,
                exam_venue: venue,
                project_title: title,
                work_done: workdone,
                report_quality_marks: {
                    scored: qreport,
                },
                oral_presentation_marks: {
                    scored: oral,
                },
                work_quality_marks: {
                    scored: qwork,
                },
                work_understanding_marks: {
                    scored: understanding,
                },
                periodic_interaction_marks: {
                    scored: String(interaction),
                },
                examiner_specific_remarks: remarks,
                student_sign: studentSignature,
            };
            const response = await axios.post(url + `/mentor/student/evaluation`, data, { responseType: 'arraybuffer', });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(blob);
            showToast(toast, 'Success', 'success', 'Details entered Successfully');
            setTimeout(() => {
                fetchData();
                window.open(pdfUrl, '_blank');
            }, 1000);

        } catch (error) {
            console.error('Error occurred while submitting data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <section class={`bg-${colors.secondary} py-8 lg:py-16 antialiased min-h-screen`}>
            {toFill ? (<div class="max-w-2xl mx-auto px-4">
                <div class="flex justify-between items-center mb-6">
                    <h2 class={`text-xl lg:text-3xl font-bold text-${colors.font}`}>In Semester Evaluation:</h2>
                </div>
                <form class="mb-6" onSubmit={(e) => {
    e.preventDefault();
    setshowDataModal(true);
}}>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Name of Student:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                        <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled
                            required
                        />
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Roll No of Student:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                        <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            type="text"
                            name="rollNo"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            disabled
                            required
                        />
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Date of examination:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                        <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            type="date"
                            name="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Time:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                        <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            type="time"
                            name="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Venue:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                        <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            type="text"
                            name="venue"
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                        />
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Internship/Project Title:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                        <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            type="text"
                            name="title"
                            value={title}
                            disabled
                            required
                        />
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Work Done:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                        <textarea id="comment" rows="6" value={workdone}
                            disabled
                            class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            placeholder="Work done..." required></textarea>
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Marks:</h2>
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <h2 class={`text-md md:text-xl text-${colors.font}`}>Quality of Report(20)</h2>
                    </div>
                    <div class={`py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border ${isQReportValid ? 'border-gray-200' : 'border-red-500'} dark:bg-gray-500 dark:border-gray-700`}>


                        <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            type="number"
                            name="report"
                            value={qreport}
                            onChange={(e) => setQReport(e.target.value)}
                            required
                        />
                        {!isQReportValid && <p class="text-red-500 text-xs">Invalid value for Quality of Report. Marks out of range.</p>}

                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <h2 class={`text-md md:text-xl text-${colors.font}`}>Oral Presentation(30)</h2>
                    </div>
                    <div class={`py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border ${isOralValid ? 'border-gray-200' : 'border-red-500'} dark:bg-gray-500 dark:border-gray-700`}>
                        <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            type="number"
                            name="oral"
                            value={oral}
                            onChange={(e) => setOral(e.target.value)}
                            required
                        />
                    {!isOralValid && <p class="text-red-500 text-xs">Invalid value for Oral Presentation. Marks out of range.</p>}

                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <h2 class={`text-md md:text-xl text-${colors.font}`}>Quality of Work Done(15)</h2>
                    </div>
                    <div class={`py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border ${isQWorkValid ? 'border-gray-200' : 'border-red-500'} dark:bg-gray-500 dark:border-gray-700`}>
                        <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            type="number"
                            name="work"
                            value={qwork}
                            onChange={(e) => setQWork(e.target.value)}
                            required
                        />
                         {!isQWorkValid && <p class="text-red-500 text-xs">Invalid value for Quality of Work Done. Marks out of range.</p>}
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <h2 class={`text-md md:text-xl text-${colors.font}`}>Understanding of Work(15)</h2>
                    </div>
                    <div class={`py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border ${isUnderstandingValid ? 'border-gray-200' : 'border-red-500'} dark:bg-gray-500 dark:border-gray-700`}>
                        <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            type="number"
                            name="understand"
                            value={understanding}
                            onChange={(e) => setUnderstanding(e.target.value)}
                            required
                        />
                        {!isUnderstandingValid && <p class="text-red-500 text-xs">Invalid value for Understanding of Work. Marks out of range.</p>}
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <h2 class={`text-md md:text-xl text-${colors.font}`}>Periodic Interaction with mentor(20)</h2>
                    </div>
                    <div class={`py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border ${isInteractionValid ? 'border-gray-200' : 'border-red-500'} dark:bg-gray-500 dark:border-gray-700`}>
                        <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            type="number"
                            name="interact"
                            value={interaction}
                            onChange={(e) => setInteraction(e.target.value)}
                            required
                        />
                        {!isInteractionValid && <p class="text-red-500 text-xs">Invalid value for Periodic Interaction with Mentor. Marks out of range.</p>}

                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Specific Remarks of the examiners:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                        <textarea id="comment" rows="6" value={remarks}

                            onChange={(e) => {setRemarks(e.target.value);
                                setCharCount(e.target.value.length);}}
                                maxLength={150}
                            class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            placeholder="Write a remark..."></textarea>
                        <p>Character count: {charCount}/150</p>
                    </div>
                    {showDataModal && (
                        <Alert
                        onConfirm={handleSubmit}
                        text={'Data Submission'}
                        onClosec={() => setshowDataModal(false)}

                        />)
                        }
                    <button type="submit" class="mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        Submit Data
                    </button>
                </form>
            </div>) : (<div class="max-w-2xl mx-auto px-4">
                <button type="submit" class="mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 mb-5 text-center" onClick={getEvaluationSheet}>
                    View Evalutation Sheet
                </button>
                <div class="flex justify-between items-center mb-6">
                    <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Upload Hard Copy of Document:</h2>
                </div>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                    {file ? `Selected file: ${file.name}` : 'Click to upload'}
                                </span>
                            </p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf" 

                        />
                    </label>
                </div>
                <p>*only pdf files are accepted</p>
                {showFileModal && (
                <Alert
                onConfirm={handleFileSubmit}
                text={'File Upload'}
                onClosec={() => setshowFileModal(false)}

                />
      )}
                <button type="submit" class="mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" onClick={()=>setshowFileModal(true)}>
                    Submit Data
                </button>
            </div>
            )}
        </section>
    );

};

export default Progress;