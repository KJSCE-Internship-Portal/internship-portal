import React, { useState } from "react";
import * as XLSX from "xlsx";
import { getCurrentIndianDateTime } from "../../../../Global/getTime";
import { DownloadIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import showToast from "../../../../Global/Toast";

// Helper to extract evaluation marks and status reliably
const getEvaluation = (student, evalName) => {
  try {
    const internship = (student.internships && student.internships[0]) || {};
    const evaluations = internship.evaluation || [];
    
    // Get entry by index: ISE = 0, ESE = 1
    const index = evalName === "ISE" ? 0 : 1;
    const entry = evaluations[index];
    
    // If no entry exists, return Pending
    if (!entry) return { marks: "", status: "Pending" };
    
    // Extract marks
    let marks = "";
    let scoredMarks = 0;
    if (entry.total_marks && typeof entry.total_marks === "object") {
      const scored = entry.total_marks.scored;
      const outOf = entry.total_marks.outOf || entry.total_marks.out_of || 75;
      scoredMarks = scored || 0;
      if (scored !== undefined && scored !== null && scored > 0) {
        marks = `${scored}/${outOf}`;
      }
    } else if (entry.marks !== undefined && entry.marks !== null && entry.marks > 0) {
      marks = String(entry.marks);
      scoredMarks = entry.marks;
    } else if (entry.total_marks_scored !== undefined && entry.total_marks_scored > 0) {
      marks = String(entry.total_marks_scored);
      scoredMarks = entry.total_marks_scored;
    }
    
    // Determine status based on meaningful criteria:
    // - Exam is "Done" only if student has been evaluated (marks > 0) or signed
    // - Exam is "Scheduled" if there's a scheduled_date but no marks yet
    // - Otherwise it's "Pending"
    const hasMarks = scoredMarks > 0;
    const isSigned = entry.is_signed === true;
    const isScheduled = entry.scheduled_date || entry.exam_date;
    
    let status = "Pending";
    if (hasMarks || isSigned) {
      status = "Done";
    } else if (isScheduled) {
      status = "Scheduled";
    }
    
    return { marks, status };
  } catch (e) {
    return { marks: "", status: "Pending" };
  }
};

function ExportToExcelButton({ excelData, department, batch }) {
  const [workbook, setWorkbook] = useState(null);
  const toast = useToast();

  const handleExport = () => {
    let filteredData = excelData;
    if (batch) {
      filteredData = excelData.filter((student) => student.batch === batch);
    }

    if (filteredData.length === 0) {
      showToast(
        toast,
        "Error",
        "error",
        "No data available for the selected batch"
      );
      return;
    }

    // Map the filtered data to include only the specified fields
    const formattedData = filteredData.map((student) => ({
      Roll_no: student.rollno,
      Department: student.department,
      Name: student.name,
      Batch: student.batch,
      Email: student.email,
      Contact_no: student.contact_no,
      Mentor: student.hasMentor ? student.mentor.name : "-",
      Company: student.internships[0]?.company || "-",
      Job_Description: student.internships[0]?.job_description || "-",
      Company_Mentor: student.internships[0]?.company_mentor || "-",
      Start_Date: student.internships[0]?.startDate || "-",
      End_Date: student.internships[0]?.endDate || "-",
      Total_Weeks: student.internships[0]?.duration_in_weeks?.toString() || "-",
      Submitted_Weeks: `${student.internships[0]?.submitted_weeks || 0}/${
        student.internships[0]?.duration_in_weeks || 0
      }`,
      Internship_Type:
        student.internships[0]?.internship_type || student.internships[0]?.type || "",
      Stipend_Status: student.internships[0]?.stipend_status || "",
      Stipend_Amount:
        student.internships[0]?.stipend_amount || student.internships[0]?.stipend || "",
      ISE_Marks: getEvaluation(student, "ISE").marks,
      ISE_Status: getEvaluation(student, "ISE").status,
      ESE_Marks: getEvaluation(student, "ESE").marks,
      ESE_Status: getEvaluation(student, "ESE").status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const { date, time } = getCurrentIndianDateTime();

    if (department === "data" || !excelData) {
      showToast(toast, "Error", "error", "Try Again Later");
      return;
    }

    XLSX.writeFile(workbook, `${department}-${time}-${date}.xlsx`);
  };

  if (excelData.length >= 1) {
    return (
      <div
        style={{
          width: "100%",
          padding: "5px 2vw",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={handleExport}
          rightIcon={<DownloadIcon />}
          colorScheme="green"
          variant="outline"
        >
          Download
        </Button>
      </div>
    );
  } else {
    return null;
  }
}

export default ExportToExcelButton;
