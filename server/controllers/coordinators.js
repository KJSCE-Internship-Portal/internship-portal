const express = require("express");
const Coordinator = require('../models/coordinator');
const Student = require('../models/student');
const Mentor = require('../models/mentor');

const loginCoordinator = async (req, res) => {

    try {
        res.status(200).json({ success: true, msg: "Coordinator Login Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};

const checkStudent = async (req, res) => {
  try {
    const email = req.body.email;
    const student = await Student.findOne({ email }).exec();
    if (!student) {
      return res.status(200).json({ success: true, isRegistered: false });
    }
    return res.status(200).json({ success: true, isRegistered: true });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
  }
};

const checkMentor = async (req, res) => {
  try {
    const email = req.body.email;
    const mentor = await Mentor.findOne({ email }).exec();
    if (!mentor) {
      return res.status(200).json({ success: true, isRegistered: false });
    }
    return res.status(200).json({ success: true, isRegistered: true });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}`});
  }
};
const assignStudent = async (req, res) => {

    try {
        const rollno = req.body.rollno;
        const student_email = req.body.student_email;
        const mentor_email = req.body.mentor_email;
        const coordinator_department = req.body.department;

        let student = await Student.findOne({ rollno }).exec();
        console.log(rollno, mentor_email, coordinator_department);
        if (!student) {
            return res.status(200).json({ success: false, msg: `Roll no ${rollno} doesn't Exist !` });
        }
        if (student.email != student_email) {
            return res.status(200).json({ success: false, msg: `${rollno} and ${student_email} does not belong to same student` });
        }
        if (student.hasMentor) {
            return res.status(200).json({ success: false, msg: `Roll no ${rollno} is already assigned to ${student.mentor.name}` });
        }
        if (student.department != coordinator_department) {
            return res.status(200).json({ success: false, msg: `Roll no ${rollno} does not belong to your department` });
        }

        let mentor = await Mentor.findOne({ email: mentor_email }).exec();

        if (!mentor) {
            return res.status(200).json({ success: false, msg: `Mentor ${mentor_email} doesn't Exist !` });
        }

        // Check if the student is already assigned to the mentor
        const isStudentAssigned = mentor.students.some(mentor_student => student.sub_id === mentor_student.sub_id);

        if (isStudentAssigned) {
            return res.status(200).json({ success: false, msg: `Student ${rollno} already assigned to the ${mentor_email}.` });
        }

        const mentorDetails = {
            name: mentor.name,
            email: mentor.email,
            contact_no: mentor.contact_no
        }

        // Add the student to the mentor's students array
        mentor.students.push({ sub_id: student.sub_id, rollno: student.rollno, email: student.email });

        // Add the Mentor to the student Object
        student.mentor = mentorDetails;
        student.hasMentor = true;

        await student.save();
        await mentor.save();
        console.log("Assigned Student")
        return res.status(200).json({ success: true, msg: "Student assigned successfully" });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }

};

const removeAssignedStudent = async (req, res) => {
    try {
        const rollno = req.body.rollno;
        const mentor_email = req.body.mentor_email;
      
        let student = await Student.findOne({ rollno }).exec();

        if (!student) {
            return res.status(200).json({ success: false, msg: `Roll no ${rollno} doesn't Exist !` });
        }

        let mentor = await Mentor.findOne({ email: mentor_email }).exec();

        if (!mentor) {
            return res.status(200).json({ success: false, msg: `Mentor ${mentor_email} doesn't Exist !` });
        }

        // Check if the student is assigned to the mentor
        const assignedStudentIndex = mentor.students.findIndex(mentor_student => student.sub_id === mentor_student.sub_id);

        if (assignedStudentIndex === -1) {
            return res.status(200).json({ success: false, msg: `Student ${rollno} is not assigned to ${mentor_email}.` });
        }

        if (student.hasMentor) {
            student.hasMentor = false;
        }
        // Remove the student from the mentor's students array
        mentor.students.splice(assignedStudentIndex, 1);
        student.hasMentor = false;

        await mentor.save();
        await student.save();

        res.status(200).json({ success: true, msg: "Student removed successfully" });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};

const addMentor = async (req, res) => {

    try {
        const mentor = new Mentor(req.body);
        var existing_mentor = await Mentor.findOne({ email: req.body.email }).exec();
        var stu = await Student.findOne({email: req.body.email}).exec();
        if (existing_mentor) {
          if(!existing_mentor.isActive){
            await Mentor.findOneAndUpdate({ email: req.body.email }, { isActive: true });
            return res.status(200).json({ success: true, msg: "Mentor Registered Successfully !" });
          }else{
            return res.status(201).json({ success: false, msg: `Mentor Already Exists` });
          } 
        } else if (!stu && !existing_mentor){
            await mentor.save();
            return res.status(200).json({ success: true, msg: "Mentor Registered Successfully !" });
        } else if (stu && !existing_mentor){
            return res.status(500).json({ success: false, msg: "A student with the same E-mail ID is already Registered !" });
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }

};

const addMentors = async (req, res) => {

  try {
      const mentors = req.body.csvData;
      const department = req.body.department;
      var count = 0;
      for (const mentorData of mentors) {
          
          const existing_mentor = await Mentor.findOne({ email: mentorData.email }).exec();
          // const stu = await Student.findOneAndUpdate({ email: mentorData.email }, { isActive: false, isApproved: false }, { new: true });
          var stu = await Student.findOne({email: req.body.email}).exec();

          if (!stu && !existing_mentor) {
              const mentor = new Mentor({...mentorData, department});
              await mentor.save();
              count++;
          }

          else if (!stu && !existing_mentor.isActive) {
              await Mentor.findOneAndUpdate({ email: mentorData.email }, { isActive: true });
              count++;
          }
      }
      return res.status(200).json({ success: count>0 ? true : false, msg: `${count} Mentors registered !` });
  } catch (error) {
      console.error(`Error: ${error.message}`);
      res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
  }
};

//new
const AddStudentsexcel = async (req, res) => {

  try {
      const mentors = req.body.csvData;
      const department = req.body.department;
      var count = 0;
      for (const mentorData of mentors) {
          
          const existing_mentor = await Mentor.findOne({ email: mentorData.email }).exec();
          // const stu = await Student.findOneAndUpdate({ email: mentorData.email }, { isActive: false, isApproved: false }, { new: true });
          var stu = await Student.findOne({email: req.body.email}).exec();

          if (!stu && !existing_mentor) {
              const mentor = new Mentor({...mentorData, department});
              await mentor.save();
              count++;
          }

          else if (!stu && !existing_mentor.isActive) {
              await Mentor.findOneAndUpdate({ email: mentorData.email }, { isActive: true });
              count++;
          }
      }
      return res.status(200).json({ success: count>0 ? true : false, msg: `${count} Mentors registered !` });
  } catch (error) {
      console.error(`Error: ${error.message}`);
      res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
  }
};
//end//

const getStatisticsCoordinator = async (req,res) => {
    try {

        const department = req.body.department;
        const studentsInDepartment = await Student.countDocuments({ department, isActive: true });
        const assignedStudents = await Student.countDocuments({
            isActive: true,
            hasMentor: true,
            department
        });
        const completedStudentsAndVerified = await Student.countDocuments({
            isActive: true,
            isApproved: true,
            'internships.0.isCompleted': true,
            department
        });
        const divWiseDistribution = await Student.aggregate([
            {
              $match: {
                department: department,
              },
            },
            {
              $group: {
                _id: '$div',
                count: { $sum: 1 },
              },
            },
          ]);
          const batchWiseDistribution = await Student.aggregate([
            {
              $match: {
                department: department,
              },
            },
            {
              $group: {
                _id: '$batch',
                count: { $sum: 1 },
              },
            },
          ]);
          const avgInternshipDuration = await Student.aggregate([
            {
              $match: { department }
            },
            {
              $unwind: '$internships'
            },
            {
              $addFields: {
                internshipDuration: {
                  $divide: [
                    { $subtract: ['$internships.endDate', '$internships.startDate'] },
                    1000 * 60 * 60 * 24 * 7 
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                avgDuration: { $avg: '$internshipDuration' }
              }
            }
          ]);

          const topCompanies = await Student.aggregate([
            {
              $match: { department }
            },
            {
              $unwind: '$internships'
            },
            {
              $group: {
                _id: '$internships.company',
                count: { $sum: 1 }
              }
            },
            {
              $sort: { count: -1 }
            },
            {
              $limit: 5
            }
          ]);
          const completedInternshipsPercentage = await Student.aggregate([
            {
              $match: { department }
            },
            {
              $project: {
                totalInternships: { $size: '$internships' },
                completedInternships: {
                  $size: {
                    $filter: {
                      input: '$internships',
                      as: 'internship',
                      cond: { $eq: ['$$internship.isCompleted', true] }
                    }
                  }
                }
              }
            },
            {
              $group: {
                _id: null,
                totalInternships: { $sum: '$totalInternships' },
                completedInternships: { $sum: '$completedInternships' }
              }
            },
            {
              $project: {
                completedPercentage: { $multiply: [{ $divide: ['$completedInternships', '$totalInternships'] }, 100] }
              }
            }
          ]);
          const lateSubmissions = await Student.aggregate([
            {
              $match: {
                department
              }
            },
            {
              $project: {
                lateSubmissions: {
                  $size: {
                    $filter: {
                      input: '$internships.0.progress',
                      as: 'progress',
                      cond: { $eq: ['$$progress.isLateSubmission', true] }
                    }
                  }
                }
              }
            },
            {
              $group: {
                _id: null,
                totalLateSubmissions: { $sum: '$lateSubmissions' }
              }
            }
          ]);
          const departmentProgress = await Student.aggregate([
            {
              $match: {
                department: department
              }
            },
            {
              $project: {
                totalProgress: { $size: '$internships.progress' },
                submittedProgress: {
                  $size: {
                    $filter: {
                      input: '$internships.progress',
                      as: 'progress',
                      cond: { $eq: ['$$progress.submitted', true] }
                    }
                  }
                }
              }
            },
            {
              $group: {
                _id: null,
                totalDepartmentProgress: { $sum: '$totalProgress' },
                submittedDepartmentProgress: { $sum: '$submittedProgress' }
              }
            },
            {
              $project: {
                departmentProgressPercentage: {
                  $cond: {
                    if: { $eq: ['$totalDepartmentProgress', 0] },
                    then: 0,
                    else: {
                      $multiply: [
                        { $divide: ['$submittedDepartmentProgress', '$totalDepartmentProgress'] },
                        100
                      ]
                    }
                  }
                }
              }
            }
          ]);
          

        const data = {
            studentsInDepartment,
            assignedStudents,
            completedStudentsAndVerified,
            batchWiseDistribution,
            divWiseDistribution,
            avgInternshipDuration,
            topCompanies,
            completedInternshipsPercentage,
            lateSubmissions,
            departmentProgress
        }

        console.log(data);

        return res.status(200).json({ success: true, msg: "Statistics Route", data });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};

const getAllCoordinators = async (req, res) => {

    try {

        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'limit', 'page'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        query = Coordinator.find(JSON.parse(queryStr));

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
        const total = await Coordinator.countDocuments(query);

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

        const coordinator = await query;
        if (!coordinator) {
            return res.status(401).json({ success: false, msg: "There are no Coordinators" });
        }
        return res.status(200).json({ success: true, count: total, pagination, data: coordinator });

    } catch (error) {
        console.log(`${error.message} (error)`.red);
        return res.status(400).json({ success: false, msg: error.message });
    }

};

const downloadCSVTemplate = async  (req, res) => {
  try {
      const filePath = './assets/faculty-upload-template.xlsx'
      return res.download(filePath);
  } catch (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ success: false, msg: `Something Went Wrong ${error.message}` });
  }

};
//new//
const downloadStudentTemplate = async (req, res) => {
  try {
      const filePath = './assets/faculty-upload-Student.xlsx';
      return res.download(filePath);
  } catch (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ success: false, msg: `Something Went Wrong ${error.message}` });
  }
};
//end//

module.exports = {
    loginCoordinator,
    getAllCoordinators,
    addMentor,
    addMentors,
    AddStudentsexcel,
    assignStudent,
    removeAssignedStudent,
    downloadCSVTemplate,
    downloadStudentTemplate,
    getStatisticsCoordinator,
    checkStudent,
    checkMentor
};
