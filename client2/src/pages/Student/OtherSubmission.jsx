import React, { useState } from "react";
import { useEffect } from 'react';
import { useTheme } from '../../Global/ThemeContext';
import { useParams } from 'react-router-dom';
import showToast from '../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { url, c_url } from '../../Global/URL';

const Certificate = () => {
    const [file, setFile] = useState('');
    const { theme:colors } = useTheme();
    const toast = useToast();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };
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
    const handleFileSubmit = async (e) => {
        const userInfo = await getUser();
        const data = new FormData();
        data.append('sub_id', userInfo.sub_id);
        data.append('file', file);

        const resp = await axios.post(url + "/student/other/upload", data);
        if(resp.status == 200) {
            showToast(toast, 'Success', 'success', 'File Uploaded Successfully');
        } else {
            showToast(toast, 'Error', 'error', 'File Not Uploaded');
        }
        setTimeout(() => {
            window.location.href = c_url + 'student/home'; 
          }, 2000);
    }

    return (
        <section className={`bg-${colors.secondary} py-8 lg:py-16 antialiased`}>
            <div className="max-w-2xl mx-auto px-4">
                <div className={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Other outcomes such as Copyrights, Patents, Research Papers etc.</div>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                    {file ? `Selected file: ${file.name}` : 'Click to upload'}
                                </span>
                            </p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf" 
                        />
                    </label>
                </div>
                <p>*only pdf files are accepted</p>
                <button
                    type="submit"
                    className="text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-3"
                    onClick={handleFileSubmit}
                >
                    Submit
                </button>
            </div>
        </section>
    );
};

export default Certificate;