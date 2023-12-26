const express = require("express");
const Students = require("../models/student");
const Mentor = require("../models/mentor");

const loginAdmin = async (req, res) => {

    try {
        res.status(200).json({ success: true, msg: "Student Login Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }

};

const getStatistics = async (req,res) => {
    try {

        const department = req.body.department;

        const students = await Students.countDocuments({ isActive: true });
        const studentsInDepartment = await Students.countDocuments({ department, isActive: true });
        const assignedStudents = await Students.countDocuments({
            isActive: true,
            hasMentor: true,
            department
        });
        const completedStudentsAndVerified = await Students.countDocuments({
            isActive: true,
            isApproved: true,
            'internships.0.isCompleted': true,
            department
        });
        const divWiseDistribution = await Students.aggregate([
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
          const batchWiseDistribution = await Students.aggregate([
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
          const avgInternshipDuration = await Students.aggregate([
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

          const topCompanies = await Students.aggregate([
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

          const completedInternshipsPercentage = await Students.aggregate([
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
        //   const lateSubmissions = await Student.aggregate([
        //     {
        //       $match: {
        //         department ,
        //         'internships.progress.isLateSubmission': true
        //       }
        //     },
        //     {
        //       $count: 'totalLateSubmissions'
        //     }
        //   ]);

        const data = {
            students,
            studentsInDepartment,
            assignedStudents,
            completedStudentsAndVerified,
            batchWiseDistribution,
            divWiseDistribution,
            avgInternshipDuration,
            topCompanies,
            completedInternshipsPercentage,
            // lateSubmissions
        }

        console.log(data);

        return res.status(200).json({ success: true, msg: "Statistics Route", data });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
}


const signOutAdmin = async (req, res) => {
    try {
        res.status(200).json({ success: true, msg: "Sign Out Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};

module.exports = {
    loginAdmin,
    signOutAdmin,
    getStatistics
};
