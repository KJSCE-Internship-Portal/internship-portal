const express = require("express");
const router = express.Router();
const controllerStudent = require("../controllers/students");
const controllerOAuth = require("../controllers/oauth");
const controllerMentor = require("../controllers/mentors");
const controllerCoordinator = require("../controllers/coordinators");
const controllerAdmin = require("../controllers/admin");



// Get Routes
router.get("/students/all", controllerStudent.getAllStudents);
router.get("/callback", controllerOAuth.callbackCheck);
router.get("/login", controllerOAuth.handleLoginRequest);
router.get("/refresh-login", controllerOAuth.handleRefreshLogin);
router.get("/logout", controllerOAuth.logoutUser);
router.get("/mentors/all", controllerMentor.getAllMentors);
router.get("/announcements/all", controllerAdmin.getAllAnnouncements);



// Post Routes
router.post("/student-login", controllerStudent.loginStudent);
router.post("/student/register", controllerStudent.registerStudent);
router.post("/student/progress/add", controllerStudent.addWeeklyProgress);
router.post("/anyuser", controllerOAuth.getUserWithAccessToken);
router.post("/student/find", controllerStudent.getOneStudent);
router.post("/student/approve", controllerStudent.approveStudent);
router.post("/mentor/comment/add", controllerMentor.addPrivateComments);
router.post('/coordinator/add/mentor', controllerCoordinator.addMentor);
router.post("/coordinator/mentor/assign-student", controllerCoordinator.assignStudent);
router.post("/coordinator/mentor/remove-assigned-student", controllerCoordinator.removeAssignedStudent);
router.post("/coordinator/statistics", controllerCoordinator.getStatisticsCoordinator);
router.post("/admin/statistics", controllerAdmin.getStatisticsAdmin);
router.post("/admin/add/coordinator", controllerAdmin.addCoordinator);
router.post("/announcement/add", controllerAdmin.postAnnouncement);


// router.post("/login", controllerOAuth.handleLoginRequest);

//Put Routes


//Delete Routes


module.exports = router;