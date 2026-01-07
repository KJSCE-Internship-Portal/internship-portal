const express = require("express");
const multer = require('multer');
const router = express.Router();
const controllerStudent = require("../controllers/students");
const controllerOAuth = require("../controllers/oauth");
const controllerMentor = require("../controllers/mentors");
const controllerCoordinator = require("../controllers/coordinators");
const controllerAdmin = require("../controllers/admin");
const middleware = require("../middleWare/middleware");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

// Get Routes
router.get("/students/all",middleware.protectStudent, controllerStudent.getAllStudents);
router.get("/callback", controllerOAuth.callbackCheck);
router.get("/login", controllerOAuth.handleLoginRequest);
router.get("/refresh-login", controllerOAuth.handleRefreshLogin);
router.get("/logout", controllerOAuth.logoutUser);
router.get("/mentors/all",middleware.protectStudent, controllerMentor.getAllMentors);
router.get("/announcements/all", controllerAdmin.getAllAnnouncements);
router.get("/coordinators/all",middleware.protectMentor, controllerCoordinator.getAllCoordinators);
router.get("/download-template",middleware.protectMentor, controllerCoordinator.downloadCSVTemplate);
router.get("/donload-student-template",middleware.protectMentor, controllerCoordinator.downloadStudentTemplate);//new//
router.get("/download-template-admin",middleware.protectMentor, controllerAdmin.downloadCSVTemplate)





// Post Routes
router.post("/student-login", controllerStudent.loginStudent);
router.post("/student/register", controllerStudent.registerStudent);
router.post("/student/progress/add",middleware.protect, controllerStudent.addWeeklyProgress);
router.post("/anyuser",middleware.protect, controllerOAuth.getUserWithAccessToken);
router.post("/student/find",middleware.protectStudent, controllerStudent.getOneStudent);
router.post("/student/approve",middleware.protectStudent, controllerStudent.approveStudent);
router.post("/student/evaluation/add", controllerStudent.addWorkDone);
router.post("/student/certificate/upload",middleware.protect, upload.single('file'), controllerStudent.uploadCertificate);
router.post("/student/report/upload",middleware.protect, upload.single('file'), controllerStudent.uploadReport);
router.post("/student/other/upload",middleware.protect, upload.single('file'), controllerStudent.uploadOther);
router.post("/mentor/comment/add",middleware.protect, controllerMentor.addPrivateComments);
router.post("/mentor/student/evaluation",middleware.protectStudent, controllerMentor.studentEvaluation);
router.post("/mentor/student/evaluation/setdate",middleware.protectStudent, controllerMentor.scheduleEvaluation);
router.post("/remove/mentor",middleware.protectMentor, controllerMentor.removeMentor);
router.post("/mentor/student/evaluation/upload",middleware.protectStudent, upload.single('file'), controllerMentor.uploadSignedDocument);
router.post('/coordinator/add/mentor',middleware.protectMentor, controllerCoordinator.addMentor);
router.post('/coordinator/add/mentors',middleware.protectMentor, controllerCoordinator.addMentors);
router.post("/coordinator/mentor/assign-student",middleware.protectMentor, controllerCoordinator.assignStudent);
router.post("/coordinator/mentor/remove-assigned-student",middleware.protectMentor, controllerCoordinator.removeAssignedStudent);
router.post("/coordinator/statistics",middleware.protectMentor, controllerCoordinator.getStatisticsCoordinator);
router.post("/coordinator/check-student",middleware.protectMentor, controllerCoordinator.checkStudent);
router.post("/coordinator/check-mentor",middleware.protectMentor, controllerCoordinator.checkMentor);
router.post("/coordinator/add-students-excel",middleware.protectMentor, controllerCoordinator.AddStudentsexcel);
router.post("/admin/statistics",middleware.protectCoordinator, controllerAdmin.getStatisticsAdmin);
router.post("/admin/add/coordinator",middleware.protectCoordinator, controllerAdmin.addCoordinator);
router.post("/admin/delete/coordinator",middleware.protectCoordinator, controllerAdmin.deleteCoordinator);
router.post('/admin/add/mentors',middleware.protectCoordinator, controllerAdmin.addMentors);
router.post("/announcement/add",middleware.protectMentor, controllerAdmin.postAnnouncement);
router.post("/coordinator/mentor/unassign-all",middleware.protectMentor, controllerCoordinator.unassignAllStudents);




// router.post("/login", controllerOAuth.handleLoginRequest);

//Put Routes


//Delete Routes


module.exports = router;