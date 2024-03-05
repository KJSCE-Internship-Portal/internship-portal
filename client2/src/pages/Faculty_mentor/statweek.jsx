import React, { useState } from "react";
import { useEffect } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import showToast from '../../Global/Toast';
import { useToast, Card } from '@chakra-ui/react';
import { url, c_url } from '../../Global/URL';

const StatWeek = () => {
  const { theme: colors } = useTheme();

  function generateWeekURL(week) {
    if (week.status == 'Submitted') {
      localStorage.setItem('week', week.week);
      const weekURL = c_url + 'mentor/studentprogress/feedback';
      window.location.href = weekURL;
    }
    else if (week.status == 'Not Submitted') {
      showToast(toast, 'Error', 'error', 'Update Not yet Submitted');
    }
  }

  const [weekData, setWeekData] = useState();
  const toast = useToast();


  const WeekComponent = ({ week, generateWeekURL }) => {
    return (
      <Card>
        <button
          className={`border border-${colors.accent} border-solid flex flex-1 flex-col items-center justify-start rounded-md w-full relative transform transition-transform hover:translate-y-[-2px] hover:shadow-md`}
          onClick={() => generateWeekURL(week)}
          style={{ backgroundColor: colors.secondary }}
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

  useEffect(() => {
    const data = localStorage.getItem('weekData');
    console.log(data);
    setWeekData(data);
  }, []);

  return (
    <>
      <div className={`bg-${colors.secondary2} flex flex-col font-roboto items-center justify-start mx-auto w-full max-h-full py-6 px-4`}>
        {/* Mentor */}
        <div className="md:pl-6 mx-10 mt-3 mb:3 my-auto md:pr-6 min-w-full">
          <hr className={`border border-${colors.accent}`} />
        </div>
        {/* Mentor */}
        <div className="flex flex-col h-[269px] md:h-auto items-center justify-center max-w-[1262px] mt-[13px] mx-auto md:px-5 w-full">
          <div className="flex flex-col items-center justify-center px-3 w-full">
            <div className="overflow-y-auto max-h-[230px] md:max-h-[none] w-full">
              <div className="sm:flex-col flex-row gap-5 grid sm:grid-cols-2 md:grid-cols-2 grid-cols-1 justify-start w-full">
                {weekData.map((week) => (
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

export default StatWeek;