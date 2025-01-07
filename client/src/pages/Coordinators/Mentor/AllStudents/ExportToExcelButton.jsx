import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { getCurrentIndianDateTime } from '../../../../Global/getTime';
import { DownloadIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import showToast from '../../../../Global/Toast';



function ExportToExcelButton({ excelData, department, batch }) {
  const [workbook, setWorkbook] = useState(null);
  const toast = useToast();

  const handleExport = () => {
    let filteredData = excelData;
    if (batch) {
        filteredData = excelData.filter(student => student.batch === batch);
    }

    if (filteredData.length === 0) {
        showToast(toast, 'Error', 'error', "No data available for the selected batch");
        return;
    }

    // Map the filtered data to include only the specified fields
    const formattedData = filteredData.map(student => ({
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
        Submitted_Weeks: `${student.internships[0]?.submitted_weeks || 0}/${student.internships[0]?.duration_in_weeks || 0}`,
        ISE_evaluation_status: student.internships[0]?.evaluation[0]?.is_signed ? 'Completed' : 'Pending',
        ESE_evaluation_status: student.internships[0]?.evaluation[1]?.is_signed ? 'Completed' : 'Pending',
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const { date, time } = getCurrentIndianDateTime();

    if (department === 'data' || !excelData) {
        showToast(toast, 'Error', 'error', "Try Again Later");
        return;
    }

    XLSX.writeFile(workbook, `${department}-${time}-${date}.xlsx`);
};

  if (excelData.length >= 1) {
    return (
      <div style={{ width: '100%', padding: '5px 2vw', display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleExport} rightIcon={<DownloadIcon />} colorScheme='green' variant='outline'>
          Download
        </Button>
      </div>

    );
  } else{
    return null;
  }
}

export default ExportToExcelButton;
