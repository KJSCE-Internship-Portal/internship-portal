import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { url } from '../../../../../Global/URL';
import axios from 'axios';
import showToast from '../../../../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import { getUserDetails } from '../../../../../Global/authUtils';
import Alert from '../../../../../components/Alert/alert';

const AddMentorss = () => {
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
        showToast(toast, "Error", 'error', "Something went wrong!");
      }
    };
    fetchData();
  }, []);

  const uploadExcel = async () => {
    try {
      // Send data to server without overriding department
      const response = await axios.post(url + '/admin/add/mentors', {
        csvData: csvData, // Use the department from each row in the file
      });
  
      if (response.data.success) {
        showToast(toast, "Success", 'success', response.data.msg);
        setshowDataModal(false);
      } else {
        showToast(toast, "Error", 'error', response.data.msg);
        setshowDataModal(false);
      }
      setCsvData([]);
    } catch (error) {
      showToast(toast, "Error", 'error', "Something went wrong");
      setshowDataModal(false);
    }
  };
  
  const downloadTemplate = async () => {
    try {
      const response = await axios.get(url + '/download-template-admin', {
        responseType: 'blob' // Specify the response type as blob
      });  
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'faculty-upload-template-department.xlsx'); // Set the filename

      // Append the link to the body and click it
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
    } catch (error) {
      showToast(toast, "Error", 'error', "Something went wrong");
    }
  }

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file); // Update the selected file state

    try {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        handleExcelFile(file);
      } else {
        throw new Error('Invalid file type. Please upload an Excel (.xlsx) file.');
      }
    } catch (error) {
      setErrors([{ field: 'file', message: error.message }]);
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

      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const { filteredData, validationErrors } = filterColumns(jsonData);
      if (validationErrors.length === 0) {
        setCsvData(filteredData);
        setErrors([]);
        console.log('Parsed Excel Data:', filteredData); // Log the parsed data to the console
      } else {
        setErrors(validationErrors);
        console.error('Validation errors:', validationErrors); // Log validation errors to the console
      }
    };
    reader.readAsBinaryString(file);
  };

  const filterColumns = (data) => {
    const uniqueErrors = new Set(); // Use a set to store unique error messages

    const filteredData = data.map((row, index) => {
      const errors = [];

      // Validate department
      if (!row.department || row.department.trim() === '') {
        errors.push({ field: 'department', message: `Department is required for row ${index + 1}` });
      }

      // Validate name
      if (!row.name || row.name.trim() === '') {
        errors.push({ field: 'name', message: `Name is required for row ${index + 1}` });
      }

      // Validate email domain
      const emailRegex = /^[^\s@]+@somaiya\.edu$/i;
      if (!row.email || !emailRegex.test(row.email)) {
        errors.push({ field: 'email', message: `Invalid or missing email for row ${index + 1}. It should be of @somaiya.edu domain.` });
      }

      // Validate contact number length
      const contactNoRegex = /^\d{10}$/;
      if (!row.contact_no || !contactNoRegex.test(row.contact_no)) {
        errors.push({ field: 'contact_no', message: `Invalid or missing contact number for row ${index + 1}. It should be 10 digits long.` });
      }

      if (errors.length > 0) {
        errors.forEach((error) => {
          uniqueErrors.add(JSON.stringify(error)); // Add unique error messages to the set
        });
        return null;
      }

      return {
        name: row.name,
        email: row.email,
        contact_no: row.contact_no,
        department: row.department || user.department, // Default to user's department if not provided
      };
    });

    // Convert set of unique errors back to an array
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
        />
      )}
      {
        errors.length === 0 && (
          <button 
            onClick={() => setshowDataModal(true)} 
            style={{ 
              width: '100%', 
              border: 'none', 
              height: '30px', 
              marginTop: '20px', 
              backgroundColor: '#b4f7ab', 
              borderRadius: '15px', 
              border: 'solid 0.5px #555' 
            }}>Upload Excel</button>
        )
      }
      <button 
        onClick={() => downloadTemplate()} 
        style={{ 
          width: '100%', 
          border: 'none', 
          height: '30px', 
          marginTop: '20px', 
          backgroundColor: '#b4f7ab', 
          borderRadius: '15px', 
          border: 'solid 0.5px #555' 
        }}>Download Template</button>
    </div>
  );
};

export default AddMentorss;