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
// exportToExcel/exportToPDF removed; mentor exports handled inline here
import { getCurrentIndianDateTime } from "../../Global/getTime";
import * as XLSX from "xlsx";
import axios from "axios";
import { url } from "../../Global/URL";
import { useEffect, useState } from "react";

function MentorDrawer({ isOpen, onClose, mentorData }) {
  const [fullStudents, setFullStudents] = useState([]);

  useEffect(() => {
    // when drawer opens, fetch detailed student records for each mentored student
    const fetchStudents = async () => {
      if (!mentorData || !mentorData.students || mentorData.students.length === 0) {
        setFullStudents([]);
        return;
      }
      try {
        const results = [];
        for (const s of mentorData.students) {
          try {
            const resp = await axios.post(url + "/student/find", { email: s.email });
            if (resp && resp.data) results.push(resp.data);
          } catch (err) {
            // fallback: include minimal student info if detailed fetch fails
            results.push(s);
          }
        }
        setFullStudents(results);
      } catch (err) {
        console.error("Failed to fetch full students:", err);
        setFullStudents(mentorData.students || []);
      }
    };

    if (isOpen) fetchStudents();
  }, [isOpen, mentorData]);
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Mentor Details</DrawerHeader>

        <DrawerBody maxH="80vh" overflowY="auto">
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar
                size="md"
                bg="red.700"
                color="white"
                name={mentorData.name}
                src={mentorData.profile_picture_url}
                className="h-10 w-10 mr-2"
              ></Avatar>
              <div className="flex flex-col">
                <h2 className="font-bold">{mentorData.name}</h2>
                <p>{mentorData.email}</p>
              </div>
            </div>
            <p>
              <strong>Contact No.:</strong> {mentorData.contact_no}
            </p>
            <p>
              <strong>Department:</strong> {mentorData.department}
            </p>
            <p>
              <strong>Mentored Students:</strong>
            </p>
            <ul>
              {mentorData.students &&
                mentorData.students.length > 0 &&
                mentorData.students.map((student) => (
                  <li key={student.sub_id}>
                    <div className="flex items-center space-x-4">
                      <Avatar
                        size="sm"
                        bg="red.700"
                        color="white"
                        src={student.profile_picture_url}
                        className="h-6 w-6 mr-2"
                      ></Avatar>
                      <div className="flex flex-col">
                        <p>{student.rollno}</p>
                        <p>{student.email}</p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </DrawerBody>

        <DrawerFooter>
                <Button
                  variant="outline"
                  mr={3}
                  onClick={() => {
                    // Build mentor sheet and mentor_student sheet
                    const mentorRow = [{
                      Name: mentorData.name || "",
                      Email: mentorData.email || "",
                      Phone: mentorData.contact_no || "",
                      Department: mentorData.department || "",
                      Role: mentorData.role || "MENTOR",
                    }];

                    const mentorStudentRows = (fullStudents || []).map((stu) => {
                      const internship = (stu.internships && stu.internships[0]) || {};
                      const ise = (internship.evaluation && internship.evaluation[0]) || {};
                      const ese = (internship.evaluation && internship.evaluation[1]) || {};
                      return {
                        Name: stu.name || "",
                        Email: stu.email || "",
                        Phone: stu.contact_no || "",
                        Department: stu.department || "",
                        Batch: stu.batch || "",
                        Roll: stu.rollno || stu.roll_no || "",
                        Company: internship.company || "",
                        Job_Description: internship.job_description || "",
                        Company_Mentor: internship.company_mentor || "",
                        Start_Date: internship.startDate || "",
                        End_Date: internship.endDate || "",
                        ISE_Total: ise.total_marks ? (ise.total_marks.scored || ise.total_marks.scored === 0 ? `${ise.total_marks.scored}/${ise.total_marks.outOf || ""}` : "") : (ise.total_marks_scored ? ise.total_marks_scored : ""),
                        ESE_Total: ese.total_marks ? (ese.total_marks.scored || ese.total_marks.scored === 0 ? `${ese.total_marks.scored}/${ese.total_marks.outOf || ""}` : "") : (ese.total_marks_scored ? ese.total_marks_scored : ""),
                      };
                    });

                    const wb = XLSX.utils.book_new();
                    const ws1 = XLSX.utils.json_to_sheet(mentorRow);
                    XLSX.utils.book_append_sheet(wb, ws1, "Mentor");
                    const ws2 = XLSX.utils.json_to_sheet(mentorStudentRows);
                    XLSX.utils.book_append_sheet(wb, ws2, "Mentor_Students");
                    const { date, time } = getCurrentIndianDateTime();
                    XLSX.writeFile(wb, `Mentor-${mentorData.name || mentorData._id}-${time}-${date}.xlsx`);
                  }}
                >
                  Export Excel
                </Button>
                {/* Export PDF removed as requested */}
                <Button variant="outline" mr={3} onClick={onClose}>
                  Close
                </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default MentorDrawer;
