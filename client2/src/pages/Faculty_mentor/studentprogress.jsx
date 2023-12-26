import React, { useState } from "react";
import { useEffect } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await getUser();
        if (userInfo) {
          localStorage.removeItem('week');
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
            const updatedProgressData = student.internships[0].progress.map((weekInfo, index) => ({
              week: index + 1,
              status: weekInfo.submitted ? 'Submitted' : 'Not Submitted',
              details: `Details for Week ${index + 1}`,
              startDate: weekInfo.startDate,
              endDate: weekInfo.endDate,
              description: weekInfo.description,
              late: weekInfo.isLateSubmission
            }));
            setProgressData(updatedProgressData);
          }
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
          className={`border border-${colors.font} border-solid flex flex-1 flex-col items-center justify-start rounded-md w-full relative transform transition-transform hover:translate-y-[-2px] hover:shadow-md`}
          onClick={() => generateWeekURL(week)}
      >
        <div className="flex flex-col h-[164px] md:h-auto items-start justify-start w-full">
          <div className={`bg-black-900_0c flex flex-col gap-[51px] items-left justify-start pb-[73px] md:pr-10 sm:pr-5 pr-[73px] w-full relative`}>
            <text
              className={`justify-center p-1 rounded-br-md rounded-tl-md text-xs font-semibold w-auto ${week.description ?
                  (week.late ? "text-orange-600" : (week.status === "Submitted" ? "text-green-700" : "text-red-900"))
                  : "text-red-900"
                }`}
              size="txtRobotoMedium12"
              style={{ position: 'absolute', top: 5, left: 5, backgroundColor: '#ededed' }} // Positioning for status
            >
              {week.description ?
                (week.late ? "Late Submission" : week.status)
                : "Not Submitted"
              }
            </text>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-start justify-start p-2 w-full">
          <text className="text-black-900 text-xs w-full" size="txtRobotoRegular12Black900">
            Week {week.week}
          </text>
          <text className="text-base text-black-900 w-full" size="txtRobotoMedium16">
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
<div className={`flex md:flex-col flex-row gap-3 h-[70px] md:h-auto items-center justify-start max-w-[1262px] mx-auto pt-4 md:px-5 w-full mb-3.5`}>
  <text
    className={`text-base text-${colors.font} w-full`}
    size="txtRobotoMedium16"
  >
    <h1>{department}</h1>
  </text>
  <div className="flex flex-row justify-start w-full">
    <img
      src={mentor_profile_url}
      alt="User Profile"
      className="h-10 w-10 rounded-full mr-2"
    />
    <div className="flex flex-1 flex-col items-start justify-start w-full">
      <text
        className={`text-base text-${colors.font} w-full`}
        size="txtRobotoMedium16"
      >
        <h1>{mentorName}</h1>
      </text>
      <text
        className={`text-${colors.font} text-xs w-full`}
        size="txtRobotoRegular12"
      >
        {mentorEmail}
      </text>
    </div>
  </div>
</div>

        <div className={`border-t border-${colors.font} my-3 min-w-full`}></div>
        <div className={`flex flex-col h-[47px] md:h-auto items-center justify-start max-w-[1262px] mx-auto mb-3.5 pt-4 md:px-5 w-full`}>
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
        <div className="flex md:flex-col flex-row gap-3 h-[70px] md:h-auto items-center justify-start max-w-[1262px] mx-auto pt-4 md:px-5 w-full mb-3.5">
          <div className="flex flex-row justify-start w-full">
            <img
              src={student_profile_url}
              alt="User Profile"
              className="h-10 w-10 rounded-full mr-2"
            />
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
        <div className="hidden md:block h-[15vh]"></div>
        <div className="block md:hidden h-[40vh]"></div>
      </div>
    </>
  );
};

export default Week;