const express = require("express");
const Mentor = require('../models/mentor')

const loginMentor = async (req, res) => {

    try {
        res.status(200).json({ success: true, msg: "Mentor Login Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }

};

const viewAssignedStudents = async (req, res) => {

    try {
        res.status(200).json({ success: true, msg: "View Assigned Students Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }

};

const addPrivateComments = async (req, res) => {

    try {
        res.status(200).json({ success: true, msg: "Add Private Comments Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }

};

const editPrivateComments = async (req, res) => {
    try {
        res.status(200).json({ success: true, msg: "Edit Private Comments Route" });
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

const getAllMentors = async (req, res) => {

    try {

        const reqQuery = { ...req.query };
        if (reqQuery.department){
            reqQuery.department = deslugify(reqQuery.department);
        }
        const removeFields = ['select', 'sort', 'limit', 'page'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        query = Mentor.find(JSON.parse(queryStr));

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
        const total = await Mentor.countDocuments(query);

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

        const mentor = await query;
        if (!mentor) {
            return res.status(401).json({ success: false, msg: "There are no Students" });
        }
        return res.status(200).json({ success: true, count: total, pagination, data: mentor });

    } catch (error) {
        console.log(`${error.message} (error)`.red);
        return res.status(400).json({ success: false, msg: error.message });
    }

};

module.exports = {
    loginMentor,
    viewAssignedStudents,
    addPrivateComments,
    editPrivateComments,
    getAllMentors
};
