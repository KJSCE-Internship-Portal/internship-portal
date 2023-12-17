const express = require("express");

const loginStudent = async (req, res) => {

    try {
        res.status(200).json({ success: true, msg: "Student Login Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }

};

const addWeeklyProgress = async (req, res) => {

    try {
        res.status(200).json({ success: true, msg: "Add Progress Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
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

const signOut = async (req, res) => {
    try {
        res.status(200).json({ success: true, msg: "Sign Out Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};

module.exports = {
    loginStudent,
    addWeeklyProgress,
    editWeeklyProgress,
    signOut
};
