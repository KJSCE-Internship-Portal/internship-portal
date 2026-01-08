import React, { useState } from "react";
import * as XLSX from "xlsx";
import { getCurrentIndianDateTime } from "../../../Global/getTime";
import { DownloadIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import showToast from "../../../Global/Toast";

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function ExportToExcelButton({ excelData, department, batch }) {
  const [workbook, setWorkbook] = useState(null);
  const toast = useToast();
  const [data, setData] = useState();

  const handleExport = () => {
    var temp = [];
    for (let z = 0; z < excelData.length; z++) {
      var student = excelData[z];
      if (
        student.isActive &&
        (student.department.trim() === department.trim() ||
          department === "ALL") &&
        student.batch.trim() === batch
      ) {
        var c = 0;
        for (let i = 0; i < student.internships[0].progress.length; i++) {
          if (student.internships[0].progress[i].submitted) {
            c++;
          }
        }
        console.log(department);
        function findEvaluation(arr, name, fallbackIndex) {
          if (!arr || !Array.isArray(arr)) return null;
          const byName = arr.find((e) => e && e.evaluation === name);
          if (byName) return byName;
          if (typeof fallbackIndex === 'number') return arr[fallbackIndex] || null;
          return null;
        }

        function computeTotalFromComponents(ev) {
          if (!ev || typeof ev !== 'object') return 0;
          const keys = ['report_quality_marks','oral_presentation_marks','work_quality_marks','work_understanding_marks','periodic_interaction_marks'];
          let sum = 0;
          keys.forEach((k) => {
            const v = ev[k];
            if (v && (typeof v.scored === 'number' || typeof v.scored === 'string')) {
              sum += Number(v.scored) || 0;
            }
          });
          return sum;
        }

        const evalArr = student.internships[0]?.evaluation || [];
        const iseEntry = findEvaluation(evalArr, 'ISE', 0) || null;
        const eseEntry = findEvaluation(evalArr, 'ESE', 1) || null;

        const iseMarksVal = iseEntry ? (iseEntry.total_marks?.scored ?? iseEntry.marks ?? computeTotalFromComponents(iseEntry)) : '';
        function bufferHasData(v) {
          if (!v) return false;
          // Node Buffer
          if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(v)) return v.length > 0;
          // Mongodb Binary style { _bsontype: 'Binary', buffer: ArrayBuffer }
          if (v && v._bsontype === "Binary" && v.buffer) {
            try {
              const b = Buffer.from(v.buffer);
              return b.length > 0;
            } catch (e) {
              return false;
            }
          }
          // object with data array
          if (v && v.data && Array.isArray(v.data)) return v.data.length > 0;
          // string path or base64
          if (typeof v === "string") return v.trim().length > 0;
          return false;
        }

        const iseHasPdf = iseEntry ? (bufferHasData(iseEntry.pdf_buffer) || bufferHasData(iseEntry.pdf)) : false;
        const iseHasDate = iseEntry ? !!iseEntry.exam_date : false;

        const eseMarksVal = eseEntry ? (eseEntry.total_marks?.scored ?? eseEntry.marks ?? computeTotalFromComponents(eseEntry)) : '';
        const eseHasPdf = eseEntry ? (bufferHasData(eseEntry.pdf_buffer) || bufferHasData(eseEntry.pdf)) : false;
        const eseHasDate = eseEntry ? !!eseEntry.exam_date : false;

        var excel_obj = {
          Roll_no: student.rollno,
          Department: student.department,
          Name: student.name,
          Batch: student.batch,
          Email: student.email,
          Contact_no: student.contact_no,
          Mentor: student.hasMentor ? student.mentor.name : "-",
          Company: student.internships[0].company,
          Job_Description: student.internships[0].job_description,
          Company_Mentor: student.internships[0].company_mentor,
          Start_Date: formatDate(student.internships[0].startDate),
          End_Date: formatDate(student.internships[0].endDate),
          Total_Weeks: student.internships[0].duration_in_weeks.toString(),
          Submitted_Weeks:
            c.toString() +
            "/" +
            student.internships[0].duration_in_weeks.toString(),
          Internship_Type:
            student.internships[0]?.internship_type || student.internships[0]?.type || "",
          Stipend_Status: student.internships[0]?.stipend_status || "",
          Stipend_Amount:
            student.internships[0]?.stipend_amount || student.internships[0]?.stipend || "",
          ISE_Marks: iseMarksVal !== '' ? iseMarksVal : "",
          ISE_Status: (iseEntry && (iseEntry.is_signed || Number(iseMarksVal) > 0 || iseHasPdf || iseHasDate)) ? "Done" : "Pending",
          ESE_Marks: eseMarksVal !== '' ? eseMarksVal : "",
          ESE_Status: (eseEntry && (eseEntry.is_signed || Number(eseMarksVal) > 0 || eseHasPdf || eseHasDate)) ? "Done" : "Pending",
        };
        temp.push(excel_obj);
      }
    }

    const worksheet = XLSX.utils.json_to_sheet(temp);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const { date, time } = getCurrentIndianDateTime();
    if (!excelData) {
      showToast(toast, "Error", "error", "Try Again Later");
      return;
    }
    XLSX.writeFile(workbook, `Students-${time}-${date}.xlsx`);
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
