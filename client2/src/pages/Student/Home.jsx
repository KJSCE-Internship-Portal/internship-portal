import React, { useState } from "react";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const FramePage = () => {
  const [progressData, setProgressData] = useState([
    { week: 1, status: "Submitted", details: "Details for Week 1" },
    { week: 2, status: "Not Submitted", details: "Details for Week 2" },
    { week: 3, status: "Not Submitted", details: "Details for Week 3" },
    { week: 4, status: "Submitted", details: "Details for Week 4" },
    { week: 5, status: "Not Submitted", details: "Details for Week 5" },
    { week: 6, status: "Not Submitted", details: "Details for Week 6" },
  ]);
  const [mentorFeedback, setMentorFeedback] = useState([
    { mentor: "Faculty Mentor 1", feedback: "Great progress!" },
    { mentor: "Faculty Mentor 2", feedback: "Keep up the good work!" },
  ]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const encodedUserInfo = queryParams.get('userInfo');
  const userInfo = JSON.parse(decodeURIComponent(encodedUserInfo));

  useEffect(() => {
      console.log(userInfo);
      // Store refreshToken in a secure manner (e.g., in an HTTP-only cookie)
      // Perform actions with userInfo as needed
  }, [userInfo]);

  const [user, setuser] = useState([
    {user: "John Doe"}
  ])
  return (
    <>
      <div className="bg-gray-100 flex flex-col font-roboto items-center justify-start mx-auto w-full">
        {/* User */}
        <div className="flex flex-col h-[47px] md:h-auto items-center justify-start max-w-[1262px] mx-auto pt-4 md:px-5 w-full">
          <div className="flex flex-col items-start justify-start w-full">
            <text
              className="text-black-900 text-lg w-full"
              size="txtRobotoMedium18"
            >
              Internship Progress
            </text>
          </div>
        </div>
        <div className="flex md:flex-col flex-row gap-3 h-[70px] md:h-auto items-center justify-start max-w-[1262px] mt-3.5 mx-auto pt-4 md:px-5 w-full">
          <div className="bg-black-900_19 h-10 rounded-[50%] w-10"></div>
          <div className="flex flex-1 flex-col items-start justify-start w-full">
            <text
              className="text-base text-black-900 w-full"
              size="txtRobotoMedium16"
            >
              <h1>{user[0].user}</h1>
            </text>
            <text
              className="text-black-900_7f text-xs w-full"
              size="txtRobotoRegular12"
            >
              KJSCE
            </text>
          </div>
</div>     
      {/* Week Details */}
      <div className="flex flex-col h-[269px] md:h-auto items-center justify-center max-w-[1262px] mt-[13px] mx-auto md:px-5 w-full">
  <div className="flex flex-col items-center justify-center px-3 w-full">
    <div className="overflow-y-auto max-h-[230px] md:max-h-[none] w-full">
      <list
        className="sm:flex-col flex-row gap-5 grid sm:grid-cols-2 md:grid-cols-2 grid-cols-3 justify-start w-full"
        orientation="horizontal"
      >
       {progressData.map((week) => (
            <button key={week.week} className="border border-black-900_19 border-solid flex flex-1 flex-col items-center justify-start rounded-md w-full">
              <div className="flex flex-col h-[164px] md:h-auto items-start justify-start w-full">
                <div className={`bg-black-900_0c flex flex-col gap-[51px] items-left justify-start pb-[73px] md:pr-10 sm:pr-5 pr-[73px] w-full`}>
                  <text
                    className={`justify-center p-1 rounded-br-md rounded-tl-md text-xs w-auto ${week.status === "Submitted" ? "text-green-700" : "text-red-900"}`}
                    size="txtRobotoMedium12"  
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
        </div>
        {/* Mentor Feedback */}
        {/* <list
      className="sm:flex-col flex-row gap-2 grid md:grid-cols-1 grid-cols-2 justify-start max-w-[1238px] mt-[39px] mx-auto md:px-5 w-full"
      orientation="horizontal"
    >
      {mentorFeedback.map((feedback, index) => (
        <div key={index} className="bg-black-900_0c flex flex-col gap-2 items-center justify-center p-3 rounded-md w-[220px]">
          <div className="flex flex-row gap-1 items-center justify-start w-full">
            <div className="flex flex-1 flex-row gap-2 items-center justify-start w-full">
              <div className="bg-black-900_19 h-6 rounded-[50%] w-6"></div>
              <div className="flex flex-1 flex-col items-start justify-start w-full">
                <text
                  className="text-black-900 text-xs w-full"
                  size="txtRobotoMedium12Black900"
                >
                  {feedback.mentor}
                </text>
              </div>
            </div>
            <img
              className="h-[9px] max-h-[9px]"
              src="images/img_television.svg"
              alt="television"
            />
          </div>
          <text
            className="text-black-900 text-sm w-full"
            size="txtRobotoRegular14"
          >
            {feedback.feedback}
          </text>
        </div>
      ))}
    </list> */}
      </div>
    </>
  );
};

export default FramePage;