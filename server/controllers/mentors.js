const express = require("express");

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

const signOut = async (req, res) => {
    try {
        res.status(200).json({ success: true, msg: "Sign Out Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};

module.exports = {
    loginMentor,
    viewAssignedStudents,
    addPrivateComments,
    editPrivateComments,
    signOut
};
