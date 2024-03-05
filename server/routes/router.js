const express = require("express");
const multer = require('multer');
const router = express.Router();
const controllerStudent = require("../controllers/students");
const controllerOAuth = require("../controllers/oauth");
const controllerMentor = require("../controllers/mentors");
const controllerCoordinator = require("../controllers/coordinators");
const controllerAdmin = require("../controllers/admin");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

// Get Routes
router.get("/students/all", controllerStudent.getAllStudents);
router.get("/callback", controllerOAuth.callbackCheck);
router.get("/login", controllerOAuth.handleLoginRequest);
router.get("/refresh-login", controllerOAuth.handleRefreshLogin);
router.get("/logout", controllerOAuth.logoutUser);
router.get("/mentors/all", controllerMentor.getAllMentors);
router.get("/announcements/all", controllerAdmin.getAllAnnouncements);
router.get("/coordinators/all", controllerCoordinator.getAllCoordinators);
router.get("/download-template", controllerCoordinator.downloadCSVTemplate);



// Post Routes
router.post("/student-login", controllerStudent.loginStudent);
router.post("/student/register", controllerStudent.registerStudent);
router.post("/student/progress/add", controllerStudent.addWeeklyProgress);
router.post("/anyuser", controllerOAuth.getUserWithAccessToken);
router.post("/student/find", controllerStudent.getOneStudent);
router.post("/student/approve", controllerStudent.approveStudent);
router.post("/student/evaluation/add", controllerStudent.addWorkDone);
router.post("/student/certificate/upload", upload.single('file'), controllerStudent.uploadCertificate);
router.post("/mentor/comment/add", controllerMentor.addPrivateComments);
router.post("/mentor/student/evaluation", controllerMentor.studentEvaluation);
router.post("/mentor/student/evaluation/setdate", controllerMentor.scheduleEvaluation);
router.post("/remove/mentor", controllerMentor.removeMentor);
router.post("/mentor/student/evaluation/upload", upload.single('file'), controllerMentor.uploadSignedDocument);
router.post('/coordinator/add/mentor', controllerCoordinator.addMentor);
router.post('/coordinator/add/mentors', controllerCoordinator.addMentors);
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