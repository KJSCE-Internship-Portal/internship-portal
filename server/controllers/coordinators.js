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

const assignStudent = async (req, res) => {

    try {
        const rollno = req.body.rollno;
        const mentor_email = req.body.mentor_email;
        let student = await Student.findOne({ rollno }).exec();

        if (!student){
            res.status(200).json({ success: false, msg: `Roll no ${rollno} doesn't Exist !` });
        }
        if (student.hasMentor){
            res.status(200).json({ success: false, msg: `Roll no ${rollno} is already assigned to ${student.mentor.name}` });
        }

        let mentor = await Mentor.findOne({ email: mentor_email }).exec();

        if (!mentor){
            res.status(200).json({ success: false, msg: `Mentor ${mentor_email} doesn't Exist !` });
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

        res.status(200).json({ success: true, msg: "Student assigned successfully" });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
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

        if (student.hasMentor){
            student.hasMentor = false;
        }
        // Remove the student from the mentor's students array
        mentor.students.splice(assignedStudentIndex, 1);

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
        console.log(req.body);
        const mentor = new Mentor(req.body);
        await mentor.save();
        res.status(200).json({ success: true, msg: "Mentor Registered Successfully !" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
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

module.exports = {
    loginCoordinator,
    getAllCoordinators,
    addMentor
};
