import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
// import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { url } from '../../../../../Global/URL';
import axios from 'axios';
import showToast from '../../../../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import { getUserDetails } from '../../../../../Global/authUtils';
import Alert from '../../../../../components/Alert/alert';

const AddStudentsexcel = () => {
  const [csvData, setCsvData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState();
  const toast = useToast();
  const [showDataModal, setshowDataModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const current_user = await getUserDetails();
        setUser(current_user);
      } catch (error) {
        showToast(toast, "Error", 'error', "Something Wen't Wrong !");
      }
    };
    fetchData();
  }, []);
  

  const uploadExcel = async () => {
    try {
      const updatedData = await Promise.all(
        csvData.map(async (row) => {
          const { Student_email, Mentor_email } = row;
  
          const studentCheck = await axios.post(url + '/coordinator/check-student', { email: Student_email });
          console.log(studentCheck);
          const isStudentRegistered = studentCheck.data.isRegistered;
  
          const mentorCheck = await axios.post(url + '/coordinator/check-mentor', { email: Mentor_email });
          const isMentorRegistered = mentorCheck.data.isRegistered;
  
          return {
            ...row,
            assignStatus: isStudentRegistered && isMentorRegistered ? 'assign' : 'skip',
          };
        })
      );
  
      const dataToUpload = updatedData.filter((row) => row.assignStatus === 'assign');
  
      if (dataToUpload.length > 0) {
        const response = await axios.post(url + '/coordinator/add-students-excel', {
          csvData: csvData,
          department: user.department,
        });
  
        if (response.data.success) {
          showToast(toast, 'Success', 'success', response.data.msg);
        } else {
          showToast(toast, 'Error', 'error', response.data.msg);
        }
      } else {
        showToast(toast, 'Error', 'error', 'No valid data to upload.');
      }
    } catch (error) {
      showToast(toast, 'Error', 'error', 'Something went wrong.');
    }
  };
  
  const [mentorEmailError, setMentorEmailError] = useState(false);
  const [studentEmailError, setEmailError] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@somaiya\.edu$/;
    if (!emailRegex.test(email)) {
        return 'Invalid email format';
    }
    return '';
  };

  const handleAddStudent = async ({ student_email, mentor_email, roll_no }) => {
    const studentEmailError = validateEmail(student_email);
    const mentorEmailError = validateEmail(mentor_email);

    if (studentEmailError || mentorEmailError || roll_no.length === 0) {
        setEmailError(studentEmailError);
        setMentorEmailError(mentorEmailError);
        showToast(toast, 'Error', 'error', 'Provide valid email(s) and roll number');
        return;
    }

    try {
        let current_user;
        if (!user) {
            current_user = await getUserDetails();
            setUser(current_user);
        } else {
            current_user = user;
        }

        const response = await axios.post(url + '/coordinator/mentor/assign-student', {
            mentor_email,
            rollno: roll_no.toString(),
            student_email,
            department: current_user.department,
        });
    } catch (error) {
        showToast(toast, 'Error', 'error', 'Something Went Wrong');
    }
};

  

  const downloadTemplate = async () => {
    try {
      const response = await axios.get(url + '/donload-student-template', {
        responseType: 'blob'
      });  
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'faculty-upload-Student.xlsx'); 

    
      document.body.appendChild(link);
      link.click();

      
      link.parentNode.removeChild(link);
    } catch (error) {
      showToast(toast, "Error", 'error', "Something went Wrong");
    }
  }

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file); 

    try {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        handleExcelFile(file);
      } else {
        throw new Error({ field: 'file', message: 'Invalid file type. Please upload an Excel (.xlsx) file.' });
      }
    } catch (error) {
      setErrors([{ field: 'file', message: 'Invalid file type. Please upload an Excel (.xlsx) file.' }]);
      console.error(error);
    }
  }, []);

  const handleExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;

      if (!file.name.endsWith('.xlsx')) {
        setErrors([{ field: 'file', message: 'Invalid file type. Please upload an Excel (.xlsx) file.' }]);
        console.error('Invalid file type. Please upload an Excel (.xlsx) file.');
        return;
      }

      const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const { filteredData, validationErrors } = filterColumns(jsonData);
      if (validationErrors.length === 0) {
        setCsvData(filteredData);
        setErrors([]);
        console.log('Parsed Excel Data:', filteredData); 
      } else {
        setErrors(validationErrors);
        console.error('Validation errors:', validationErrors); 
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handelSubmit = (filteredData) => {
    for(let i=0; i<filteredData.length; i++){
      handleAddStudent({
        student_email: filteredData[i].Student_email,
        mentor_email: filteredData[i].Mentor_email,
        roll_no: filteredData[i].roll_no,
      }); 
    }
    showToast(toast, 'Success', 'success', 'Student Assigned');
    setTimeout(()=>{window.location.reload()},10);
    console.log("Students added succes");
  }

  const filterColumns = (data) => {
    const uniqueErrors = new Set();

    const filteredData = data.map((row, index) => {
      const errors = [];

      // Validate Student Name
      if (!row.Student_name || row.Student_name.trim() === '') {
        errors.push({ field: 'Student_name', message: `Student Name is required for row ${index + 1}` });
      }

      // Validate Student Email
      const emailRegex = /^[^\s@]+@somaiya\.edu$/i;
      if (!row.Student_email || !emailRegex.test(row.Student_email)) {
        errors.push({ field: 'Student_email', message: `Invalid or missing Student Email for row ${index + 1}. It should be of @somaiya.edu domain.` });
      }

      // Validate Roll No (optional, adjust validation as needed)
      if (row.roll_no && !/^\d+$/.test(row.roll_no)) {
        errors.push({ field: 'roll_no', message: `Invalid Roll No for row ${index + 1}. It should be a number.` });
      }

      // Validate Mentor Name (optional, adjust validation as needed)
      if (row.Mentor_name && row.Mentor_name.trim() === '') {
        errors.push({ field: 'Mentor_name', message: `Mentor Name is required for row ${index + 1}` });
      }

      // Validate Mentor Email (optional, adjust validation as needed)
      if (row.Mentor_email && !emailRegex.test(row.Mentor_email)) {
        errors.push({ field: 'Mentor_email', message: `Invalid or missing Mentor Email for row ${index + 1}. It should be of @somaiya.edu domain.` });
      }

      if (errors.length > 0) {
        errors.forEach((error) => {
          uniqueErrors.add(JSON.stringify(error));
        });
        return null;
      }

      return {
        Student_name: row.Student_name,
        Student_email: row.Student_email,
        roll_no: row.roll_no,
        Mentor_name: row.Mentor_name,
        Mentor_email: row.Mentor_email,
      };
    });

  
    const validationErrors = [...uniqueErrors].map((errorString) => JSON.parse(errorString));

    return {
      filteredData: filteredData.filter((row) => row !== null),
      validationErrors,
    };
  };


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.xlsx',
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          // backgroundColor: isDragActive ? '#e6f7ff' : 'white',
        }}
      >
        <input {...getInputProps()} />
        {selectedFile ? (
          <p style={{ margin: '0' }}>
            Selected file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </p>
        ) : (
          <p style={{ margin: '0' }}>Drag & drop your Excel (.xlsx) file here, or click to select one</p>
        )}

        {errors.length > 0 && (
          <div className="error" style={{ color: 'red', marginTop: '10px' }}>
            <p>The following errors were found:</p>
            {errors.map((error, index) => (
              <p key={index}>{`${error.field} : ${error.message}`}</p>
            ))}
          </div>
        )}


      </div>
      {showDataModal && (
                        <Alert
                        onConfirm={uploadExcel}
                        text={'Upload Excel'}
                        onClosec={() => setshowDataModal(false)}

                        />)
                        }
      {
        errors.length == 0 && (
          <button onClick= {() => handelSubmit(csvData)} style={{ width: '100%', border: 'none', height: '30px', marginTop: '20px', backgroundColor: '#b4f7ab', borderRadius: '15px', border: 'solid 0.5px #555' }}>Upload Excel</button>
        )
      }
      <button onClick={()=>downloadTemplate()} style={{ width: '100%', border: 'none', height: '30px', marginTop: '20px', backgroundColor: '#b4f7ab', borderRadius: '15px', border: 'solid 0.5px #555' }}>Download Template</button>
    </div>
  );
};

export default AddStudentsexcel;
