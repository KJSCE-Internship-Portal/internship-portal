import React, { useState } from "react";
import { useEffect } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import { useParams } from 'react-router-dom';
import showToast from '../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  AvatarBadge,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react'
import axios from 'axios';
import { url } from '../../Global/URL';

const Week = () => {
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

  function generateWeekURL(week) {
    if (week.status == 'Submitted') {
      localStorage.setItem('week', week.week);
      const weekURL = 'http://localhost:3000/mentor/studentprogress/feedback';
      window.location.href = weekURL;
    } 
    else if (week.status == 'Not Submitted') {
      showToast(toast, 'Error', 'error', 'Update Not yet Submitted');
    }
    // const currentDate = new Date();
    // if (currentDate > new Date(progressData[weekNo - 1].startDate) && currentDate < new Date(progressData[weekNo - 1].endDate) && progressData[weekNo - 1].status == 'Not Submitted') {
    //   const baseURL = 'http://localhost:3000/student/progress';
    //   const weekURL = `${baseURL}?weekNo=${weekNo}`;
    //   window.location.href = weekURL;
    // }
    // else if (progressData[weekNo - 1].status == 'Submitted') {
    //   const baseURL = 'http://localhost:3000/student/progress/view';
    //   const weekURL = `${baseURL}?weekNo=${weekNo}`;
    //   window.location.href = weekURL;
    // }
  }

  const [department, setDepartment] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentor_profile_url, setMentorProfilePicture] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [student_profile_url, setStudentProfilePicture] = useState('');
  const [progressData, setProgressData] = useState([]);
  const [onTimeSubmission, setOnTimeSubmission] = useState(null);
  const [noSubmission, setNoSubmission] = useState(null);
  const [lateSubmission, setLateSubmission] = useState(null);
  const [progressValue, setProgressValue] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await getUser();
        if (userInfo) {
          const currentDate = new Date();
          setDepartment(userInfo.department);
          setMentorName(userInfo.name);
          setMentorEmail(userInfo.email);
          setMentorProfilePicture(userInfo.profile_picture_url);
          const student_id = localStorage.getItem('student');
          const response = await axios
            .get(url + `/students/all?sub_id=${student_id}`);
          const student = response.data.data[0];
          setStudentName(student.name);
          setStudentEmail(student.email);
          setStudentProfilePicture(student.profile_picture_url);
          if (student.internships[0].progress && student.internships[0].progress.length > 0) {
            setOnTimeSubmission(0);
            setNoSubmission(0);
            setLateSubmission(0);
            const updatedProgressData = student.internships[0].progress
              .filter(weekInfo => {
                const startDate = new Date(weekInfo.startDate);
                const endDate = new Date(weekInfo.endDate);

                return (currentDate >= startDate && currentDate <= endDate) || endDate < currentDate;
              })
              .map((weekInfo, index) => {
                const isSubmitted = weekInfo.submitted;
                const isLateSubmission = weekInfo.isLateSubmission;
                if (isSubmitted && !isLateSubmission) {
                  setOnTimeSubmission(prevValue => (prevValue === null ? 1 : prevValue + 1));
                }
                else if (!isSubmitted){
                  setNoSubmission(prevValue => (prevValue === null ? 1 : prevValue + 1));
                }
                if (isSubmitted && isLateSubmission) {
                  setLateSubmission(prevValue => (prevValue === null ? 1 : prevValue + 1));
                }
                return {
                  week: index + 1,
                  status: weekInfo.submitted ? 'Submitted' : 'Not Submitted',
                  details: `Details for Week ${index + 1}`,
                  startDate: weekInfo.startDate,
                  endDate: weekInfo.endDate,
                  description: weekInfo.description,
                  late: weekInfo.isLateSubmission
                };
          });
            setProgressData(updatedProgressData);
            setProgressValue((updatedProgressData.length / parseInt(student.internships[0].duration_in_weeks))*100);
          }
          // if (student.internships[0].progress && student.internships[0].progress.length > 0) {
          //   const updatedProgressData = student.internships[0].progress.map((weekInfo, index) => ({
          //     week: index + 1,
          //     status: weekInfo.submitted ? 'Submitted' : 'Not Submitted',
          //     details: `Details for Week ${index + 1}`,
          //     startDate: weekInfo.startDate,
          //     endDate: weekInfo.endDate,
          //     description: weekInfo.description,
          //     late: weekInfo.isLateSubmission
          //   }));
          //   setProgressData(updatedProgressData);
          // }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const WeekComponent = ({ week, generateWeekURL }) => {
    return (
      <Card>
        <button
          className={`border border-${colors.accent} border-solid flex flex-1 flex-col items-center justify-start rounded-md w-full relative transform transition-transform hover:translate-y-[-2px] hover:shadow-md`}
          onClick={() => generateWeekURL(week)}
          style={{backgroundColor: colors.secondary}}
        >
          <div className="flex flex-col h-[164px] md:h-auto items-start justify-start w-full">
            <div className={`bg-black-900_0c flex flex-col gap-[51px] items-left justify-start pb-[73px] md:pr-10 sm:pr-5 pr-[73px] w-full relative`}>
              <text
                className={`justify-center p-1 rounded-br-md rounded-tl-md text-xs font-semibold w-auto ${week.description ?
                  (week.late ? "text-orange-600" : (week.status === "Submitted" ? "text-green-700" : "text-red-900"))
                  : "text-red-700"
                  }`}
                size="txtRobotoMedium12"
                style={{ position: 'absolute', top: 5, left: 5, backgroundColor: colors.secondary2 }} // Positioning for status
              >
                {week.description ?
                  (week.late ? "Late Submission" : week.status)
                  : "Not Submitted"
                }
              </text>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-start justify-start p-2 w-full">
            <text className={`text-${colors.font} text-xs w-full`} size="txtRobotoRegular12Black900">
              Week {week.week}
            </text>
            <text className={`text-base text-${colors.font} w-full`} size="txtRobotoMedium16">
              {week.details}
            </text>
          </div>
        </button>
      </Card>
    );
  };

  return (
    <>
      <div className={`bg-${colors.secondary2} flex flex-col font-roboto items-center justify-start mx-auto w-full max-h-full py-6 px-4`}>
        {/* Mentor */}
        <div className={`flex flex-col gap-3 h-[100px] md:h-auto md:items-center max-w-[1262px] mx-auto pt-4 md:px-5 w-full mb-3.5`}>
          <div className="items-start">
            <text
              className={`text-base text-${colors.font} w-full md:text-xl`}
              size="txtRobotoMedium16"
            >
              <h1>{department}</h1>
            </text>
          </div>
          <div className="flex items-center justify-start w-full">
            <Avatar size="md" bg='red.700' color="white" name={mentorName} src={mentor_profile_url} className="h-10 w-10 mr-2" />
            <div className="flex flex-col">
              <h1 className={`text-base text-${colors.font}`} size="txtRobotoMedium16">
                {mentorName}
              </h1>
              <p className={`text-${colors.font} text-xs`} size="txtRobotoRegular12">
                {mentorEmail}
              </p>
            </div>
          </div>
        </div>
        <div className="md:pl-6 mx-10 mt-3 mb:3 my-auto md:pr-6 min-w-full">
          <hr className={`border border-${colors.accent}`} />
        </div>
        <div className={`flex flex-col h-[27px] md:h-auto items-center justify-start max-w-[1262px] mx-auto mb-3.5 pt-4 md:px-5 w-full`}>
          <div className="flex flex-col items-start justify-start w-full">
            <text
              className={`text-${colors.font} text-lg w-full`}
              size="txtRobotoMedium18"
            >
              Internship Progress
            </text>
          </div>
        </div>
        {/* Mentor */}
        <div className="flex md:flex-col flex-row gap-3 h-[100px] md:h-auto items-center justify-start max-w-[1262px] mx-auto pt-4 md:px-5 w-full mb-3.5">
          <div className="flex flex-row justify-start w-full">
            <Avatar size="md" bg='red.700' color="white" name={studentName} src={student_profile_url} className="h-10 w-10 mr-2"></Avatar>
            <div className="flex flex-1 flex-col items-start justify-start w-full">
              <text
                className={`text-base text-${colors.font} w-full`}
                size="txtRobotoMedium16"
              >
                <h1>{studentName}</h1>
              </text>
              <text
                className={`text-${colors.font} text-xs w-full`}
                size="txtRobotoRegular12"
              >
                {studentEmail}
              </text>
            </div>
          </div>
        </div>
        <div className="md:pl-6 mx-10 md:mt-3 mb:5 md:pr-6 min-w-full">
          <Progress hasStripe value={progressValue} className="mb-3" />
          <StatGroup className={`text-${colors.font}`}>
            <Stat className="mr-5">
              <StatLabel>On time Submissions</StatLabel>
              <StatNumber>{onTimeSubmission}</StatNumber>
            </Stat>
            <Stat className="mr-5">
              <StatLabel>Missed Submissions</StatLabel>
              <StatNumber>{noSubmission == 0 ? 0 : noSubmission }</StatNumber>
            </Stat>
            <Stat className="mr-5">
              <StatLabel>Late Submissions</StatLabel>
              <StatNumber>{lateSubmission}</StatNumber>
            </Stat>
          </StatGroup>
        </div>
        <div className="flex flex-col h-[269px] md:h-auto items-center justify-center max-w-[1262px] mt-[13px] mx-auto md:px-5 w-full">
          <div className="flex flex-col items-center justify-center px-3 w-full">
            <div className="overflow-y-auto max-h-[230px] md:max-h-[none] w-full">
              <div className="sm:flex-col flex-row gap-5 grid sm:grid-cols-2 md:grid-cols-2 grid-cols-1 justify-start w-full">
                {progressData.map((week) => (
                  <WeekComponent key={week.week} week={week} generateWeekURL={generateWeekURL} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Week;