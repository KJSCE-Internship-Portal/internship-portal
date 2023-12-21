const express = require("express");
const router = express.Router();
const controllerStudent = require("../controllers/students");
const controllerOAuth = require("../controllers/oauth");


// Get Routes
router.get("/students/all", controllerStudent.getAllStudents);
router.get("/callback", controllerOAuth.callbackCheck);


// Post Routes
router.post("/student-login", controllerStudent.loginStudent);
router.post("/login", controllerOAuth.handleLoginRequest);

//Put Routes


//Delete Routes


module.exports = router;