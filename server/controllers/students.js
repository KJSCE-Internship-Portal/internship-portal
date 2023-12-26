const express = require("express");
const Student = require('../models/student');
const Mentor = require('../models/mentor');

const moment = require('moment');

function calculateWeeks(startDate, endDate) {
  const start = moment(startDate);
  const end = moment(endDate);

  let current = start.clone();
  const weeks = [];

  while (current.isBefore(end)) {
    const weekStart = current.clone().startOf('isoWeek');
    let weekEnd = current.clone().endOf('isoWeek').isBefore(end) ? current.clone().endOf('isoWeek') : end.clone();
    weekEnd = weekEnd.add(1, 'day');

    weeks.push({
      start: weekStart.format('YYYY-MM-DD'),
      end: weekEnd.format('YYYY-MM-DD')
    });

    current = weekEnd.clone().add(1, 'day');
  }

  return {
    numberOfWeeks: weeks.length,
    weeklyDates: weeks
  };
}

// Example usage:
// const startDate = '2023-12-20';
// const endDate = '2024-01-26';

// const result = calculateWeeks(startDate, endDate);
// console.log(Number of weeks: ${result.numberOfWeeks});
// console.log('Start and End dates of each week:');
// result.weeklyDates.forEach((week, index) => {
//   console.log(Week ${index + 1}: Start - ${week.start}, End - ${week.end});
// });

const loginStudent = async (req, res) => {

    try {
        res.status(200).json({ success: true, msg: "Student Login Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }

    

};

const registerStudent = async (req, res) => {

    try {

        var student = req.body;
        const mentor = {
            email: '',
            contact_no: '',
            sub_id: ''
        }
        student = {...student, mentor, role: 'STUDENT'}

        const dates = calculateWeeks(student.internships[0].startDate, student.internships[0].endDate);
        student.internships[0].duration_in_weeks = dates.numberOfWeeks.toString();
        for(let i = 1; i<=dates.numberOfWeeks; i++){
            let obj = {
                week: i,
                startDate: dates.weeklyDates[i-1].start,
                endDate: dates.weeklyDates[i-1].end,             
            };

            student.internships[0].progress.push(obj);
        }

        const newStudent = new Student(student);
        await newStudent.save();
        res.status(200).json({ success: true, msg: "Student Registration Route" });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong : ${error.message}` });
    }

};

const addWeeklyProgress = async (req, res) => {
    try {

        var taskUpdate = req.body;
        // console.log(taskUpdate);
        const { sub_id, week, description, isLateSubmission } = taskUpdate;
        try{
            const updatedStudent = await Student.findOneAndUpdate(
                {
                  sub_id,
                  'internships.0.progress.week': week,
                },
                {
                  $set: {
                    'internships.0.progress.$.description': description.trim(),
                    'internships.0.progress.$.submitted': true,
                    'internships.0.progress.$.isLateSubmission': isLateSubmission,
                  },
                },
                {
                  new: true,
                }
            );
            if(updatedStudent){
                res.status(200).json({ success: true, msg: "Add Progress Route" });
            } else{
                res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}`});
            }
        } catch (error) {
            console.error(`Error: ${error.message}`);
            res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message} `});
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}`});
    }

};

const editWeeklyProgress = async (req, res) => {
    try {
        res.status(200).json({ success: true, msg: "Edit Weekly Progress Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};

const deslugify = (slug) => {
    return slug
        .replace(/-/g, ' ') 
        .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};

const getAllStudents = async (req, res) => {

    try {

        const reqQuery = { ...req.query };
        if (reqQuery.department){
            reqQuery.department = deslugify(reqQuery.department);
        }
        const removeFields = ['select', 'sort', 'limit', 'page'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        query = Student.find(JSON.parse(queryStr));

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 100;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Student.countDocuments(query);

        query = query.skip(startIndex).limit(limit);
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        const student = await query;
        if (!student) {
            return res.status(401).json({ success: false, msg: "There are no Students" });
        }
        return res.status(200).json({ success: true, count: total, pagination, data: student });

    } catch (error) {
        console.log(`${error.message} (error)`.red);
        return res.status(400).json({ success: false, msg: error.message });
    }

};

const getOneStudent = async (req, res) => {
    try {
        const email = req.body.email;
        let person = await Student.findOne({ email}).exec();
        if (person) {
            res.json(person);
        } else{
            console.log("Did not find");
            res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
}

const approveStudent = async (req, res) => {
    try {
        var approval = req.body;
        // console.log(approval);
        const { sub_id, status, email } = approval;
        try{
            if(status){
                const updatedStudent = await Student.findOneAndUpdate(
                    {
                    sub_id
                    },
                    {
                    $set: {
                        'isApproved': true,
                    },
                    },
                    {
                    new: true,
                    }
                );
                if(updatedStudent){
                    res.status(200).json({ success: true, msg: "Approval Given" });
                } else{
                    res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
                }
            } else {
                const rejectedStudent = await Student.findOneAndDelete(
                    {
                    sub_id
                    },
                );
                const updatedMentor = await Mentor.findOneAndUpdate(
                    {email},
                    {$pull: {students: {sub_id}}},
                    {new: true}
                );
                if(rejectedStudent && updatedMentor){
                    res.status(200).json({ success: true, msg: "Approval Rejected" });
                } else{
                    res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
                }
            }
        } catch (error) {
            console.error(`Error: ${error.message}`);
            res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};

module.exports = {
    loginStudent,
    addWeeklyProgress,
    editWeeklyProgress,
    getAllStudents,
    getOneStudent,
    approveStudent,
    registerStudent
};
