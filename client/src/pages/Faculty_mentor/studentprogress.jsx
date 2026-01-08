import React, { useState } from "react";
import { useEffect } from 'react';
import { useRef } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import BackButton from '../../components/BackButton/BackButton';
import { useParams } from 'react-router-dom';
import { useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
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
  Tooltip,
  Progress,
  Stat,
  SimpleGrid,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react'
import axios from 'axios';
import { url, c_url } from '../../Global/URL';
import StatWeek from './statweek.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    if (week.submitted == true) {
      localStorage.setItem('week', week.week);
      const weekURL = c_url + 'mentor/studentprogress/feedback';
      window.location.href = weekURL;
    }
    else if (week.submitted == false) {
      showToast(toast, 'Error', 'error', 'Update Not yet Submitted');
    }
    else if (week.status == 'Submitted') {
      localStorage.setItem('week', week.week);
      const weekURL = c_url + 'mentor/studentprogress/feedback';
      window.location.href = weekURL;
    }
    else if (week.status == 'Not Submitted') {
      showToast(toast, 'Error', 'error', 'Update Not yet Submitted');
    }
  }

  const handleISEButtonClick = () => {
    window.location.href = c_url + 'mentor/studentprogress/evaluation/ise';
  };

  const handleESEButtonClick = () => {
    window.location.href = c_url + 'mentor/studentprogress/evaluation/ese';
  };

  const getEvaluationSheet = async (evaluation) => {
    const pdfBuffer = (evaluation == 'ISE' ? isePdfBuffer.data : esePdfBuffer.data);
    const uint8Array = new Uint8Array(pdfBuffer);
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
  }

  // new states for modals & confirmations
  const [isMarksheetModalOpen, setIsMarksheetModalOpen] = useState(false);
  const [isWeekDetailsModalOpen, setIsWeekDetailsModalOpen] = useState(false);
  const [isISEModalOpen, setISEModalOpen] = useState(false);
  const [isESEModalOpen, setESEModalOpen] = useState(false);
  const [isEvaluationModalOpen, setEvaluationModalOpen] = useState(false);

  // confirmation states for date picking
  const [pendingIseDate, setPendingIseDate] = useState(null); // Date object chosen in datepicker but not confirmed
  const [pendingEseDate, setPendingEseDate] = useState(null);
  const [isIseConfirmOpen, setIseConfirmOpen] = useState(false);
  const [isEseConfirmOpen, setEseConfirmOpen] = useState(false);

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
  const [onTimeSubmissionData, setOnTimeSubmissionData] = useState([]);
  const [noSubmissionData, setNoSubmissionData] = useState([]);
  const [lateSubmissionData, setLateSubmissionData] = useState([]);
  const [weeksDone, setWeeksDone] = useState(null);
  const [totalWeeks, setTotalWeeks] = useState(null);
  const [progressValue, setProgressValue] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [isISESigned, setIsISESigned] = useState(false);
  const [isESESigned, setIsESESigned] = useState(false);
  const [isePdfBuffer, setISEPdfBuffer] = useState(null);
  const [esePdfBuffer, setESEPdfBuffer] = useState(null);
  const [isCertificateSubmitted, setIsCertificateSubmitted] = useState(false);
  const [certificatePdfBuffer, setCertificatePdfBuffer] = useState(null);
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);
  const [reportPdfBuffer, setReportPdfBuffer] = useState(null);
  const [isOtherSubmitted, setIsOtherSubmitted] = useState(false);
  const [otherPdfBuffer, setOtherPdfBuffer] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [modalType, setModalType] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [iseDate, setISEDate] = useState('');
  const [eseDate, setESEDate] = useState('');
  // const dateInputRef = useRef(null);

  const viewUser = (studentData) => {
    setStudentData(studentData);
    setIsDrawerOpen(true);
  };
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  const toast = useToast();

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
        const studentData = response.data.data;
        const currentstudent = studentData[0]
        setStudentData(currentstudent)
        const student = response.data.data[0];
        setStudentName(student.name);
        setStudentEmail(student.email);
        setStudentProfilePicture(student.profile_picture_url);
        if (student?.internships?.[0]?.evaluation?.[0]?.pdf_buffer !== undefined) {
          setISEPdfBuffer(student.internships[0].evaluation[0].pdf_buffer);
        }
        if (student?.internships?.[0]?.evaluation?.[1]?.pdf_buffer !== undefined) {
          setESEPdfBuffer(student.internships[0].evaluation[1].pdf_buffer);
        }
        setIsISESigned(student.internships[0].evaluation[0]?.is_signed);
        setIsESESigned(student.internships[0].evaluation[1]?.is_signed);
        if (student.internships[0].progress && student.internships[0].progress.length > 0) {
          setOnTimeSubmission(0);
          setNoSubmission(0);
          setLateSubmission(0);
          setOnTimeSubmissionData([]);
          setNoSubmissionData([]);
          setLateSubmissionData([]);
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
                setOnTimeSubmissionData(prevData => [...prevData, weekInfo]);
                setOnTimeSubmission(prevValue => (prevValue === null ? 1 : prevValue + 1));
              }
              else if (!isSubmitted) {
                setNoSubmissionData(prevData => [...prevData, weekInfo]);
                setNoSubmission(prevValue => (prevValue === null ? 1 : prevValue + 1));
              }
              if (isSubmitted && isLateSubmission) {
                setLateSubmissionData(prevData => [...prevData, weekInfo]);
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
          setTotalWeeks(parseInt(student.internships[0].duration_in_weeks));
          setProgressValue(((updatedProgressData.length / parseInt(student.internships[0].duration_in_weeks)) * 100).toFixed(2));
          if (student.internships[0].isCompleted && student.internships[0].completion[0]?.pdf_buffer) {
            setIsCertificateSubmitted(true);
            setCertificatePdfBuffer(student.internships[0].completion[0].pdf_buffer);
          }
          if (student.internships[0].isSubmitted && student.internships[0].report[0]?.pdf_buffer) {
            setIsReportSubmitted(true);
            setReportPdfBuffer(student.internships[0].report[0].pdf_buffer);
          }
          if (student.internships[0].isSubmittedOther && student.internships[0].othersubmissions[0]?.pdf_buffer) {
            setIsOtherSubmitted(true);
            setOtherPdfBuffer(student.internships[0].othersubmissions[0].pdf_buffer);
          }
          // set display-friendly ISE/ESE date strings if valid
          const rawIse = student.internships[0].evaluation[0].scheduled_date;
          const rawEse = student.internships[0].evaluation[1].scheduled_date;
          setISEDate(rawIse ? new Date(rawIse).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null);
          setESEDate(rawEse ? new Date(rawEse).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStatSubmission = async (weekData) => {
    if (weekData.length == 0) {
      showToast(toast, 'Error', 'error', 'No weeks are currently to be shown');
    } else {
      setModalData(weekData);
      setIsWeekDetailsModalOpen(true);
    }
  }

  // inside studentprogress.jsx - existing handlers (kept)
  const handleISEDateChange = async (date) => {
    try {
      const student_id = localStorage.getItem('student');
      // convert to UTC yyyy-mm-dd
      const utcDate = date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) : null;
      const iseDate = utcDate ? utcDate.toISOString().split('T')[0] : null;

      const data = {
        sub_id: student_id,
        date: iseDate,
        evaluation: 'ISE'
      };

      const response = await axios.post(url + `/mentor/student/evaluation/setdate`, data);

      if (response.status === 200) {
        showToast(toast, 'Success', 'success', 'ISE Date set successfully');

        // dispatch a custom event so other parts of app can react immediately
        window.dispatchEvent(new CustomEvent('evaluationDateChanged', {
          detail: {
            evaluation: 'ISE',
            date: iseDate,
            student_id: student_id
          }
        }));

        // optional: update local state in this component (you already do)
        fetchData(); // keep this if you want to refresh local view here too
      } else {
        showToast(toast, 'Error', 'error', 'Failed to set ISE date');
      }
    } catch (err) {
      console.error(err);
      showToast(toast, 'Error', 'error', 'Failed to set ISE date');
    }
  };

  const handleESEDateChange = async (date) => {
    try {
      const student_id = localStorage.getItem('student');
      // convert to UTC yyyy-mm-dd (server expects this)
      const utcDate = date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) : null;
      const eseDate = utcDate ? utcDate.toISOString().split('T')[0] : null;

      const data = {
        sub_id: student_id,
        date: eseDate,
        evaluation: 'ESE'
      };

      const response = await axios.post(url + `/mentor/student/evaluation/setdate`, data);

      if (response.status === 200) {
        showToast(toast, 'Success', 'success', 'ESE Date set successfully');

        // --- NEW: broadcast change app-wide so ESE page can react immediately ---
        window.dispatchEvent(new CustomEvent('evaluationDateChanged', {
          detail: {
            evaluation: 'ESE',
            date: eseDate,
            student_id: student_id
          }
        }));

        // optional: refresh local view in this component
        fetchData();
      } else {
        showToast(toast, 'Error', 'error', 'Failed to set ESE date');
      }
    } catch (err) {
      console.error('handleESEDateChange error:', err);
      showToast(toast, 'Error', 'error', 'Failed to set ESE date');
    }
  };

  const getCertificate = async () => {
    if (!certificatePdfBuffer?.data) return showToast(toast, 'Error', 'error', 'Certificate not available');
    const uint8Array = new Uint8Array(certificatePdfBuffer.data);
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
  }

  const getReport = async () => {
    if (!reportPdfBuffer?.data) return showToast(toast, 'Error', 'error', 'Report not available');
    const uint8Array = new Uint8Array(reportPdfBuffer.data);
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
  }

  const getOther = async () => {
    if (!otherPdfBuffer?.data) return showToast(toast, 'Error', 'error', 'Other outcome not available');
    const uint8Array = new Uint8Array(otherPdfBuffer.data);
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
  }

  useEffect(() => {
    fetchData();
  }, []);

  // NEW: handlers for DatePicker selection -> open confirm modal
  const onIseSelected = (date) => {
    setPendingIseDate(date);
    setIseConfirmOpen(true);
  };

  const onEseSelected = (date) => {
    setPendingEseDate(date);
    setEseConfirmOpen(true);
  };

  const confirmIseDate = async () => {
    if (!pendingIseDate) {
      setIseConfirmOpen(false);
      return;
    }
    await handleISEDateChange(pendingIseDate);
    setPendingIseDate(null);
    setIseConfirmOpen(false);
  };

  const cancelIseConfirm = () => {
    setPendingIseDate(null);
    setIseConfirmOpen(false);
  };

  const confirmEseDate = async () => {
    if (!pendingEseDate) {
      setEseConfirmOpen(false);
      return;
    }
    await handleESEDateChange(pendingEseDate);
    setPendingEseDate(null);
    setEseConfirmOpen(false);
  };

  const cancelEseConfirm = () => {
    setPendingEseDate(null);
    setEseConfirmOpen(false);
  };

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
              <div
                className={`justify-center p-1 rounded-br-md rounded-tl-md text-xs font-semibold w-auto ${week.description ?
                  (week.late ? "text-orange-600" : (week.status === "Submitted" ? "text-green-700" : "text-red-900"))
                  : "text-red-700"
                  }`}
                style={{ position: 'absolute', top: 5, left: 5, backgroundColor: colors.secondary2 }}
              >
                {week.description ?
                  (week.late ? "Late Submission" : week.status)
                  : "Not Submitted"
                }
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-start justify-start p-2 w-full">
            <div className={`text-${colors.font} text-xs w-full`}>
              Week {week.week}
            </div>
            <div className={`text-base text-${colors.font} w-full`}>
              {week.details}
            </div>
          </div>
        </button>
      </Card>
    );
  };
  const isStudentDataAvailable = Object.keys(studentData).length > 0;
  console.log(isStudentDataAvailable)

  return (
    <>
      {/* ISE confirm modal */}
      <Modal isOpen={isIseConfirmOpen} onClose={cancelIseConfirm} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm ISE Date</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Do you want to set the ISE date to <strong>{pendingIseDate ? new Date(pendingIseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</strong>?</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={cancelIseConfirm}>Cancel</Button>
            <Button colorScheme="red" onClick={confirmIseDate}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ESE confirm modal */}
      <Modal isOpen={isEseConfirmOpen} onClose={cancelEseConfirm} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm ESE Date</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Do you want to set the ESE date to <strong>{pendingEseDate ? new Date(pendingEseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</strong>?</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={cancelEseConfirm}>Cancel</Button>
            <Button colorScheme="red" onClick={confirmEseDate}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Week Details Modal */}
      <Modal isOpen={isWeekDetailsModalOpen} onClose={() => setIsWeekDetailsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Week Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalData.map((week, index) => (
              <Card key={index} className="mb-3">
                <button className={`p-3 border border-${colors.accent} rounded-md w-full relative transform transition-transform hover:translate-y-[-2px] hover:shadow-md`}
                  onClick={() => generateWeekURL(week)}>
                  <h2>Week: {week.week}</h2>
                  <p>Start Date: {(week.startDate).substring(0, 10)}</p>
                  <p>End Date: {(week.endDate).substring(0, 10)}</p>
                </button>
              </Card>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsWeekDetailsModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Marksheet Options Modal */}
      <Modal isOpen={isMarksheetModalOpen} onClose={() => setIsMarksheetModalOpen(false)} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Marksheet Options</ModalHeader>
          <ModalCloseButton />
          <style>
            {`
              .chakra-modal__content {
                max-width: 350px !important;
                width: 90vw !important;
              }
              .chakra-modal__body .flex > button {
                min-width: 120px;
                max-width: 290px;
                width: 100%;
                margin-bottom: 8px;
              }
            `}
          </style>
          <ModalBody>
            <div className="flex flex-col gap-3">
              <button
                className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-md ml-2"
                onClick={() => {
                  setIsMarksheetModalOpen(false);
                  setEvaluationModalOpen(true);
                }}
              >
                View ISE/ESE Marksheet
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded-md ml-2"
                onClick={() => {
                  setIsMarksheetModalOpen(false);
                  setISEModalOpen(true);
                }}
              >
                View ISE Marksheet
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded-md ml-2"
                onClick={() => {
                  setIsMarksheetModalOpen(false);
                  setESEModalOpen(true);
                }}
              >
                View ESE Marksheet
              </button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsMarksheetModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ISE Modal */}
      <Modal isOpen={isISEModalOpen} onClose={() => setISEModalOpen(false)} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ISE Marksheet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isePdfBuffer ? (
              <iframe
                title="ISE Marksheet"
                src={URL.createObjectURL(new Blob([new Uint8Array(isePdfBuffer.data)], { type: 'application/pdf' }))}
                width="100%"
                height="400px"
                style={{ border: '1px solid #ccc' }}
              />
            ) : (
              <div className="text-red-500">ISE Marksheet not available</div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                if (isePdfBuffer) {
                  const uint8Array = new Uint8Array(isePdfBuffer.data);
                  const blob = new Blob([uint8Array], { type: 'application/pdf' });
                  const pdfUrl = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = pdfUrl;
                  link.download = `ISE_Marksheet_${studentName.replace(/\s+/g, '_')}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(pdfUrl);
                } else {
                  showToast(toast, 'Error', 'error', 'ISE Marksheet not available');
                }
              }}
            >
              Download ISE Marksheet
            </Button>
            <Button variant="ghost" onClick={() => setISEModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ESE Modal */}
      <Modal isOpen={isESEModalOpen} onClose={() => setESEModalOpen(false)} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ESE Marksheet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {esePdfBuffer ? (
              <iframe
                title="ESE Marksheet"
                src={URL.createObjectURL(new Blob([new Uint8Array(esePdfBuffer.data)], { type: 'application/pdf' }))}
                width="100%"
                height="400px"
                style={{ border: '1px solid #ccc' }}
              />
            ) : (
              <div className="text-red-500">ESE Marksheet not available</div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                if (esePdfBuffer) {
                  const uint8Array = new Uint8Array(esePdfBuffer.data);
                  const blob = new Blob([uint8Array], { type: 'application/pdf' });
                  const pdfUrl = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = pdfUrl;
                  link.download = `ESE_Marksheet_${studentName.replace(/\s+/g, '_')}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(pdfUrl);
                } else {
                  showToast(toast, 'Error', 'error', 'ESE Marksheet not available');
                }
              }}
            >
              Download ESE Marksheet
            </Button>
            <Button variant="ghost" onClick={() => setESEModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Evaluation Modal */}
      <Modal isOpen={isEvaluationModalOpen} onClose={() => setEvaluationModalOpen(false)} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ISE & ESE Marksheet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-semibold mb-2">ISE Marksheet</h2>
                {isePdfBuffer ? (
                  <iframe
                    title="ISE Marksheet"
                    src={URL.createObjectURL(new Blob([new Uint8Array(isePdfBuffer.data)], { type: 'application/pdf' }))}
                    width="100%"
                    height="400px"
                    style={{ border: '1px solid #ccc' }}
                  />
                ) : (
                  <div className="text-red-500">ISE Marksheet not available</div>
                )}
              </div>
              <div>
                <h2 className="font-semibold mb-2">ESE Marksheet</h2>
                {esePdfBuffer ? (
                  <iframe
                    title="ESE Marksheet"
                    src={URL.createObjectURL(new Blob([new Uint8Array(esePdfBuffer.data)], { type: 'application/pdf' }))}
                    width="100%"
                    height="400px"
                    style={{ border: '1px solid #ccc' }}
                  />
                ) : (
                  <div className="text-red-500">ESE Marksheet not available</div>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                if (isePdfBuffer) {
                  const uint8Array = new Uint8Array(isePdfBuffer.data);
                  const blob = new Blob([uint8Array], { type: 'application/pdf' });
                  const pdfUrl = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = pdfUrl;
                  link.download = `ISE_Marksheet_${studentName.replace(/\s+/g, '_')}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(pdfUrl);
                } else {
                  showToast(toast, 'Error', 'error', 'ISE Marksheet not available');
                }
              }}
            >
              Download ISE Marksheet
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                if (esePdfBuffer) {
                  const uint8Array = new Uint8Array(esePdfBuffer.data);
                  const blob = new Blob([uint8Array], { type: 'application/pdf' });
                  const pdfUrl = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = pdfUrl;
                  link.download = `ESE_Marksheet_${studentName.replace(/\s+/g, '_')}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(pdfUrl);
                } else {
                  showToast(toast, 'Error', 'error', 'ESE Marksheet not available');
                }
              }}
            >
              Download ESE Marksheet
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className={`bg-${colors.secondary2} flex flex-col font-roboto items-center justify-start mx-auto w-full max-h-full py-6 px-4`}>
        <div className="w-full max-w-[1262px]">
          <BackButton to="/mentor/home" label="Back to home" />
        </div>
        <div className={`flex flex-col gap-3 h-[100px] md:h-auto md:items-center max-w-[1262px] mx-auto pt-4 md:px-5 w-full mb-3.5`}>
          <div className="items-start">
            <div className={`text-base text-${colors.font} w-full md:text-xl`}>
              <h1>{department}</h1>
            </div>
          </div>
          <div className="flex items-center justify-start w-full">
            <Avatar size="md" bg='red.700' color="white" name={mentorName} src={mentor_profile_url} className="h-10 w-10 mr-2" />
            <div className="flex flex-col">
              <h1 className={`text-base text-${colors.font} font-semibold`}>{mentorName}</h1>
              <p className={`text-${colors.font} text-xs`}>{mentorEmail}</p>
            </div>
          </div>
        </div>
        <div className="md:pl-6 mx-10 mt-3 mb:3 my-auto md:pr-6 min-w-full">
          <hr className={`border border-${colors.accent}`} />
        </div>
        <div className={`flex flex-col h-[27px] md:h-auto items-center justify-start max-w-[1262px] mx-auto mb-3.5 pt-4 md:px-5 w-full`}>
          <div className="flex flex-col items-start justify-start w-full">
            <div className={`text-${colors.font} text-lg w-full`}>Internship Progress</div>
          </div>
        </div>
        <div className="flex md:flex-col flex-row gap-3 h-[100px] md:h-auto items-center justify-between max-w-[1262px] mx-auto pt-4 md:px-5 w-full mb-3.5">
          <div className="flex flex-row justify-start w-full">
            <Avatar size="md" bg='red.700' color="white" name={studentName} src={student_profile_url} className="h-10 w-10 mr-2"></Avatar>
            <div className="flex flex-1 flex-col items-start justify-start w-full">
              <div className={`text-base text-${colors.font} w-full font-semibold`}>
                <h1>{studentName}</h1>
              </div>
              <div className={`text-${colors.font} text-xs w-full`}>
                {studentEmail}
              </div>
            </div>

            <button className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-md" onClick={openDrawer}>
              View Profile
            </button>

            <button
              className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-md ml-2"
              onClick={() => setIsMarksheetModalOpen(true)}
            >
              View Marksheet
            </button>

            <Modal isOpen={isOpen && modalType === 'marksheet'} onClose={onClose} size="2xl">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Marksheet Options</ModalHeader>
                <ModalCloseButton />
                <style>
                  {`
                    .chakra-modal__content {
                      max-width: 350px !important;
                      width: 90vw !important;
                    }
                    .chakra-modal__body .flex > button {
                      min-width: 120px;
                      max-width: 290px;
                      width: 100%;
                      margin-bottom: 8px;
                    }
                  `}
                </style>
                <ModalCloseButton />
                <ModalBody>
                  <div className="flex flex-col gap-3">
                    <button
                      className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-md ml-2"
                      onClick={() => {
                        setModalType('evaluation');
                      }}
                    >
                      View ISE/ESE Marksheet
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded-md ml-2"
                      onClick={() => {
                        setModalType('ise');
                      }}
                    >
                      View ISE Marksheet
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded-md ml-2"
                      onClick={() => {
                        setModalType('ese');
                      }}
                    >
                      View ESE Marksheet
                    </button>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Modal isOpen={isOpen && modalType === 'ise'} onClose={onClose} size="4xl">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>ISE Marksheet</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {isePdfBuffer ? (
                    <iframe
                      title="ISE Marksheet"
                      src={URL.createObjectURL(new Blob([new Uint8Array(isePdfBuffer.data)], { type: 'application/pdf' }))}
                      width="100%"
                      height="400px"
                      style={{ border: '1px solid #ccc' }}
                    />
                  ) : (
                    <div className="text-red-500">ISE Marksheet not available</div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      if (isePdfBuffer) {
                        const uint8Array = new Uint8Array(isePdfBuffer.data);
                        const blob = new Blob([uint8Array], { type: 'application/pdf' });
                        const pdfUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = pdfUrl;
                        link.download = `ISE_Marksheet_${studentName.replace(/\s+/g, '_')}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(pdfUrl);
                      } else {
                        showToast(toast, 'Error', 'error', 'ISE Marksheet not available');
                      }
                    }}
                  >
                    Download ISE Marksheet
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Modal isOpen={isOpen && modalType === 'ese'} onClose={onClose} size="4xl">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>ESE Marksheet</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {esePdfBuffer ? (
                    <iframe
                      title="ESE Marksheet"
                      src={URL.createObjectURL(new Blob([new Uint8Array(esePdfBuffer.data)], { type: 'application/pdf' }))}
                      width="100%"
                      height="400px"
                      style={{ border: '1px solid #ccc' }}
                    />
                  ) : (
                    <div className="text-red-500">ESE Marksheet not available</div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      if (esePdfBuffer) {
                        const uint8Array = new Uint8Array(esePdfBuffer.data);
                        const blob = new Blob([uint8Array], { type: 'application/pdf' });
                        const pdfUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = pdfUrl;
                        link.download = `ESE_Marksheet_${studentName.replace(/\s+/g, '_')}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(pdfUrl);
                      } else {
                        showToast(toast, 'Error', 'error', 'ESE Marksheet not available');
                      }
                    }}
                  >
                    Download ESE Marksheet
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Modal isOpen={isOpen && modalType === 'evaluation'} onClose={onClose} size="4xl">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>ISE & ESE Marksheet</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <div className="flex flex-col gap-6">
                    <div>
                      <h2 className="font-semibold mb-2">ISE Marksheet</h2>
                      {isePdfBuffer ? (
                        <iframe
                          title="ISE Marksheet"
                          src={URL.createObjectURL(new Blob([new Uint8Array(isePdfBuffer.data)], { type: 'application/pdf' }))}
                          width="100%"
                          height="400px"
                          style={{ border: '1px solid #ccc' }}
                        />
                      ) : (
                        <div className="text-red-500">ISE Marksheet not available</div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold mb-2">ESE Marksheet</h2>
                      {esePdfBuffer ? (
                        <iframe
                          title="ESE Marksheet"
                          src={URL.createObjectURL(new Blob([new Uint8Array(esePdfBuffer.data)], { type: 'application/pdf' }))}
                          width="100%"
                          height="400px"
                          style={{ border: '1px solid #ccc' }}
                        />
                      ) : (
                        <div className="text-red-500">ESE Marksheet not available</div>
                      )}
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      if (isePdfBuffer) {
                        const uint8Array = new Uint8Array(isePdfBuffer.data);
                        const blob = new Blob([uint8Array], { type: 'application/pdf' });
                        const pdfUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = pdfUrl;
                        link.download = `ISE_Marksheet_${studentName.replace(/\s+/g, '_')}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(pdfUrl);
                      } else {
                        showToast(toast, 'Error', 'error', 'ISE Marksheet not available');
                      }
                    }}
                  >
                    Download ISE Marksheet
                  </Button>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      if (esePdfBuffer) {
                        const uint8Array = new Uint8Array(esePdfBuffer.data);
                        const blob = new Blob([uint8Array], { type: 'application/pdf' });
                        const pdfUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = pdfUrl;
                        link.download = `ESE_Marksheet_${studentName.replace(/\s+/g, '_')}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(pdfUrl);
                      } else {
                        showToast(toast, 'Error', 'error', 'ESE Marksheet not available');
                      }
                    }}
                  >
                    Download ESE Marksheet
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

          </div>
        </div>
        <StudentDrawer isOpen={isDrawerOpen} onClose={closeDrawer} studentData={studentData} />
        <div className="md:pl-6 mx-10 md:mt-3 mb:5 md:pr-6 min-w-full">
          <div className="flex flex-col gap-3">
            <Tooltip hasArrow label={`${weeksDone} out of ${totalWeeks} weeks done : ${progressValue}% Progress`} placement="bottom-end">
              <Progress hasStripe value={progressValue} colorScheme='red' isAnimated aria-valuenow={progressValue} borderWidth="1px" borderColor={colors.accent} borderRadius="md" />
            </Tooltip>
            <Tooltip hasArrow label={`${onTimeSubmission + lateSubmission} out of ${totalWeeks} weeks submitted : ${(((onTimeSubmission + lateSubmission) / totalWeeks) * 100).toFixed(2)}% Progress`} placement="top-end">
              <Progress hasStripe value={(((onTimeSubmission + lateSubmission) / totalWeeks) * 100).toFixed(2)} colorScheme='green' isAnimated aria-valuenow={(((onTimeSubmission + lateSubmission) / totalWeeks) * 100).toFixed(2)} borderWidth="1px" borderColor={colors.accent} borderRadius="md" />
            </Tooltip>
          </div>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} className="mb-5 mt-2">
            <Stat bg="green.500" p={4} borderRadius="md" onClick={() => getStatSubmission(onTimeSubmissionData)}>
              <StatLabel>On Time Submissions</StatLabel>
              <StatNumber>{onTimeSubmission}</StatNumber>
              <StatHelpText>Count of OnTime weekly updates</StatHelpText>
            </Stat>
            <Stat bg="red.500" p={4} borderRadius="md" onClick={() => getStatSubmission(noSubmissionData)}>
              <StatLabel>Missed Submissions</StatLabel>
              <StatNumber>{noSubmission == 0 ? 0 : noSubmission}</StatNumber>
              <StatHelpText>Count of weekly updates not yet submitted</StatHelpText>
            </Stat>
            <Stat bg="orange.100" p={4} borderRadius="md" onClick={() => getStatSubmission(lateSubmissionData)}>
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
              </div>
            </div>
          </div>
        </div>
        <h1 className="mt-10">Evaluation</h1>
        <div className="flex flex-col sm:flex-row gap-5">
          <DatePicker
            onChange={onIseSelected}
            placeholderText={`${iseDate ? `ISE Date: ${iseDate}` : 'Set ISE Date'}`}
            className={`flex-1 mt-5 placeholder-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center`}
          />
          <DatePicker
            onChange={onEseSelected}
            placeholderText={`${eseDate ? `ESE Date: ${eseDate}` : 'Set ESE Date'}`}
            className={`flex-1 mt-5 placeholder-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center`}
          />
        </div>
        <div className="flex gap-10">
          {isISESigned ? (
            <button type="submit" className="flex-1 mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center" onClick={() => getEvaluationSheet('ISE')}>
              View ISE Evalutation Sheet
            </button>
          ) : (
            <button type="submit" className="flex-1 mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center" onClick={handleISEButtonClick}>
              ISE
            </button>)}
          {isESESigned ? (
            <button type="submit" className="flex-1 mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center" onClick={() => getEvaluationSheet('ESE')}>
              View ESE Evalutation Sheet
            </button>
          ) : (
            <button type="submit" className="flex-1 mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center" onClick={handleESEButtonClick}>
              ESE
            </button>)}
        </div>
        {isCertificateSubmitted ? (<div>
          <h1 className="mt-10">Internship Completion Certificate</h1>
          <div className="flex gap-10">
            <button type="submit" className="flex-1 mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center" onClick={getCertificate}>
              View Submitted Certificate
            </button>
          </div>
        </div>) : (<div></div>)}
        {isReportSubmitted ? (<div>
          <h1 className="mt-10">Internship Report</h1>
          <div className="flex gap-10">
            <button type="submit" className="flex-1 mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center" onClick={getReport}>
              View Submitted Report
            </button>
          </div>
        </div>) : (<div></div>)}
        {isOtherSubmitted ? (<div>
          <h1 className="mt-10">Other Outcomes</h1>
          <div className="flex gap-10">
            <button type="submit" className="flex-1 mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center" onClick={getOther}>
              View Other Outcomes
            </button>
          </div>
        </div>) : (<div></div>)}
      </div>
    </>
  );
};

export default Week;

