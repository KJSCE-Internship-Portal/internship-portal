const express = require("express");
const Student = require('../models/student');
const Mentor = require('../models/mentor');
const Announcement = require('../models/announcements');

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
        res.status(200).json({ success: true, msg: "Successfully Completed" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};

const registerStudent = async (req, res) => {

    try {

        var student = req.body;
        // console.log(req.body.email);
        const existingStudent = await Student.findOne({email: student.email}).exec();
        
        if (existingStudent){
            return res.status(500).json({ success: false, msg: "Student Already Exists" });
        }
        const mentor = {
            email: '',
            contact_no: '',
            sub_id: ''
        };
        const evaluationStructure = () => ({
            mentor_name: '',
            exam_date: '',
            scheduled_date: '',
            exam_time: '',
            exam_venue: '',
            project_title: '',
            work_done: '',
            report_quality_marks: { outOf: 20, scored: 0 },
            oral_presentation_marks: { outOf: 20, scored: 0 },
            work_quality_marks: { outOf: 15, scored: 0 },
            work_understanding_marks: { outOf: 10, scored: 0 },
            periodic_interaction_marks: { outOf: 10, scored: 0 },
            total_marks: { outOf: 75, scored: 0 },
            examiner_specific_remarks: '',
            pdf_buffer: Buffer.from(''), // Example of an empty buffer
            student_sign: '',
            is_signed: false
        });
        student = {...student, mentor, role: 'STUDENT',internships: student.internships.map(internship => ({
            ...internship,
            evaluation: [ 
                {...evaluationStructure()}, // First evaluation
                {...evaluationStructure()}  // Second evaluation
            ]
        }))}
        
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
        console.log(student.email + " registered !".blue);
        return res.status(200).json({ success: true, msg: "Student Registration Route" });

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
    return decodeURIComponent(slug) 
        .replace(/%26/g, '&')
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
        const limit = parseInt(req.query.limit, 10) || 100000;
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

const addWorkDone = async (req, res) => {
    try {

        var taskUpdate = req.body;
        const { sub_id, work_done, student_sign, evaluation } = taskUpdate;
        try{
            if(evaluation=="ISE"){
            const updatedStudent = await Student.findOneAndUpdate(
                {
                  sub_id,
                },
                {
                  $set: {
                    'internships.0.evaluation.0.work_done': work_done.trim(),
                    'internships.0.evaluation.0.student_sign': student_sign.trim()
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
            }}
            else if(evaluation=="ESE"){
                const updatedStudent = await Student.findOneAndUpdate(
                    {
                      sub_id,
                    },
                    {
                      $set: {
                        'internships.0.evaluation.1.work_done': work_done.trim(),
                        'internships.0.evaluation.1.student_sign': student_sign.trim(),
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
                }}
        } catch (error) {
            console.error(`Error: ${error.message}`);
            res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message} `});
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}`});
    }

};

const uploadCertificate = async (req, res) => {

    try {
        if(!req.file) {
            return res.status(400).json({ success: false, msg: 'No file uploaded' });
        }
        const { sub_id } = req.body;
        console.log(sub_id);
        const finalPdfBuffer = req.file.buffer;
        const data = {
            pdf_buffer: finalPdfBuffer
        };
        const updatedStudent = await Student.findOneAndUpdate(
            {
                sub_id
            },
            {
                $push: {
                    'internships.0.completion': data,
                },
                $set: {
                    'internships.0.isCompleted': true,
                },
            },
            {
                new: true,
            }
        );
        
        if (updatedStudent) {
            return res.status(200).json({ success: true, msg: "Uploaded Student Certificate" });
        } else{
            return res.status(400).json({ success: false, msg: `Something Went Wrong` });
        }  
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};

const uploadReport = async (req, res) => {

    try {
        if(!req.file) {
            return res.status(400).json({ success: false, msg: 'No file uploaded' });
        }
        const { sub_id } = req.body;
        console.log(sub_id);
        const finalPdfBuffer = req.file.buffer;
        const data = {
            pdf_buffer: finalPdfBuffer
        };
        const updatedStudent = await Student.findOneAndUpdate(
            {
                sub_id
            },
            {
                $push: {
                    'internships.0.report': data,
                },
                $set: {
                    'internships.0.isSubmitted': true,
                },
            },
            {
                new: true,
            }
        );
        
        if (updatedStudent) {
            return res.status(200).json({ success: true, msg: "Uploaded Internship Report" });
        } else{
            return res.status(400).json({ success: false, msg: `Something Went Wrong` });
        }  
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};

const uploadOther = async (req, res) => {

    try {
        if(!req.file) {
            return res.status(400).json({ success: false, msg: 'No file uploaded' });
        }
        const { sub_id } = req.body;
        console.log(sub_id);
        const finalPdfBuffer = req.file.buffer;
        const data = {
            pdf_buffer: finalPdfBuffer
        };
        const updatedStudent = await Student.findOneAndUpdate(
            {
                sub_id
            },
            {
                $push: {
                    'internships.0.othersubmissions': data,
                },
                $set: {
                    'internships.0.isSubmittedOther': true,
                },
            },
            {
                new: true,
            }
        );
        
        if (updatedStudent) {
            return res.status(200).json({ success: true, msg: "Uploaded Document" });
        } else{
            return res.status(400).json({ success: false, msg: `Something Went Wrong` });
        }  
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};


module.exports = {
    loginStudent,
    addWeeklyProgress,
    editWeeklyProgress,
    getAllStudents,
    getOneStudent,
    approveStudent,
    registerStudent,
    addWorkDone,
    uploadCertificate,
    uploadReport,
    uploadOther
};
