import React, { useState } from "react";
import { useEffect } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import showToast from '../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import StudentDrawer from "../Faculty_mentor/studentdrawer";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  AvatarBadge,
  Progress,
  Stat,
  SimpleGrid,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tooltip,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { url, c_url } from '../../Global/URL';

const FramePage = () => {
  const { theme: colors } = useTheme();
  const accessToken = localStorage.getItem('IMPaccessToken');

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

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

  const generateWeekURL = async (week) => {
    const currentDate = new Date();
    const currentWeekIndex = week.week - 1;
    const allPreviousWeeksSubmitted = progressData
      .slice(0, currentWeekIndex)
      .every((previousWeek) => previousWeek.status === 'Submitted');

    if (allPreviousWeeksSubmitted) {
      if (
        (currentDate >= new Date(progressData[currentWeekIndex].startDate) &&
          currentDate <= new Date(progressData[currentWeekIndex].endDate) &&
          progressData[currentWeekIndex].status === 'Not Submitted') ||
        (currentDate > new Date(progressData[currentWeekIndex].endDate) &&
          progressData[currentWeekIndex].status === 'Not Submitted')
      ) {
        const weekData = {
          week: week.week,
          late: currentDate > new Date(progressData[currentWeekIndex].endDate),
        };
        localStorage.setItem('week', JSON.stringify(weekData));
        const weekURL = c_url + 'student/progress';
        window.location.href = weekURL;
      } else if (progressData[currentWeekIndex].status === 'Submitted') {
        const weekData = {
          week: week.week,
          late: false,
        };
        localStorage.setItem('week', JSON.stringify(weekData));
        const weekURL = c_url + 'student/progress/view';
        window.location.href = weekURL;
      }
    } else {
      showToast(toast, 'Error', 'error', 'Previous Weeks Not Submitted');
    }
  }

  const handleCompletionSubmission = async () => {
    if (allWeeksDone) {
      if (onTimeSubmission + lateSubmission == totalWeeks) {
        window.location.href = c_url + 'student/certificate/submission';
        // setAllSubmissionsDone(true);
      }
      // if(allSubmissionsDone) {
      //   window.location.href = 'http://localhost:3000/student/certificate/submission';
      // }
      else {
        showToast(toast, 'Error', 'error', 'Week Submissions still pending');
      }
    } else {
      showToast(toast, 'Error', 'error', 'Internship Duration not completed');
    }
  }

  const handleReportSubmission = async () => {
    if (allWeeksDone) {
      if (onTimeSubmission + lateSubmission == totalWeeks) {
        window.location.href = c_url + 'student/report/submission';
      }
      else {
        showToast(toast, 'Error', 'error', 'Week Submissions still pending');
      }
    } else {
      showToast(toast, 'Error', 'error', 'Internship Duration not completed');
    }
  }

  const handleOtherSubmission = async () => {
    if (allWeeksDone) {
      if (onTimeSubmission + lateSubmission == totalWeeks) {
        window.location.href = c_url + 'student/other/submission';
      }
      else {
        showToast(toast, 'Error', 'error', 'Week Submissions still pending');
      }
    } else {
      showToast(toast, 'Error', 'error', 'Internship Duration not completed');
    }
  }
  

  const getCertificate = async () => {
    try {
      const uint8Array = new Uint8Array(certificatePdfBuffer.data);
      const blob = new Blob([uint8Array], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Error while getting certificate:', error);
      showToast(toast, 'Error', 'error', "Something Wen't Wrong");
    }
  }

  const getReport = async () => {
    try {
      const uint8Array = new Uint8Array(reportPdfBuffer.data);
      const blob = new Blob([uint8Array], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Error while getting report:', error);
      showToast(toast, 'Error', 'error', "Something Wen't Wrong");
    }
  }

  const getOther = async () => {
    try {
      const uint8Array = new Uint8Array(otherPdfBuffer.data);
      const blob = new Blob([uint8Array], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Error while getting submission:', error);
      showToast(toast, 'Error', 'error', "Something Wen't Wrong");
    }
  }

  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profile_url, setProfilePicture] = useState('');
  const [progressData, setProgressData] = useState([]);
  const [onTimeSubmission, setOnTimeSubmission] = useState(null);
  const [noSubmission, setNoSubmission] = useState(null);
  const [lateSubmission, setLateSubmission] = useState(null);
  const [weeksDone, setWeeksDone] = useState(null);
  const [totalWeeks, setTotalWeeks] = useState(null);
  const [progressValue, setProgressValue] = useState(null);
  const [allWeeksDone, setAllWeeksDone] = useState(false);
  const [isCertificateNotSubmitted, setIsCertificateNotSubmitted] = useState(true);
  const [isReportNotSubmitted, setIsReportNotSubmitted] = useState(true);
  const [isOtherNotSubmitted, setIsOtherNotSubmitted] = useState(true);
  const [certificatePdfBuffer, setCertificatePdfBuffer] = useState(null);
  const [reportPdfBuffer, setReportPdfBuffer] = useState(null);
  const [otherPdfBuffer, setOtherPdfBuffer] = useState(null);
  const [sign1, setSign1] = useState(null);
  const [sign2, setSign2] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [iseDate, setISEDate] = useState('');
  const [eseDate, setESEDate] = useState('');

  const handleSubmit1 = async () => {
    const currentDate = new Date().toISOString().split('T')[0];
    if (sign1 != '') {
      window.location.href = c_url + "student/ise/view";
    }
    else {
      if (new Date(iseDate).toISOString().split('T')[0] == currentDate) {
        window.location.href = c_url + "student/ise/workdone";
      }
      else {
        showToast(toast, 'Error', 'error', `${new Date(iseDate).toISOString().split('T')[0] === '1970-01-01' ? `ISE Date not Set` : `Can submit ISE Work Done on ${new Date(iseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}`);
      }
    }
  }

  const handleSubmit2 = async () => {
    const currentDate = new Date().toISOString().split('T')[0];
    if (sign2 != '') {
      window.location.href = c_url + "student/ese/view";
    }
    else {
      if (new Date(eseDate).toISOString().split('T')[0] == currentDate) {
        window.location.href = c_url + "student/ese/workdone";
      }
      else {
        showToast(toast, 'Error', 'error', `${new Date(eseDate).toISOString().split('T')[0] === '1970-01-01' ? `ESE Date not Set` : `Can submit ESE Work Done on ${new Date(eseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}`);
      }
    }
  }

  const fetchData = async () => {
    try {
      const userInfo = await getUser();
      if (userInfo) {
        const currentDate = new Date();
        setName(userInfo.name);
        setEmail(userInfo.email);
        setProfilePicture(userInfo.profile_picture_url);
        setSign1(userInfo.internships[0].evaluation[0].student_sign)
        setSign2(userInfo.internships[0].evaluation[1].student_sign)
        setStudentData(userInfo)
        if (userInfo.internships[0].progress && userInfo.internships[0].progress.length > 0) {
          setOnTimeSubmission(0);
          setNoSubmission(0);
          setLateSubmission(0);
          const updatedProgressData = userInfo.internships[0].progress
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
              else if (!isSubmitted) {
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
          setWeeksDone(updatedProgressData.length);
          setTotalWeeks(parseInt(userInfo.internships[0].duration_in_weeks));
          setProgressValue(((updatedProgressData.length / parseInt(userInfo.internships[0].duration_in_weeks)) * 100).toFixed(2));
          console.log(onTimeSubmission + lateSubmission)
          // setProgressValue2((((onTimeSubmission+lateSubmission)/parseInt(userInfo.internships[0].duration_in_weeks)) * 100).toFixed(2));
          console.log((((onTimeSubmission + lateSubmission) / parseInt(userInfo.internships[0].duration_in_weeks)) * 100).toFixed(2));
          if (currentDate > new Date(userInfo.internships[0].endDate)) {
            setAllWeeksDone(true);
          }
          if (userInfo.internships[0].isCompleted && userInfo.internships[0].completion[0]?.pdf_buffer) {
            setIsCertificateNotSubmitted(false);
            setCertificatePdfBuffer(userInfo.internships[0].completion[0].pdf_buffer);
          }
          if (userInfo.internships[0].isSubmitted && userInfo.internships[0].report[0]?.pdf_buffer) {
            setIsReportNotSubmitted(false);
            setReportPdfBuffer(userInfo.internships[0].report[0].pdf_buffer);
          }
          if (userInfo.internships[0].isSubmittedOther && userInfo.internships[0].othersubmissions[0]?.pdf_buffer) {
            setIsOtherNotSubmitted(false);
            setOtherPdfBuffer(userInfo.internships[0].othersubmissions[0].pdf_buffer);
          }
          setISEDate(userInfo.internships[0].evaluation[0].scheduled_date);
          setESEDate(userInfo.internships[0].evaluation[1].scheduled_date);
        }
        // if (userInfo.internships[0].progress && userInfo.internships[0].progress.length > 0) {
        //   const updatedProgressData = userInfo.internships[0].progress.map((weekInfo, index) => ({
        //     week: index + 1,
        //     status: weekInfo.submitted ? 'Submitted' : 'Not Submitted',
        //     details: `Details for Week ${index + 1}`,
        //     startDate: weekInfo.startDate,
        //     endDate: weekInfo.endDate,
        //     description: weekInfo.description,
        //     late: weekInfo.isLateSubmission
        //   }));

        // }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const WeekComponent = ({ week, generateWeekURL }) => {
    return (
      <Card>
        <button
          className="border border-black-900_19 border-solid flex flex-1 flex-col items-center justify-start rounded-md w-full relative transform transition-transform hover:translate-y-[-2px] hover:shadow-md"
          onClick={() => generateWeekURL(week)}
          style={{backgroundColor: colors.secondary}}
        >
          <div className={`bg-${colors.secondary} flex flex-col h-[164px] md:h-auto items-start justify-start w-full`}>
            <div className={`bg-${colors.secondary} flex flex-col gap-[51px] items-left justify-start pb-[73px] md:pr-10 sm:pr-5 pr-[73px] w-full relative`}>
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
            <text className={`text-${colors.font} text-xs w-full`} size="txtRobotoRegular12Black900">
              Week {week.week}
            </text>
            <text className={`text-base text-${colors.font} w-full`} size="txtRobotoMedium16">
              {week.details}
            </text>
          </div>
        </button></Card>
    );
  };

  return (
    <>
      <div className={`bg-${colors.secondary} flex flex-col font-roboto items-center justify-start mx-auto w-full max-h-full py-6 px-4`}>
        {/* User */}
        <div className={`flex md:flex-col flex-row gap-3 h-[100px] md:h-auto items-center justify-start max-w-[1262px] mx-auto pt-4 md:px-5 w-full mb-3.5`}>
          <div className="flex flex-row justify-start w-full">
            <Avatar size="md" bg='red.700' color="white" name={name} src={profile_url} className="h-10 w-10 mr-2"></Avatar>
            <div className="flex flex-1 flex-col items-start justify-start w-full">
              <text
                className={`text-base text-${colors.font} w-full font-semibold`}
                size="txtRobotoMedium16"
              >
                <h1>{name}</h1>
              </text>
              <text
                className={`text-${colors.font} text-xs w-full`}
                size="txtRobotoRegular12"
              >
                {email}
              </text>
            </div>
            <button className="bg-red-500 hover hover:bg-red-800 text-white px-4 py-2 rounded-md" onClick={openDrawer}>
              View Profile</button>
          </div>
        </div>
        <StudentDrawer isOpen={isDrawerOpen} onClose={closeDrawer} studentData={studentData} />
        <div className="md:pl-6 mx-10 md:mt-3 mb:5 md:pr-6 min-w-full">
          <Tooltip hasArrow label={`${weeksDone} out of ${totalWeeks} weeks done : ${progressValue}% Progress`} placement="top-end">
            <Progress hasStripe value={progressValue} colorScheme='red' isAnimated aria-valuenow={progressValue} />
          </Tooltip>
          <Tooltip hasArrow label={`${onTimeSubmission + lateSubmission} out of ${totalWeeks} weeks submitted : ${(((onTimeSubmission + lateSubmission) / totalWeeks) * 100).toFixed(2)}% Progress`} placement="top-end">
            <Progress hasStripe value={(((onTimeSubmission + lateSubmission) / totalWeeks) * 100).toFixed(2)} colorScheme='green' isAnimated className="mb-3" aria-valuenow={(((onTimeSubmission + lateSubmission) / totalWeeks) * 100).toFixed(2)} />
          </Tooltip>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} className="mb-5">
            <Stat bg="green.100" p={4} borderRadius="md">
              <StatLabel>On Time Submissions</StatLabel>
              <StatNumber>{onTimeSubmission}</StatNumber>
              <StatHelpText>Count of OnTime weekly updates</StatHelpText>
            </Stat>
            <Stat bg="red.100" p={4} borderRadius="md">
              <StatLabel>Missed Submissions</StatLabel>
              <StatNumber>{noSubmission == 0 ? 0 : noSubmission}</StatNumber>
              <StatHelpText>Count of weekly updates not yet submitted</StatHelpText>
            </Stat>
            <Stat bg="orange.100" p={4} borderRadius="md">
              <StatLabel>Late Submissions</StatLabel>
              <StatNumber>{lateSubmission}</StatNumber>
              <StatHelpText>Count of weekly updates submitted after week deadline </StatHelpText>
            </Stat>
          </SimpleGrid>
        </div>
        <div className="flex flex-col h-[269px] md:h-auto items-center justify-center max-w-[1262px] mt-[13px] mx-auto md:px-5 w-full">
          <div className="flex flex-col items-center justify-center px-3 w-full">
            <div className="overflow-y-auto max-h-[230px] md:max-h-[none] w-full">
              <div className="sm:flex-col flex-row gap-5 grid sm:grid-cols-2 md:grid-cols-2 grid-cols-1 justify-start w-full">

                {progressData.map((week) => (
                  <WeekComponent key={week.week} week={week} generateWeekURL={generateWeekURL} />
                ))}
                {/* {progressData.map((week) => (
                  <WeekCarousel key={week.week} weeks={[week]} generateWeekURL={generateWeekURL} />
                ))} */}

              </div>
            </div>
          </div>
        </div><hr className={`mt-5 border-${colors.accent} w-full`} />
        <div className="mt-5 font-bold text-lg">Evaluation Details</div>
        <div className="flex flex-col h-[269px] md:h-auto items-center justify-center max-w-[1262px] mt-[13px] mx-auto md:px-5 w-full">
          <div className="flex flex-col items-center justify-center px-3 w-full">
            <div className="overflow-y-auto max-h-[230px] md:max-h-[none] w-full">
              <div className="sm:flex-col flex-row gap-5 grid sm:grid-cols-2 md:grid-cols-2 grid-cols-1 justify-start w-full">
                <Card bg={colors.hover}>
                  <button
                    className={`bg-${colors.secondary} border border-black-900_19 border-solid flex flex-1 flex-col items-center justify-start rounded-md w-full relative transform transition-transform hover:translate-y-[-2px] hover:shadow-md`}
                    onClick={handleSubmit1}
                  >
                    <div className="flex flex-col gap-1 items-start justify-start p-2 w-full">
                      <text className={`text-${colors.font} font-semibold text-md w-full`} size="txtRobotoRegular12Black900">
                        ISE Work Done
                      </text>
                    </div>
                  </button>
                </Card>
                <Card bg={colors.hover}>
                  <button
                    className={`bg-${colors.secondary} border border-black-900_19 border-solid flex flex-1 flex-col items-center justify-start rounded-md w-full relative transform transition-transform hover:translate-y-[-2px] hover:shadow-md`}
                    onClick={handleSubmit2}
                  >
                    <div className="flex flex-col gap-1 items-start justify-start p-2 w-full">
                      <text className={`text-${colors.font} font-semibold text-md w-full`} size="txtRobotoRegular12Black900">
                        ESE Work Done
                      </text>
                    </div>
                  </button>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <hr className={`mt-5 border-${colors.accent} w-full`} />
        <div className="flex flex-col sm:flex-row gap-3">
          {isCertificateNotSubmitted ? (
            <button
              type="submit"
              className="flex-1 mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
              onClick={handleCompletionSubmission}
            >
              Certificate Submission
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
              onClick={getCertificate}
            >
              View Submitted Certificate
            </button>
          )}
          {isReportNotSubmitted ? (
            <button
              type="submit"
              className="flex-1 mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
              onClick={handleReportSubmission}
            >
              Report Submission
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
              onClick={getReport}
            >
              View Submitted Report
            </button>
          )}
          {isOtherNotSubmitted ? (
            <button
              type="submit"
              className="flex-1 mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
              onClick={handleOtherSubmission}
            >
              Other Outcome Submissions
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
              onClick={getOther}
            >
              View Submission
            </button>
          )}
        </div>

      </div>
    </>
  );
};

export default FramePage;