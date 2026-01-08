const express = require("express");
const multer = require("multer");
const router = express.Router();
const controllerStudent = require("../controllers/students");
const controllerOAuth = require("../controllers/oauth");
const controllerMentor = require("../controllers/mentors");
const controllerCoordinator = require("../controllers/coordinators");
const controllerAdmin = require("../controllers/admin");
const middleware = require("../middleWare/middleware");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Small upload instance specifically for offer_letter (limit 100 KB)
const smallUpload = multer({ storage: storage, limits: { fileSize: 100 * 1024 } });

// Get Routes
router.get("/students/all", controllerStudent.getAllStudents);
router.get("/callback", controllerOAuth.callbackCheck);
router.get("/login", controllerOAuth.handleLoginRequest);
router.get("/refresh-login", controllerOAuth.handleRefreshLogin);
router.get("/logout", controllerOAuth.logoutUser);
router.get("/mentors/all", controllerMentor.getAllMentors);
router.get("/announcements/all", middleware.protect, controllerAdmin.getAllAnnouncements);
router.get("/coordinators/all", controllerCoordinator.getAllCoordinators);
router.get("/download-template", controllerCoordinator.downloadCSVTemplate);
router.get("/download-template-admin", controllerAdmin.downloadCSVTemplate);
router.get(
  "/donload-student-template",
  controllerCoordinator.downloadStudentTemplate
);
router.get("/student/:sub_id/offer-letter", controllerStudent.downloadOfferLetter);

// Post Routes
router.post("/student-login", controllerStudent.loginStudent);
router.post(
  "/student/register",
  function (req, res, next) {
    smallUpload.single("offer_letter")(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ success: false, msg: "Offer letter must be 100 KB or smaller." });
        }
        return res.status(400).json({ success: false, msg: err.message });
      }
      next();
    });
  },
  controllerStudent.registerStudent
);
router.post("/student/progress/add", controllerStudent.addWeeklyProgress);
router.post("/anyuser", controllerOAuth.getUserWithAccessToken);
router.post("/student/find", controllerStudent.getOneStudent);
router.post("/student/approve", controllerStudent.approveStudent);
router.post("/student/evaluation/add", controllerStudent.addWorkDone);
router.post(
  "/student/certificate/upload",
  upload.single("file"),
  controllerStudent.uploadCertificate
);
router.post(
  "/student/report/upload",
  upload.single("file"),
  controllerStudent.uploadReport
);
router.post(
  "/student/other/upload",
  upload.single("file"),
  controllerStudent.uploadOther
);
router.post("/mentor/comment/add", controllerMentor.addPrivateComments);
router.post("/mentor/student/evaluation", controllerMentor.studentEvaluation);
router.post(
  "/mentor/student/evaluation/setdate",
  controllerMentor.scheduleEvaluation
);
router.post("/remove/mentor", controllerMentor.removeMentor);
router.post(
  "/mentor/student/evaluation/upload",
  upload.single("file"),
  controllerMentor.uploadSignedDocument
);
router.post("/coordinator/add/mentor", controllerCoordinator.addMentor);
router.post("/coordinator/add/mentors", controllerCoordinator.addMentors);
router.post(
  "/coordinator/mentor/assign-student",
  controllerCoordinator.assignStudent
);
router.post(
  "/coordinator/mentor/remove-assigned-student",
  controllerCoordinator.removeAssignedStudent
);
router.post(
  "/coordinator/statistics",
  controllerCoordinator.getStatisticsCoordinator
);
router.post("/coordinator/check-student", controllerCoordinator.checkStudent);
router.post("/coordinator/check-mentor", controllerCoordinator.checkMentor);
router.post(
  "/coordinator/add-students-excel",
  controllerCoordinator.AddStudentsexcel
);
router.post("/admin/statistics", controllerAdmin.getStatisticsAdmin);
router.post("/admin/add/coordinator", controllerAdmin.addCoordinator);
router.post("/admin/delete/coordinator", controllerAdmin.deleteCoordinator);
router.post("/admin/add/mentors", controllerAdmin.addMentors);
router.post("/announcement/add", controllerAdmin.postAnnouncement);
router.post(
  "/coordinator/mentor/unassign-all",
  controllerCoordinator.unassignAllStudents
);

// router.post("/login", controllerOAuth.handleLoginRequest);

//Put Routes
router.put("/student/:studentId", controllerStudent.updateStudent); //new

//Delete Routes

module.exports = router;
