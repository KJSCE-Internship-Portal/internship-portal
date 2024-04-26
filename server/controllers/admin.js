const express = require("express");
const Students = require("../models/student");
const Mentor = require("../models/mentor");
const Coordinator = require("../models/coordinator");
const Announcement = require("../models/announcements");

const deslugify = (slug) => {
    return slug
        .replace(/-/g, ' ')
        .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};

const postAnnouncement = async (req, res) => {
    try {

        const { department, sender, received_by, content } = req.body;

        const newAnnouncement = new Announcement({
            department,
            sender,
            received_by,
            content,
            postedAt: new Date(),
        });

        const savedAnnouncement = await newAnnouncement.save();

        if (!savedAnnouncement) {
            return res.status(500).json({ success: false, msg: "Announcement Cannot Be Posted" });
        }

        return res.status(201).json({ success: true, msg: "Announcement Posted Successfully", data: savedAnnouncement });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};

const addCoordinator = async (req, res) => {

    try {

        const coordinator = new Coordinator({ ...req.body, createdAt: new Date() });
        var existing_coordinator = await Coordinator.findOne({ email: req.body.email }).exec();
        var existing_mentor = await Mentor.findOneAndUpdate({ email: req.body.email }, { isActive: false, isApproved: false }, { new: true });
        if (existing_coordinator) {
            return res.status(201).json({ success: false, msg: `Coordinator Already Exists` });
        } else if (!existing_mentor && !existing_coordinator) {
            await coordinator.save();
            return res.status(200).json({ success: true, msg: "Coordinator Registered Successfully !" });
        } else if (existing_mentor && !existing_coordinator) {
            return res.status(500).json({ success: false, msg: "A Mentor with the same E-mail ID is already Registered !" });
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }

};

const deleteCoordinator = async (req, res) => {
    try {
        const coordinator = await Coordinator.findById(req.body.id).exec();
        if (!coordinator) {
            return res.status(404).json({ success: false, msg: "Coordinator not found" });
        }
        console.log(`${coordinator.name} has been deleted`);
        await Coordinator.findByIdAndDelete(req.body.id).exec();

        return res.status(200).json({ success: true, msg: "Coordinator deleted successfully" });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something went wrong: ${error.message}` });
    }
};


const getAllAnnouncements = async (req, res) => {
    try {
        const reqQuery = { ...req.query };

        if (reqQuery.department) {
            reqQuery.department = reqQuery.department.split(',');
            reqQuery.department = reqQuery.department.map(dep => deslugify(dep));
        }
        console.log(reqQuery)

        const removeFields = ['select', 'sort', 'limit', 'page'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        query = Announcement.find(JSON.parse(queryStr));

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
        const total = await Announcement.countDocuments(query);

        query = query.skip(startIndex).limit(limit);
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }

        const announcements = await query;

        if (!announcements) {
            return res.status(401).json({ success: false, msg: "There are no Announcements" });
        }

        return res.status(200).json({ success: true, count: total, pagination, data: announcements });

    } catch (error) {
        console.log(`${error.message} (error)`.red);
        return res.status(400).json({ success: false, msg: error.message });
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
                $limit: 50
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
                    department: 1, 
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

        // const departmentWiseStudentDistribution = await Students.aggregate([
        //     {
        //         $group: {
        //             _id: "$department",
        //             count: { $sum: 1 }
        //         }
        //     },
        //     {
        //         $project: {
        //             department: "$_id",
        //             count: 1,
        //             _id: 0
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             departments: { $push: { k: "$department", v: "$count" } }
        //         }
        //     },
        //     {
        //         $replaceRoot: {
        //             newRoot: { $arrayToObject: "$departments" }
        //         }
        //     }
        // ]);

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
            departmentProgress,
            // departmentWiseStudentDistribution,
        };

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
    postAnnouncement,
    signOutAdmin,
    getStatisticsAdmin,
    getAllAnnouncements,
    addCoordinator,
    deleteCoordinator,
};
