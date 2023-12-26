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

const getStatistics = () => {
    try {

        var students = Students.countDocuments({isActive: true});
        var studentsIT = Students.countDocuments({department: 'Information Technology', isActive: true});

        const data = {
            students, 
            studentsIT
        }

        console.log(data);

        return res.status(200).json({ success: true, msg: "Statistics Route", data});

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
