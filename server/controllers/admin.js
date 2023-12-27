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

const getStatisticsAdmin = async (req, res) => {

  try {
      const studentsInAllDepartments = await Students.countDocuments({ isActive: true });
      const assignedStudents = await Students.countDocuments({ isActive: true, hasMentor: true });
      const completedStudentsAndVerified = await Students.countDocuments({
          isActive: true,
          isApproved: true,
          'internships.0.isCompleted': true
      });

      const departmentWiseDistribution = await Students.aggregate([
        {
            $group: {
                _id: '$department',
                count: { $sum: 1 }
            }
        }
      ]);

      const avgInternshipDuration = await Students.aggregate([
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

      const totalCompletedInternshipsPercentage = await Students.aggregate([
        {
          $match: { isActive: true }
        },
        {
          $group: {
            _id: '$department',
            totalStudents: { $sum: 1 },
            completedInternships: {
              $sum: {
                $cond: [{ $eq: ['$internships.iscompleted', true] }, 1, 0]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            department: '$_id',
            completedInternshipsPercentage: {
              $multiply: [
                { $divide: ['$completedInternships', '$totalStudents'] },
                100
              ]
            }
          }
        }
      ]);

      const departmentCompletedInternshipsPercentage = await Students.aggregate([
        {
          $match: { isActive: true }
        },
        {
          $unwind: '$internships'
        },
        {
          $group: {
            _id: '$department',
            totalStudents: { $sum: 1 },
            completedInternships: {
              $sum: {
                $cond: [{ $eq: ['$internships.iscompleted', true] }, 1, 0]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            department: '$_id',
            completedInternshipsPercentage: {
              $multiply: [
                { $divide: ['$completedInternships', '$totalStudents'] },
                100
              ]
            }
          }
        }
      ]);
      

      const lateSubmissions = await Students.aggregate([
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

      const departmentProgress = await Students.aggregate([
          {
              $project: {
                  department: 1, // Assuming 'department' is a field in the Student schema
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
                  _id: '$department',
                  totalDepartmentProgress: { $sum: '$totalProgress' },
                  submittedDepartmentProgress: { $sum: '$submittedProgress' }
              }
          },
          {
              $project: {
                  department: '$_id',
                  _id: 0,
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
          studentsInAllDepartments,
          assignedStudents,
          completedStudentsAndVerified,
          departmentWiseDistribution,
          avgInternshipDuration,
          topCompanies,
          totalCompletedInternshipsPercentage,
          departmentCompletedInternshipsPercentage,
          lateSubmissions,
          departmentProgress
      };

      console.log(data);

      return res.status(200).json({ success: true, msg: "Statistics Route", data });

  } catch (error) {
      console.error(`Error: ${error.message}`);
      return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
  }
};


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
    getStatisticsAdmin
};
