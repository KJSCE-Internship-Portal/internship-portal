import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { getCurrentIndianDateTime } from '../../../Global/getTime';
import { DownloadIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import showToast from '../../../Global/Toast';

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


function ExportToExcelButton({ excelData, department, batch }) {

    const [workbook, setWorkbook] = useState(null);
    const toast = useToast();
    const [data, setData] = useState();

    const handleExport = () => {
        var temp = []
        for (let z = 0; z < excelData.length; z++) {
            var student = excelData[z];
            if (student.isActive && (student.department.trim() === department.trim() || department === "ALL") && student.batch.trim() === batch ) {
                var c = 0;
                for (let i = 0; i < student.internships[0].progress.length; i++) {
                    if (student.internships[0].progress[i].submitted) {
                        c++;
                    }
                }
                console.log(department)
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
                    Total_Weeks: (student.internships[0].duration_in_weeks).toString(),
                    Submitted_Weeks: c.toString() + "/" + (student.internships[0].duration_in_weeks).toString(),
                    ISE_evaluation_status: (student.internships[0].evaluation[0]?.is_signed) ? 'Completed' : 'Pending',
                    ESE_evaluation_status: (student.internships[0].evaluation[1]?.is_signed) ? 'Completed' : 'Pending',
                }
                temp.push(excel_obj);
            }
        }

        const worksheet = XLSX.utils.json_to_sheet(temp);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const { date, time } = getCurrentIndianDateTime();
        if (!excelData) {
            showToast(toast, 'Error', 'error', "Try Again Later");
            return;
        }
        XLSX.writeFile(workbook, `Students-${time}-${date}.xlsx`);
    };
    if (excelData.length >= 1) {
        return (
            <div style={{ width: '100%', padding: '5px 2vw', display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleExport} rightIcon={<DownloadIcon />} colorScheme='green' variant='outline'>
                    Download
                </Button>
            </div>

        );
    } else {
        return null;
    }
}

export default ExportToExcelButton;
