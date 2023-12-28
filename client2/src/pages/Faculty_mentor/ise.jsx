import React, { useState } from "react";
import {useTheme} from '../../Global/ThemeContext';

const Progress = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [venue, setVenue] = useState('');
    const [title, setTitle] = useState('');
    const [workdone, setWorkdone] = useState('');
    const [qreport, setQReport] = useState('');
    const [oral, setOral] = useState('');
    const [qwork, setQWork] = useState('');
    const [understanding, setUnderstanding] = useState('');
    const [interaction, setInteraction] = useState('');
    const [remarks, setRemarks] = useState('');
    const [file, setFile] = useState('');
    const { theme:colors } = {useTheme}

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    return(
        <section class={`bg-${colors.secondary} py-8 lg:py-16 antialiased min-h-screen`}>    
            <div class="max-w-2xl mx-auto px-4">
                <div class="flex justify-between items-center mb-6">
                    <h2 class={`text-xl lg:text-3xl font-bold text-${colors.font}`}>In Semester Evaluation:</h2>
                </div>
                <form class="mb-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Date:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                    <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                                type="date"
                                name="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Time:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                    <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                                type="time"
                                name="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Venue:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                    <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                                type="text"
                                name="venue"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                required
                            />
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Internship Title:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                    <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                                type="text"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Work Done:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                    <textarea id="comment" rows="6" value={workdone}
                            onChange={(e) => setWorkdone(e.target.value)}
                            class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            placeholder="Work done..." required></textarea>
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Marks:</h2>
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <h2 class={`text-md md:text-xl text-${colors.font}`}>Quality of Report</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                        
                    <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                                type="number"
                                name="report"
                                value={qreport}
                                onChange={(e) => setQReport(e.target.value)}
                                required
                            />
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <h2 class={`text-md md:text-xl text-${colors.font}`}>Oral Presentation</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                    <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                                type="number"
                                name="oral"
                                value={oral}
                                onChange={(e) => setOral(e.target.value)}
                                required
                            />
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <h2 class={`text-md md:text-xl text-${colors.font}`}>Quality of Work Done</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                    <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                                type="number"
                                name="work"
                                value={qwork}
                                onChange={(e) => setQWork(e.target.value)}
                                required
                            />
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <h2 class={`text-md md:text-xl text-${colors.font}`}>Understanding of Work</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                    <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                                type="number"
                                name="understand"
                                value={understanding}
                                onChange={(e) => setUnderstanding(e.target.value)}
                                required
                            />
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <h2 class={`text-md md:text-xl text-${colors.font}`}>Periodic Interaction with mentor</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 text-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                    <input class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                                type="number"
                                name="interact"
                                value={interaction}
                                onChange={(e) => setInteraction(e.target.value)}
                                required
                            />
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Remarks:</h2>
                    </div>
                    <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-500 dark:border-gray-700">
                        <textarea id="comment" rows="6" value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-500"
                            placeholder="Write a remark..." required></textarea>
                    </div>
                    <div class="flex justify-between items-center mb-6">
                        <h2 class={`text-lg lg:text-2xl font-bold text-${colors.font}`}>Upload Hard Copy of Document:</h2>
                    </div>
                    <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                    {file ? `Selected file: ${file.name}` : 'Click to upload or drag and drop'}
                                </span>
                            </p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>

                    <button type="submit" class="mt-5 text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        Submit Data
                    </button>
                </form>
            </div>        
        </section>
    );

};

export default Progress;