import React, { useState, useEffect } from "react";
import { useTheme } from "../../Global/ThemeContext";
import { useNavigate } from "react-router-dom";
import showToast from "../../Global/Toast";
import BackButton from "../../components/BackButton/BackButton";
import { useToast } from "@chakra-ui/react";
import StudentDrawer from "./studentdrawer.jsx";
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
} from "@chakra-ui/react";
import axios from "axios";
import { url, c_url } from "../../Global/URL";
import Alert from "../../components/Alert/alert";

const Progress = () => {
  // UI state
  const [isEditingEvaluation, setIsEditingEvaluation] = useState(false);
  const [name, setName] = useState("");
  const [mentorName, setMentorName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState(""); // yyyy-mm-dd
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [title, setTitle] = useState("");
  const [workdone, setWorkdone] = useState("");
  const [qreport, setQReport] = useState("");
  const [oral, setOral] = useState("");
  const [qwork, setQWork] = useState("");
  const [understanding, setUnderstanding] = useState("");
  const [interaction, setInteraction] = useState("");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [toFill, setToFill] = useState(true);
  const [pdfBuffer, setPdfBuffer] = useState(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [studentSignature, setStudentSignature] = useState("");
  const [showFileModal, setshowFileModal] = useState(false);
  const [showDataModal, setshowDataModal] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // validation flags
  const [isQReportValid, setIsQReportValid] = useState(true);
  const [isOralValid, setIsOralValid] = useState(true);
  const [isQWorkValid, setIsQWorkValid] = useState(true);
  const [isUnderstandingValid, setIsUnderstandingValid] = useState(true);
  const [isInteractionValid, setIsInteractionValid] = useState(true);

  const navigate = useNavigate();
  const { theme: colors } = useTheme();
  const toast = useToast();
  const accessToken = localStorage.getItem("IMPaccessToken");

  // ---------- helpers ----------
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  function calculateWeeks(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const difference = end - start;
    const weeks = Math.ceil(difference / (1000 * 60 * 60 * 24 * 7));
    return parseInt(weeks || 0);
  }

  // safer setInteraction wrapper
  const safeSetInteraction = (val) => {
    try {
      setInteraction(val);
    } catch (err) {
      console.warn("safeSetInteraction failed", err);
    }
  };

  // calc periodic marks (defensive)
  const calcPeriodicMarks = async (weeks = [], buffer = 0) => {
    if (!Array.isArray(weeks) || weeks.length === 0) {
      console.warn("calcPeriodicMarks: weeks is empty or not an array", weeks);
      safeSetInteraction(0);
      return 0;
    }

    const onTimeWeeks = Math.min(Number(buffer) || 0, weeks.length);

    const laterSubmissions = weeks.slice(onTimeWeeks).filter((submission) => {
      if (!submission) return false;
      return !submission.isLateSubmission && submission.submitted;
    }).length;

    const onTimeSubmissions = laterSubmissions + onTimeWeeks;
    const percentageMarks = Number(
      ((onTimeSubmissions / weeks.length) * 100).toFixed(2)
    );

    const percentageMarksTable = [
      { percentage: 100, marks: 20 },
      { percentage: 92.86, marks: 18 },
      { percentage: 85.71, marks: 16 },
      { percentage: 78.57, marks: 16 },
      { percentage: 71.43, marks: 14 },
      { percentage: 64.29, marks: 12 },
      { percentage: 57.14, marks: 12 },
      { percentage: 50.0, marks: 10 },
      { percentage: 42.86, marks: 8 },
      { percentage: 35.71, marks: 8 },
      { percentage: 28.57, marks: 6 },
      { percentage: 21.43, marks: 6 },
      { percentage: 14.29, marks: 4 },
      { percentage: 7.14, marks: 2 },
      { percentage: 0.0, marks: 0 },
    ];

    const matchingEntry =
      percentageMarksTable.find(
        (entry) => percentageMarks >= entry.percentage
      ) || percentageMarksTable[percentageMarksTable.length - 1];

    console.debug("calcPeriodicMarks debug:", {
      weeksLength: weeks.length,
      onTimeWeeks,
      laterSubmissions,
      onTimeSubmissions,
      percentageMarks,
      matchingEntry,
    });

    safeSetInteraction(matchingEntry.marks ?? 0);
    return matchingEntry.marks ?? 0;
  };

  const openPdfFromBuffer = (buffer) => {
    try {
      if (!buffer || !buffer.data) {
        showToast(toast, "Error", "error", "PDF not available");
        return;
      }
      const uint8Array = new Uint8Array(buffer.data);
      const blob = new Blob([uint8Array], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
    } catch (err) {
      console.error("openPdfFromBuffer error:", err);
      showToast(toast, "Error", "error", "Failed to open PDF");
    }
  };

  // ---------- API helpers ----------
  const getUser = async () => {
    try {
      const data = await axios.post(url + "/anyuser", { accessToken });
      const user = data.data.msg._doc;
      return user;
    } catch (error) {
      console.error("getUser error:", error);
      localStorage.removeItem("IMPaccessToken");
      return null;
    }
  };

  const getEvaluationSheet = async () => {
    if (!pdfBuffer) {
      showToast(toast, "Error", "error", "Evaluation PDF not available");
      return;
    }
    openPdfFromBuffer(pdfBuffer);
  };

  // upload file (ISE)
  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast(toast, "Error", "error", "No file selected");
      return;
    }
    const data = new FormData();
    data.append("rollno", rollNo);
    data.append("evaluation", "ISE");
    data.append("file", file);

    try {
      const resp = await axios.post(
        url + "/mentor/student/evaluation/upload",
        data
      );
      if (resp.status === 200) {
        showToast(toast, "Success", "success", "File Uploaded Successfully");
      } else {
        showToast(toast, "Error", "error", "File Not Uploaded");
      }
      setTimeout(() => {
        window.location.href = c_url + "mentor/studentprogress";
      }, 1200);
    } catch (err) {
      console.error("handleFileSubmit error:", err);
      showToast(toast, "Error", "error", "File upload failed");
    }
  };

  // populate evaluation marks into form
  const populateEvaluationMarks = (evaluationData) => {
    if (!evaluationData) return;
    setDate(evaluationData.exam_date || "");
    setTime(evaluationData.exam_time || "");
    setVenue(evaluationData.exam_venue || "");
    setQReport(String(evaluationData.report_quality_marks?.scored ?? "") || "");
    setOral(String(evaluationData.oral_presentation_marks?.scored ?? "") || "");
    setQWork(String(evaluationData.work_quality_marks?.scored ?? "") || "");
    setUnderstanding(
      String(evaluationData.work_understanding_marks?.scored ?? "") || ""
    );
    setInteraction(
      String(evaluationData.periodic_interaction_marks?.scored ?? "") || ""
    );
    setRemarks(evaluationData.examiner_specific_remarks || "");
    setCharCount(evaluationData.examiner_specific_remarks?.length || 0);

    if (evaluationData.scheduled_date) {
      const iso = new Date(evaluationData.scheduled_date)
        .toISOString()
        .split("T")[0];
      // if sentinel 1970-01-01 treat as empty
      const normalized = iso === "1970-01-01" ? "" : iso;
      setScheduledDate(normalized);
      setDate(normalized || evaluationData.exam_date || "");
    }
  };

  // submit evaluation marks (ISE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateMarks = (value, max) => {
      const numValue = parseInt(value);
      return Number.isFinite(numValue) && numValue >= 0 && numValue <= max;
    };

    const isQReportValidLocal = validateMarks(qreport, 20);
    const isOralValidLocal = validateMarks(oral, 30);
    const isQWorkValidLocal = validateMarks(qwork, 15);
    const isUnderstandingValidLocal = validateMarks(understanding, 15);
    const isInteractionValidLocal = validateMarks(interaction, 20);

    setIsQReportValid(isQReportValidLocal);
    setIsOralValid(isOralValidLocal);
    setIsQWorkValid(isQWorkValidLocal);
    setIsUnderstandingValid(isUnderstandingValidLocal);
    setIsInteractionValid(isInteractionValidLocal);

    if (
      !isQReportValidLocal ||
      !isOralValidLocal ||
      !isQWorkValidLocal ||
      !isUnderstandingValidLocal ||
      !isInteractionValidLocal
    ) {
      showToast(
        toast,
        "Error",
        "error",
        "Marks should be within the specified range"
      );
      return;
    }

    try {
      const data = {
        department_name: department,
        evaluation_name: "ISE",
        student_rollno: rollNo,
        student_name: name,
        mentor_name: mentorName,
        exam_date: date,
        scheduled_date: scheduledDate,
        exam_time: time,
        exam_venue: venue,
        project_title: title,
        work_done: workdone,
        report_quality_marks: { scored: qreport },
        oral_presentation_marks: { scored: oral },
        work_quality_marks: { scored: qwork },
        work_understanding_marks: { scored: understanding },
        periodic_interaction_marks: { scored: String(interaction) },
        examiner_specific_remarks: remarks,
        student_sign: studentSignature,
      };

      const response = await axios.post(
        url + `/mentor/student/evaluation`,
        data,
        { responseType: "arraybuffer" }
      );
      setIsEditingEvaluation(false);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(blob);
      showToast(toast, "Success", "success", "Details entered Successfully");
      setTimeout(() => {
        fetchData();
        window.open(pdfUrl, "_blank");
      }, 900);
    } catch (err) {
      console.error("handleSubmit error (ISE):", err);
      showToast(toast, "Error", "error", "Failed to submit data");
    }
  };

  // fetch initial data
  const fetchData = async () => {
    try {
      const userInfo = await getUser();
      if (userInfo) setMentorName(userInfo.name);

      const student_id = localStorage.getItem("student");
      const response = await axios.get(
        url + `/students/all?sub_id=${student_id}`
      );
      const student = response.data?.data?.[0];

      if (!student) {
        console.warn("fetchData: no student");
        return;
      }

      // progress filter (for periodic marks)
      const currentDate = new Date();
      const filteredProgress = (
        student.internships?.[0]?.progress || []
      ).filter((progressItem) => {
        const startDate = new Date(progressItem.startDate);
        return startDate < currentDate;
      });

      const buffer_date = new Date("2024-03-30");
      const buffer = calculateWeeks(
        student.internships?.[0]?.startDate || new Date(),
        buffer_date
      );
      calcPeriodicMarks(filteredProgress, buffer);

      // ISE is evaluation[0]
      const evalISE = student.internships?.[0]?.evaluation?.[0] || {};

      if (evalISE?.pdf_buffer) {
        setPdfBuffer(evalISE.pdf_buffer);
        if (evalISE.pdf_buffer?.data?.length > 0) {
          setToFill(false);
        }
      }

      setDepartment(student.department || "");
      setRollNo(student.rollno || "");
      setName(student.name || "");
      setTitle(student.internships?.[0]?.job_title || "");

      if (evalISE?.work_done) setWorkdone(evalISE.work_done);
      if (evalISE?.student_sign) setStudentSignature(evalISE.student_sign);

      // scheduled_date normalization
      if (evalISE?.scheduled_date) {
        const iso = new Date(evalISE.scheduled_date)
          .toISOString()
          .split("T")[0];
        setScheduledDate(iso === "1970-01-01" ? "" : iso);
        setDate(iso === "1970-01-01" ? "" : iso);
      }

      // if marks already present, populate them
      populateEvaluationMarks(evalISE);
    } catch (err) {
      console.error("fetchData error (ISE):", err);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // allow "edit evaluation" — loads evaluation[0] into form and scrolls up
  const handleEditEvaluation = async () => {
    try {
      const student_id = localStorage.getItem("student");
      const response = await axios.get(
        url + `/students/all?sub_id=${student_id}`
      );
      const student = response.data?.data?.[0];
      if (!student) {
        showToast(toast, "Error", "error", "Student data not found");
        return;
      }
      const evaluationData = student.internships?.[0]?.evaluation?.[0];
      populateEvaluationMarks(evaluationData);
      setIsEditingEvaluation(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("handleEditEvaluation error:", err);
      showToast(toast, "Error", "error", "Failed to load evaluation data");
    }
  };

  // Listen for evaluationDateChanged (custom event) for ISE updates
  useEffect(() => {
    const handler = (e) => {
      try {
        const detail = e?.detail || {};
        const { evaluation, date: newDate, student_id } = detail;
        const currentStudentId = localStorage.getItem("student");
        console.log("Received evaluationDateChanged (ISE):", detail);
        if (!evaluation || !newDate) return;

        if (
          evaluation === "ISE" &&
          String(student_id) === String(currentStudentId)
        ) {
          setScheduledDate(newDate);
          setDate(newDate);
          showToast(
            toast,
            "Success",
            "success",
            `ISE Date updated: ${newDate}`
          );
          // optionally fetchData() if backend changed more than date
        }
      } catch (err) {
        console.error("evaluationDateChanged handler (ISE) error:", err);
      }
    };

    window.addEventListener("evaluationDateChanged", handler);
    return () => window.removeEventListener("evaluationDateChanged", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Also listen for storage events cross-tab (if studentprogress writes a storage key)
  useEffect(() => {
    const storageHandler = (e) => {
      try {
        if (!e || !e.key) return;
        // your studentprogress code can set localStorage.setItem('evaluationDateChanged', JSON.stringify({...}))
        if (e.key !== "evaluationDateChanged") return;
        const parsed = JSON.parse(e.newValue || "{}");
        const { evaluation, date: newDate, student_id } = parsed;
        const currentStudentId = localStorage.getItem("student");
        console.log("Received storage event (ISE):", parsed);
        if (
          evaluation === "ISE" &&
          String(student_id) === String(currentStudentId)
        ) {
          setScheduledDate(newDate);
          setDate(newDate);
          showToast(
            toast,
            "Success",
            "success",
            `ISE Date updated (storage): ${newDate}`
          );
        }
      } catch (err) {
        console.error("storageHandler error (ISE):", err);
      }
    };

    window.addEventListener("storage", storageHandler);
    return () => window.removeEventListener("storage", storageHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.debug("ISE render:", {
    toFill,
    date,
    scheduledDate,
    pdfBufferExists: !!pdfBuffer,
  });

  // ---------- render ----------
  return (
    <section
      className={`bg-${colors.secondary} py-8 lg:py-16 antialiased min-h-screen`}
    >
      {toFill || isEditingEvaluation ? (
        <div className="max-w-2xl mx-auto px-4">
          <BackButton />
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl lg:text-3xl font-bold text-${colors.font}`}>
              In Semester Evaluation:
            </h2>
          </div>

          <form
            className="mb-6"
            onSubmit={(e) => {
              e.preventDefault();
              setshowDataModal(true);
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-lg lg:text-2xl font-bold text-${colors.font}`}
              >
                Name of Student:
              </h2>
            </div>
            <div className="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
              <input
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled
                required
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-lg lg:text-2xl font-bold text-${colors.font}`}
              >
                Roll No of Student:
              </h2>
            </div>
            <div className="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
              <input
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                type="text"
                name="rollNo"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                disabled
                required
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-lg lg:text-2xl font-bold text-${colors.font}`}
              >
                Date of examination:
              </h2>
            </div>
            <div className="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
              <input
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                type="date"
                name="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setScheduledDate(e.target.value);
                }}
                required
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-lg lg:text-2xl font-bold text-${colors.font}`}
              >
                Time:
              </h2>
            </div>
            <div className="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
              <input
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                type="time"
                name="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-lg lg:text-2xl font-bold text-${colors.font}`}
              >
                Venue:
              </h2>
            </div>
            <div className="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
              <input
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                type="text"
                name="venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-lg lg:text-2xl font-bold text-${colors.font}`}
              >
                Internship/Project Title:
              </h2>
            </div>
            <div className="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
              <input
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                type="text"
                name="title"
                value={title}
                disabled
                required
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-lg lg:text-2xl font-bold text-${colors.font}`}
              >
                Work Done:
              </h2>
            </div>
            <div className="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
              <textarea
                id="comment"
                rows="6"
                value={workdone}
                disabled
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                placeholder="Work done..."
                required
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-lg lg:text-2xl font-bold text-${colors.font}`}
              >
                Marks:
              </h2>
            </div>

            {/* Quality of Report(20) */}
            <div className="flex justify-between items-center mb-2">
              <h2 className={`text-md md:text-xl text-${colors.font}`}>
                Quality of Report(20)
              </h2>
            </div>
            <div
              className={`py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border ${
                isQReportValid ? "border-gray-200" : "border-red-500"
              } dark:bg-gray-500 dark:border-gray-700`}
            >
              <input
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                type="number"
                name="report"
                value={qreport}
                onChange={(e) => setQReport(e.target.value)}
                required
              />
              {!isQReportValid && (
                <p className="text-red-500 text-xs">
                  Invalid value for Quality of Report. Marks out of range.
                </p>
              )}
            </div>

            {/* Oral Presentation(30) */}
            <div className="flex justify-between items-center mb-2">
              <h2 className={`text-md md:text-xl text-${colors.font}`}>
                Oral Presentation(30)
              </h2>
            </div>
            <div
              className={`py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border ${
                isOralValid ? "border-gray-200" : "border-red-500"
              } dark:bg-gray-500 dark:border-gray-700`}
            >
              <input
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                type="number"
                name="oral"
                value={oral}
                onChange={(e) => setOral(e.target.value)}
                required
              />
              {!isOralValid && (
                <p className="text-red-500 text-xs">
                  Invalid value for Oral Presentation. Marks out of range.
                </p>
              )}
            </div>

            {/* Quality of Work Done(15) */}
            <div className="flex justify-between items-center mb-2">
              <h2 className={`text-md md:text-xl text-${colors.font}`}>
                Quality of Work Done(15)
              </h2>
            </div>
            <div
              className={`py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border ${
                isQWorkValid ? "border-gray-200" : "border-red-500"
              } dark:bg-gray-500 dark:border-gray-700`}
            >
              <input
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                type="number"
                name="work"
                value={qwork}
                onChange={(e) => setQWork(e.target.value)}
                required
              />
              {!isQWorkValid && (
                <p className="text-red-500 text-xs">
                  Invalid value for Quality of Work Done. Marks out of range.
                </p>
              )}
            </div>

            {/* Understanding of Work(15) */}
            <div className="flex justify-between items-center mb-2">
              <h2 className={`text-md md:text-xl text-${colors.font}`}>
                Understanding of Work(15)
              </h2>
            </div>
            <div
              className={`py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border ${
                isUnderstandingValid ? "border-gray-200" : "border-red-500"
              } dark:bg-gray-500 dark:border-gray-700`}
            >
              <input
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                type="number"
                name="understand"
                value={understanding}
                onChange={(e) => setUnderstanding(e.target.value)}
                required
              />
              {!isUnderstandingValid && (
                <p className="text-red-500 text-xs">
                  Invalid value for Understanding of Work. Marks out of range.
                </p>
              )}
            </div>

            {/* Periodic Interaction(20) */}
            <div className="flex justify-between items-center mb-2">
              <h2 className={`text-md md:text-xl text-${colors.font}`}>
                Periodic Interaction with mentor(20)
              </h2>
            </div>
            <div
              className={`py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border ${
                isInteractionValid ? "border-gray-200" : "border-red-500"
              } dark:bg-gray-500 dark:border-gray-700`}
            >
              <input
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                type="number"
                name="interact"
                value={interaction}
                onChange={(e) => setInteraction(e.target.value)}
                required
              />
              {!isInteractionValid && (
                <p className="text-red-500 text-xs">
                  Invalid value for Periodic Interaction with Mentor. Marks out
                  of range.
                </p>
              )}
            </div>

            {/* Remarks */}
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-lg lg:text-2xl font-bold text-${colors.font}`}
              >
                Specific Remarks of the examiners:
              </h2>
            </div>
            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
              <textarea
                id="comment"
                rows="6"
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                  setCharCount(e.target.value.length);
                }}
                maxLength={150}
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                placeholder="Write a remark..."
              />
              <p>Character count: {charCount}/150</p>
            </div>

            {showDataModal && (
              <Alert
                onConfirm={handleSubmit}
                text={"Data Submission"}
                onClosec={() => setshowDataModal(false)}
              />
            )}

            <button
              type="submit"
              className="mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Submit Data
            </button>
          </form>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4">
          {/* Back */}
          <div className="w-full max-w-[1262px] mb-4">
            <button onClick={() => navigate("/mentor/studentprogress")} className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Back to student profile</span>
            </button>
          </div>

          <button
            type="button"
            className="mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 mb-5 text-center"
            onClick={getEvaluationSheet}
          >
            View Evaluation Sheet
          </button>

          <button
            type="button"
            className="mt-5 ml-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 mb-5 text-center"
            onClick={handleEditEvaluation}
          >
            Update Evaluation Sheet
          </button>

          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-lg lg:text-2xl font-bold text-${colors.font}`}>
              Upload Hard Copy of Document:
            </h2>
          </div>

          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">{file ? `Selected file: ${file.name}` : "Click to upload"}</span>
                </p>
              </div>
              <input id="dropzone-file" type="file" onChange={handleFileChange} className="hidden" accept=".pdf" />
            </label>
          </div>
          <p>*only pdf files are accepted</p>

          {showFileModal && (
            <Alert
              onConfirm={handleFileSubmit}
              text={"File Upload"}
              onClosec={() => setshowFileModal(false)}
            />
          )}

          <button
            type="button"
            className="mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={() => setshowFileModal(true)}
          >
            Submit Data
          </button>
        </div>
      )}
    </section>
  );
};

export default Progress;
