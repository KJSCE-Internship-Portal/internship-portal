import React, { useState } from "react";
import { Button, Img, Line, List, Text } from "components";

const Details = () => {
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

    return (
        <section class="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
        <div class="max-w-2xl mx-auto px-4">
    <div class="flex justify-center items-center mb-6 pb-5">
        <h2 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">Internship Details:</h2>
    </div>
    <form class="max-w-sm mx-auto">
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
                </select>
            </div>
            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
            <label for="division" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Division<span class="text-red-500">*</span></label>
                <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="division"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    required
                >
                    <option value="" disabled>Select Division</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    {/* Add more divisions as needed */}
                </select>
            </div>
        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
        <label for="batch" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Batch<span class="text-red-500">*</span></label>
            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="text"
                  name="batch"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  required
                  />         
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
        <label for="startdate" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Start Date<span class="text-red-500">*</span></label>
            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="date"
                  name="startdate"
                  value={startdate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  />         
        </div>
        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
        <label for="enddate" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">End Date<span class="text-red-500">*</span></label>
            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="date"
                  name="enddate"
                  value={enddate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  />         
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
        <label for="stipend" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Stipend  (Leave Empty if N/A)</label>
            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="number"
                  name="stipend"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  />         
        </div>
        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
        <label for="jobdesc" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Job Description<span class="text-red-500">*</span></label>
            <textarea id="comment" rows="6" value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter Description..." required></textarea>
        </div>
        <button type="submit" class="text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">Submit Data</button>

    </form>
    </div>
</section>
    );
};

export default Details;