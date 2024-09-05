import React, { useState } from "react";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Avatar, AvatarBadge } from '@chakra-ui/react';
import {url, c_url} from '../../Global/URL';
import showToast from '../../Global/Toast';
import { useToast } from '@chakra-ui/react';
import Alert from '../../components/Alert/alert';


const Details = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [startdate, setStartDate] = useState('');
    const [enddate, setEndDate] = useState('');
    const [company, setCompany] = useState('');
    const [mentor, setMentor] = useState('');
    const [department, setDepartment] = useState('');
    const [division, setDivision] = useState('');
    const [rollno, setRollNo] = useState('');
    const [batch, setBatch] = useState('');
    const [sem, setSem] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [stipend, setStipend] = useState('');
    const [showDataModal, setshowDataModal] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toast = useToast();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const encodedUserInfo = queryParams.get('userInfo');
    // const encodedRefreshToken = queryParams.get('refreshToken');
    const userInfo = JSON.parse(decodeURIComponent(encodedUserInfo));
    // const refreshToken = decodeURIComponent(encodedRefreshToken); 

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
            // Other fields can also be set from userInfo
        }
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); 
        try {
            const data = {
                name,
                profile_picture_url: userInfo.imageUrl,    
                email,
                sub_id: userInfo.sub_id,
                div: division,
                department,
                rollno,
                batch,
                sem,
                contact_no: phone,
                internships:[{
                    company,
                    job_title: jobTitle,
                    job_description: jobDescription,
                    startDate: startdate,
                    endDate: enddate,
                    company_mentor: mentor,
                    stipend: stipend,
                    completion:[],
                    progress:[]
                }]
            };
            
            const weeksDiff = Math.ceil((new Date(enddate) - new Date(startdate)) / (1000 * 60 * 60 * 24 * 7));
            if (weeksDiff < 14) {
                showToast(toast, 'Error', 'error', 'Minimum internship duration should be 14 weeks.');
                setIsSubmitting(false);
                return;
            }
            // console.log(data);

            const response = await fetch(url + "/student/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                console.log('Data successfully submitted to the backend!');
                showToast(toast, 'Success', 'success', 'Data Submitted...Redirecting...');
                setTimeout(() => {
                    window.location.href = c_url + 'login'; 
                  }, 500);
            } else {
                console.error('Failed to submit data to the backend.');
                showToast(toast, 'Error', 'error', response.data.msg);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Error occurred while submitting data:', error);
            setIsSubmitting(false);
        }
        setIsSubmitting(false);
    };

    return (
        <section class="bg-white dark:bg-gray-300 py-8 lg:py-16 antialiased">
            <div class="max-w-3xl mx-auto px-10">
                <div className="max-w-2xl mx-auto">
                    <form className="w-full max-w-2xl mx-auto" onSubmit={(e) => {
                                                            e.preventDefault();
                                                            setshowDataModal(true);
                                                        }}>
                        <div className="text-left mb-6 pb-5">
                            <h2 className="text-5xl font-bold text-gray-900 dark:text-black">
                                Welcome
                            </h2>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-black flex items-center">
                                <Avatar size="md" bg='red.700' color="white" name={name} src={userInfo.imageUrl} className="h-10 w-10 mr-2"></Avatar>
                                <span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500"
                                    style={{ animation: 'fadeIn 3s forwards' }}
                                >
                                    {name}
                                </span>
                            </h3>
                        </div>
                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-400 dark:border-gray-700">
                            <label for="rollno" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-black">Email<span class="text-red-500">*</span></label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled
                                required
                            />
                        </div>
                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-400 dark:border-gray-700">
                            <label for="rollno" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-black">Contact No.<span class="text-red-500">*</span></label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="number"
                                name="phone"
                                maxLength={10}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-400 dark:border-gray-700">
                            <label for="rollno" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-black">Roll. No.<span class="text-red-500">*</span></label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="number"
                                name="rollno"
                                value={rollno}
                                onChange={(e) => setRollNo(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-wrap justify-between">
                        <div className="mr-4 flex-1 py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-400 dark:border-gray-700">
                            <label for="dept" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-black">Department<span class="text-red-500">*</span></label>
                            <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name="department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select Department</option>
                                <option value="Computer Engineering">COMPS</option>
                                <option value="Information Technology">IT</option>
                                <option value="Mechanical Engineering">MECH</option>
                                <option value="Electronics And Telecommunication Engineering">EXTC</option>
                                <option value="Electronics Engineering">ETRX</option>
                                <option value="Electronics And Computer Engineering" hidden>EXCP</option>
                                <option value="Robotics And Artificial Intelligence" hidden>RAI</option>
                                <option value="Artificial Intelligence And Data Science" hidden>AIDS</option>
                                <option value="Computer And Communication Engineering" hidden>CCE</option>
                            </select>
                        </div>
                        <div className="flex-1 py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-400 dark:border-gray-700">
                                <label for="batch" className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-black">Semester<span className="text-red-500">*</span></label>
                                <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name="sem"
                                value={sem}
                                onChange={(e) => setSem(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select Semester</option>
                                {/* <option value="7" hidden>7</option> */}
                                <option value="8">8</option>
                            </select>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-between">
                            <div className="mr-4 flex-1 py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-400 dark:border-gray-700">
                                <label for="division" className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-black">Division<span className="text-red-500">*</span></label>
                                <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                            <div className="flex-1 py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-400 dark:border-gray-700">
                                <label for="batch" className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-black">Batch (Academic Year)<span className="text-red-500">*</span></label>
                                <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name="batch"
                                    value={batch}
                                    onChange={(e) => setBatch(e.target.value)}
                                    required
                                >
                                    <option value="" selected disabled>Select Batch</option>
                                    <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                                    <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                    <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
                                    <option value={new Date().getFullYear() + 2}>{new Date().getFullYear() + 2}</option>
                                </select>
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

                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-400 dark:border-gray-700">
                            <label for="cname" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-black">Company Name<span class="text-red-500">*</span></label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                name="company"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row justify-between">
                            <div className="lg:w-1/2 mb-4 lg:mb-0 lg:pb-4">
                                <div className="py-2 px-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-400 dark:border-gray-700">
                                    <label htmlFor="startdate" className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-black">Start Date<span className="text-red-500">*</span></label>
                                    <input
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="date"
                                        name="startdate"
                                        value={startdate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="lg:w-1/2 mb-4 lg:mb-0 lg:ml-4 lg:pb-4">
                                <div className="py-2 px-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-400 dark:border-gray-700">
                                    <label htmlFor="enddate" className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-black">End Date<span className="text-red-500">*</span></label>
                                    <input
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="date"
                                        name="enddate"
                                        value={enddate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-400 dark:border-gray-700">
                            <label for="cmentor" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-black">Company Mentor<span class="text-red-500">*</span></label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                name="mentor"
                                value={mentor}
                                onChange={(e) => setMentor(e.target.value)}
                                required
                            />
                        </div>
                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-400 dark:border-gray-700">
                        <label for="jobtitle" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-black">Job Title<span class="text-red-500">*</span></label>
                        <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                name="jobTitle"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-400 dark:border-gray-700">
                            <label for="jobdesc" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-black">Job Description<span class="text-red-500">*</span></label>
                            <textarea id="comment" rows="6" value={jobDescription}
                                onChange={(e) => {setJobDescription(e.target.value);
                                    setCharCount(e.target.value.length);}}
                                    maxLength={350}
                                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter Description..." required>
                                </textarea>
                                <p>Character count: {charCount}/350</p>
                        </div>
                        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-400 dark:border-gray-700">
                            <label for="stipend" class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-black">Stipend  (Leave Empty if N/A)</label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="number"
                                name="stipend"
                                value={stipend}
                                onChange={(e) => setStipend(e.target.value)}

                                
                            />

                        </div>
                        {showDataModal && (
                        <Alert
                        onConfirm={handleSubmit}
                        text={'Data Submission'}
                        onClosec={() => setshowDataModal(false)}

                        />)
                        }
                        <button type="submit" className="text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-3" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Data'}</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Details;