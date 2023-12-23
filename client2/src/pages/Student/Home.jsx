import React, { useState } from "react";
import { useEffect } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../Global/URL';

const FramePage = () => {
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

  function generateWeekURL(weekNo) {
    const currentDate = new Date();
    if (currentDate > new Date(progressData[weekNo - 1].startDate) && progressData[weekNo - 1].status == 'Not Submitted') {
      const baseURL = 'http://localhost:3000/student/progress';
      const weekURL = `${baseURL}?weekNo=${weekNo}`;
      window.location.href = weekURL;
    }
    else if (progressData[weekNo - 1].status == 'Submitted') {
      const baseURL = 'http://localhost:3000/student/progress/view';
      const weekURL = `${baseURL}?weekNo=${weekNo}`;
      window.location.href = weekURL;
    }
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profile_url, setProfilePicture] = useState('');
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await getUser();
        if (userInfo) {
          setName(userInfo.name);
          setEmail(userInfo.email);
          setProfilePicture(userInfo.profile_picture_url);
          if (userInfo.internships[0].progress && userInfo.internships[0].progress.length > 0) {
            const updatedProgressData = userInfo.internships[0].progress.map((weekInfo, index) => ({
              week: index + 1,
              status: weekInfo.submitted ? 'Submitted' : 'Not Submitted',
              details: `Details for Week ${index + 1}`,
              startDate: weekInfo.startDate,
              endDate: weekInfo.endDate
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

  const WeekComponent = ({ week, details, status, generateWeekURL }) => {
    return (
      <button
        className="border border-black-900_19 border-solid flex flex-1 flex-col items-center justify-start rounded-md w-full relative"
        onClick={() => generateWeekURL(week)}
      >
        <div className="flex flex-col h-[164px] md:h-auto items-start justify-start w-full">
          <div className={`bg-black-900_0c flex flex-col gap-[51px] items-left justify-start pb-[73px] md:pr-10 sm:pr-5 pr-[73px] w-full relative`}>
            <text
              className={`justify-center p-1 rounded-br-md rounded-tl-md text-xs font-semibold w-auto ${status === "Submitted" ? "text-green-700" : "text-red-900"}`}
              size="txtRobotoMedium12"
              style={{ position: 'absolute', top: 5, left: 5, backgroundColor: '#ededed' }} // Positioning for status
            >
              {status}
            </text>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-start justify-start p-2 w-full">
          <text className="text-black-900 text-xs w-full" size="txtRobotoRegular12Black900">
            Week {week}
          </text>
          <text className="text-base text-black-900 w-full" size="txtRobotoMedium16">
            {details}
          </text>
        </div>
      </button>
    );
  };

  return (
    <>
      <div className="bg-gray-100 flex flex-col font-roboto items-center justify-start mx-auto w-full max-h-full py-6 px-4">
        {/* User */}
        <div className="flex md:flex-col flex-row gap-3 h-[70px] md:h-auto items-center justify-start max-w-[1262px] mx-auto pt-4 md:px-5 w-full mb-3.5">
          <div className="flex flex-row justify-start w-full">
            <img
              src={profile_url}
              alt="User Profile"
              className="h-10 w-10 rounded-full mr-2"
            />
            <div className="flex flex-1 flex-col items-start justify-start w-full">
              <text
                className="text-base text-black-900 w-full"
                size="txtRobotoMedium16"
              >
                <h1>{name}</h1>
              </text>
              <text
                className="text-black-900_7f text-xs w-full"
                size="txtRobotoRegular12"
              >
                {email}
              </text>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-[47px] md:h-auto items-center justify-start max-w-[1262px] mx-auto mb-3.5 pt-4 md:px-5 w-full">
          <div className="flex flex-col items-start justify-start w-full">
            <text
              className="text-black-900 text-lg w-full"
              size="txtRobotoMedium18"
            >
              Internship Progress
            </text>
          </div>
        </div>
        {/* Week Details */}
        {/* <div className="flex flex-col h-[269px] md:h-auto items-center justify-center max-w-[1262px] mt-[13px] mx-auto md:px-5 w-full">
          <div className="flex flex-col items-center justify-center px-3 w-full">
            <div className="overflow-y-auto max-h-[230px] md:max-h-[none] w-full">
              <list
                className="sm:flex-col flex-row gap-5 grid sm:grid-cols-2 md:grid-cols-2 grid-cols-1 justify-start w-full"
                orientation="horizontal"
              >
                {progressData.map((week) => (
                  <button key={week.week} className="border border-black-900_19 border-solid flex flex-1 flex-col items-center justify-start rounded-md w-full relative" onClick={() => generateWeekURL(week.week)}>
                    <div className="flex flex-col h-[164px] md:h-auto items-start justify-start w-full">
                      <div className={`bg-black-900_0c flex flex-col gap-[51px] items-left justify-start pb-[73px] md:pr-10 sm:pr-5 pr-[73px] w-full relative`}>
                        <text
                          className={`justify-center p-1 rounded-br-md rounded-tl-md text-xs font-semibold w-auto ${week.status === "Submitted" ? "text-green-700" : "text-red-900"}`}
                          size="txtRobotoMedium12"
                          style={{ position: 'absolute', top: 5, left: 5, backgroundColor: '#ededed'}} // Positioning for week.status
                        >
                          {week.status}
                        </text>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-start justify-start p-2 w-full">
                      <text
                        className="text-black-900 text-xs w-full"
                        size="txtRobotoRegular12Black900"
                      >
                        Week {week.week}
                      </text>
                      <text
                        className="text-base text-black-900 w-full"
                        size="txtRobotoMedium16"
                      >
                        {week.details}
                      </text>
                    </div>
                  </button>
                ))}
              </list>
            </div>
          </div>
        </div> */}
        <div className="flex flex-col h-[269px] md:h-auto items-center justify-center max-w-[1262px] mt-[13px] mx-auto md:px-5 w-full">
          <div className="flex flex-col items-center justify-center px-3 w-full">
            <div className="overflow-y-auto max-h-[230px] md:max-h-[none] w-full">
              <div className="sm:flex-col flex-row gap-5 grid sm:grid-cols-2 md:grid-cols-2 grid-cols-1 justify-start w-full">
                {progressData.map((week) => (
                  <WeekComponent key={week.week} {...week} generateWeekURL={generateWeekURL} />
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

export default FramePage;