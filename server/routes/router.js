const express = require("express");
const router = express.Router();
const controllerStudent = require("../controllers/students");


// Get Routes
router.get("/students/all", controllerStudent.getAllStudents);


// Post Routes
router.post("/student-login", controllerStudent.loginStudent);


//Put Routes


//Delete Routes


module.exports = router;