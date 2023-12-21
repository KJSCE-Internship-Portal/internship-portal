import React, { useState } from "react";

const Progress = () => {
    const [startdate, setStartDate] = useState([
        { date: "21-12-2023"},
      ]);
    const [enddate, setEndDate] = useState([
        { date: "27-12-2023"},
      ]);
    const [task, setTask] = useState('');

    return (
        <section class="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
        <div class="max-w-2xl mx-auto px-4">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">Weekly Progress:</h2>
    </div>
    <form class="mb-6">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Week Start Date:</h2>
    </div>
        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <h1>{startdate[0].date}</h1>
        </div>

        <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Week End Date:</h2>
        </div>
        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <h1>{enddate[0].date}</h1>
        </div>

    <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Task:</h2>
    </div>
        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <textarea id="comment" rows="6" value={task}
                  onChange={(e) => setTask(e.target.value)}
                class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a comment..." required></textarea>
        </div>
        <button type="submit" class="text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit Data</button>

    </form>
    </div>
</section>
    );
};

export default Progress;