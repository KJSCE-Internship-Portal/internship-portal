import React, { useState } from "react";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Details = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [startdate, setStartDate] = useState('');
    const [enddate, setEndDate] = useState('');
    const [company, setCompany] = useState('');
    const [mentor, setMentor] = useState('');
    const [department, setDepartment] = useState('');
    const [division, setDivision] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [batch, setBatch] = useState('');
    const [facultyMentor, setFacultyMentor] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [stipend, setStipend] = useState('');

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const encodedUserInfo = queryParams.get('userInfo');
    const encodedRefreshToken = queryParams.get('refreshToken');
    const userInfo = JSON.parse(decodeURIComponent(encodedUserInfo));
    const refreshToken = decodeURIComponent(encodedRefreshToken);

    useEffect(() => {
        console.log(refreshToken);
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
            // Other fields can also be set from userInfo
        }
    }, [refreshToken, userInfo]);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const data = {
    //             name,
    //             email,
    //             rollNo,
    //             department,
    //             division,
    //             batch,
    //             company,
    //             startdate,
    //             enddate,
    //             facultyMentor,
    //             mentor,
    //             jobDescription,
    //             stipend,
    //             refreshToken,

    //         };
    //         const response = await fetch('YOUR_BACKEND_API_ENDPOINT', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(data),
    //         });
    //         if (response.ok) {
    //             console.log('Data successfully submitted to the backend!');
    //         } else {
    //             console.error('Failed to submit data to the backend.');
    //         }
    //     } catch (error) {
    //         console.error('Error occurred while submitting data:', error);
    //     }
    // };

    return (
        <section class="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
            <div class="max-w-3xl mx-auto px-10">
                <div className="max-w-2xl mx-auto">
                    <form className="w-full max-w-2xl mx-auto">
                        <div className="text-left mb-6 pb-5">
                            <h2 className="text-5xl font-bold text-gray-900 dark:text-white">
                                Welcome
                            </h2>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                <img
                                    src={userInfo.imageUrl}
                                    alt="User Profile"
                                    className="h-8 w-8 rounded-full mr-2"
                                />
                                <span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500"
                                    style={{ animation: 'fadeIn 3s forwards' }}
                                >
                                    {name}
                                </span>
                            </h3>
                        </div>
                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
                            <label for="rollno" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Email<span class="text-red-500">*</span></label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled
                                required
                            />
                        </div>
                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
                            <label for="rollno" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Roll. No.<span class="text-red-500">*</span></label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                name="rollno"
                                value={rollNo}
                                onChange={(e) => setRollNo(e.target.value)}
                                required
                            />
                        </div>
                        <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
                            <label for="dept" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Department<span class="text-red-500">*</span></label>
                            <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name="department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select Department</option>
                                <option value="IT">IT</option>
                                <option value="CS">CS</option>
                                <option value="MECH">MECH</option>
                                <option value="EXTC">EXTC</option>
                                <option value="ETRX">ETRX</option>
                                <option value="ETRX" hidden>EXCP</option>
                                <option value="ETRX" hidden>RAI</option>
                                <option value="ETRX" hidden>AIDS</option>
                            </select>
                        </div>
                        <div className="flex flex-wrap justify-between">
                            <div className="mr-4 flex-1 py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
                                <label for="division" className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Division<span className="text-red-500">*</span></label>
                                <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name="division"
                                    value={division}
                                    onChange={(e) => setDivision(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Division</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                </select>
                            </div>
                            <div className="flex-1 py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
                                <label for="batch" className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Batch<span className="text-red-500">*</span></label>
                                <input
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    type="text"
                                    name="batch"
                                    value={batch}
                                    onChange={(e) => setBatch(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center mb-6 pb-14 relative">
                            <span className="absolute left-0 w-full flex justify-center" style={{ top: '50%' }}>
                                {/* <hr className="border-gray-300 dark:border-gray-600 w-1/3 mr-4" />
                                <span className="text-gray-900 dark:text-white font-bold text-lg lg:text-2xl flex items-center">
                                    <span className="flex-grow"></span>
                                    Internship Details
                                    <span className="flex-grow"></span>
                                </span>
                                <hr className="border-gray-300 dark:border-gray-600 w-1/3 ml-4" /> */}
                                <hr className="border-gray-300 dark:border-gray-600 w-full" />
                            </span>
                        </div>

                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
                            <label for="cname" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Company Name<span class="text-red-500">*</span></label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                name="company"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row justify-between">
                            <div className="lg:w-1/2 mb-4 lg:mb-0 lg:pb-4">
                                <div className="py-2 px-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
                                    <label htmlFor="startdate" className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Start Date<span className="text-red-500">*</span></label>
                                    <input
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="date"
                                        name="startdate"
                                        value={startdate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="lg:w-1/2 mb-4 lg:mb-0 lg:ml-4 lg:pb-4">
                                <div className="py-2 px-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
                                    <label htmlFor="enddate" className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">End Date<span className="text-red-500">*</span></label>
                                    <input
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="date"
                                        name="enddate"
                                        value={enddate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
                            <label for="fmentor" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Faculty Mentor<span class="text-red-500">*</span></label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                name="fmentor"
                                value={facultyMentor}
                                onChange={(e) => setFacultyMentor(e.target.value)}
                                required
                            />
                        </div>
                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
                            <label for="cmentor" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Company Mentor<span class="text-red-500">*</span></label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                name="mentor"
                                value={mentor}
                                onChange={(e) => setMentor(e.target.value)}
                                required
                            />
                        </div>
                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
                            <label for="jobdesc" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Job Description<span class="text-red-500">*</span></label>
                            <textarea id="comment" rows="6" value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter Description..." required></textarea>
                        </div>
                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
                            <label for="stipend" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Stipend  (Leave Empty if N/A)</label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="number"
                                name="stipend"
                                value={stipend}
                                onChange={(e) => setStipend(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-3">Submit Data</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Details;