import React, { useState } from "react";
import { Button, Img, Line, List, Text } from "components";

const Details = () => {
    const [startdate, setStartDate] = useState('');
    const [enddate, setEndDate] = useState('');
    const [weeks, setWeeks] = useState('');
    const [company, setCompany] = useState('');
    const [mentor, setMentor] = useState('');

    return (
        <section class="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
        <div class="max-w-2xl mx-auto px-4">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">Internship Details:</h2>
    </div>
    <form class="mb-6">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Start Date:</h2>
    </div>
        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label for="comment" class="sr-only">Your comment</label>
            <input
                  type="date"
                  name="startdate"
                  value={startdate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  />         
        </div>

        <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">End Date:</h2>
        </div>
        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label for="comment" class="sr-only">Your comment</label>
            <input
                  type="date"
                  name="enddate"
                  value={enddate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  />         
    </div>
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Number of weeks:</h2>
    </div>
        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label for="comment" class="sr-only">Your comment</label>
            <input
                  type="number"
                  name="weeks"
                  value={weeks}
                  onChange={(e) => setWeeks(e.target.value)}
                  required
                  />         
        </div>

        <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Company name:</h2>
        </div>
        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label for="comment" class="sr-only">Your comment</label>
            <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  />         
        </div>
        <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Company mentor:</h2>
        </div>
        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label for="comment" class="sr-only">Your comment</label>
            <input
                  type="text"
                  name="mentor"
                  value={mentor}
                  onChange={(e) => setMentor(e.target.value)}
                  required
                  />         
        </div>
        <button type="submit"
            class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 border border-primary-700 
            rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
            Submit Data
        </button>
    </form>
    </div>
</section>
    );
};

export default Details;