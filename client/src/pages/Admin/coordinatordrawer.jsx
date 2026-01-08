import React from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Avatar,
} from "@chakra-ui/react";
import axios from "axios";
import { url } from "../../Global/URL";
import { useTheme } from "../../Global/ThemeContext";
import showToast from "../../Global/Toast";
import { useToast } from "@chakra-ui/react";
import Alert from "../../components/Alert/alert";
// exportToPDF removed for coordinators; coordinator Excel produced with Mentor and Mentor_Student sheets
import { getCurrentIndianDateTime } from "../../Global/getTime";
import * as XLSX from "xlsx";

function CoordinatorDrawer({ isOpen, onClose, coordinatorData }) {
  const deleteCoordiator = async (id) => {
    try {
      const response = await axios.post(url + "/admin/delete/coordinator", {
        id: id,
      });
      if (response.data.success) {
        showToast(toast, "Success", "success", "Co-ordinator Deleted !");
      } else {
        showToast(toast, "Warning", "info", "No Co-ordinator exist !");
      }
    } catch (error) {
      showToast(toast, "Error", "error", "Something Went Wrong !");
    }
  };

  const toast = useToast();
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Coordinator Details</DrawerHeader>

        <DrawerBody maxH="80vh" overflowY="auto">
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar
                size="md"
                bg="red.700"
                color="white"
                name={coordinatorData.name}
                src={coordinatorData.profile_picture_url}
                className="h-10 w-10 mr-2"
              ></Avatar>
              <div className="flex flex-col">
                <h2 className="font-bold">{coordinatorData.name}</h2>
                <p>{coordinatorData.email}</p>
              </div>
            </div>
            <p>
              <strong>Contact No.:</strong> {coordinatorData.contact_no}
            </p>
            <p>
              <strong>Department:</strong> {coordinatorData.department}
            </p>
          </div>
        </DrawerBody>

        <DrawerFooter>
          <Button
            variant="outline"
            mr={3}
            onClick={async () => {
              try {
                // Build Coordinator sheet
                const coordRow = [{
                  Name: coordinatorData.name || "",
                  Email: coordinatorData.email || "",
                  Phone: coordinatorData.contact_no || "",
                  Department: coordinatorData.department || "",
                  Role: coordinatorData.role || "COORDINATOR",
                }];

                // Fetch mentors for this coordinator's department
                const dept = coordinatorData.department || "";
                let mentors = [];
                try {
                  const resp = await axios.get(url + `/mentors/all?department=${encodeURIComponent(dept)}`);
                  mentors = resp && resp.data && resp.data.data ? resp.data.data : [];
                } catch (err) {
                  mentors = [];
                }

                const mentorRows = (mentors || []).map((m) => ({
                  Name: m.name || "",
                  Email: m.email || "",
                  Phone: m.contact_no || "",
                  Department: m.department || "",
                  Role: m.role || "MENTOR",
                }));

                // Build Mentor_Student rows by fetching full student records for each mentor's students
                const mentorStudentRows = [];
                for (const m of mentors || []) {
                  if (!m.students || m.students.length === 0) continue;
                  for (const s of m.students) {
                    let full = s;
                    try {
                      const r = await axios.post(url + "/student/find", { email: s.email });
                      if (r && r.data) full = r.data;
                    } catch (e) {
                      // fallback to minimal data
                    }
                    const internship = (full.internships && full.internships[0]) || {};
                    mentorStudentRows.push({
                      Name: full.name || "",
                      Email: full.email || "",
                      Phone: full.contact_no || "",
                      Department: full.department || "",
                      Batch: full.batch || "",
                      Roll: full.rollno || full.roll_no || "",
                      Company: internship.company || "",
                      Job_Description: internship.job_description || "",
                      Company_Mentor: internship.company_mentor || "",
                      Start_Date: internship.startDate || "",
                      End_Date: internship.endDate || "",
                      Mentor_Name: m.name || "",
                    });
                  }
                }

                // Create workbook
                const wb = XLSX.utils.book_new();
                const ws1 = XLSX.utils.json_to_sheet(coordRow);
                XLSX.utils.book_append_sheet(wb, ws1, "Coordinator");
                const ws2 = XLSX.utils.json_to_sheet(mentorRows);
                XLSX.utils.book_append_sheet(wb, ws2, "Mentor");
                const ws3 = XLSX.utils.json_to_sheet(mentorStudentRows);
                XLSX.utils.book_append_sheet(wb, ws3, "MENTOR_STUDENT");
                const { date, time } = getCurrentIndianDateTime();
                XLSX.writeFile(wb, `Coordinator-${coordinatorData.name || coordinatorData._id}-${time}-${date}.xlsx`);
              } catch (err) {
                console.error("Failed to export coordinator Excel:", err);
              }
            }}
          >
            Export Excel
          </Button>
          <Button
            variant="outline"
            colorScheme="red"
            mr={3}
            onClick={() => deleteCoordiator(coordinatorData._id)}
          >
            Delete
          </Button>
          <Button w={60} mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default CoordinatorDrawer;
