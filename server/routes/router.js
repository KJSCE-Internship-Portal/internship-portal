const express = require("express");
const router = express.Router();
const controllerStudent = require("../controllers/students");
const controllerOAuth = require("../controllers/oauth");
const controllerMentor = require("../controllers/mentors");



// Get Routes
router.get("/students/all", controllerStudent.getAllStudents);
router.get("/callback", controllerOAuth.callbackCheck);
router.get("/login", controllerOAuth.handleLoginRequest);
router.get("/refresh-login", controllerOAuth.handleRefreshLogin);
router.get("/logout", controllerOAuth.logoutUser);
router.get("/mentors/all", controllerMentor.getAllMentors);


// Post Routes
router.post("/student-login", controllerStudent.loginStudent);
router.post("/student/register", controllerStudent.registerStudent);
router.post("/student/progress/add", controllerStudent.addWeeklyProgress);
router.post("/anyuser", controllerOAuth.getUserWithAccessToken);


// router.post("/login", controllerOAuth.handleLoginRequest);

//Put Routes


//Delete Routes


module.exports = router;