import React, { useEffect, useState } from "react";
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
import { DownloadIcon, ViewIcon } from "@chakra-ui/icons";
import { exportToExcel, exportToPDF } from "../../Global/exportUtils";
import { getCurrentIndianDateTime } from "../../Global/getTime";
import { url } from "../../Global/URL";
import { getUserDetails } from "../../Global/authUtils";

function StudentDrawer({ isOpen, onClose, studentData }) {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const getUserRole = async () => {
      const user = await getUserDetails();
      setUserRole(user?.role);
    };
    getUserRole();
  }, []);

  const handleViewOfferLetter = async () => {
    try {
      const response = await fetch(
        `${url}/student/${studentData.sub_id}/offer-letter`
      );
      if (!response.ok) {
        alert("Offer letter not found");
        return;
      }

      const blob = await response.blob();
      const viewUrl = window.URL.createObjectURL(blob);
      window.open(viewUrl, "_blank");
      window.URL.revokeObjectURL(viewUrl);
    } catch (error) {
      console.error("Error viewing offer letter:", error);
      alert("Failed to view offer letter");
    }
  };

  const handleDownloadOfferLetter = async () => {
    try {
      const response = await fetch(
        `${url}/student/${studentData.sub_id}/offer-letter`
      );
      if (!response.ok) {
        alert("Offer letter not found");
        return;
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download =
        `${studentData.name}_offer_letter.pdf` ||
        `${studentData.rollno}_offer_letter.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading offer letter:", error);
      alert("Failed to download offer letter");
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Student Details</DrawerHeader>

        <DrawerBody maxH="80vh" overflowY="auto">
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar
                size="md"
                bg="red.700"
                color="white"
                name={studentData.name}
                src={studentData.profile_picture_url}
                className="h-10 w-10 mr-2"
              ></Avatar>
              <div className="flex flex-col">
                <h2 className="font-bold">{studentData.name}</h2>
                <p>{studentData.email}</p>
              </div>
            </div>
            <p>
              <strong>Department:</strong> {studentData.department}
            </p>
            <div className="flex items-center space-x-4">
              <p>
                <strong>Division:</strong> {studentData.div}
              </p>
              <p>
                <strong>Batch:</strong> {studentData.batch}
              </p>
            </div>
            <p>
              <strong>Roll No:</strong> {studentData.rollno}
            </p>
            <p>
              <strong>Semester:</strong> {studentData.sem}
            </p>
            <p>
              <strong>Contact No.:</strong> {studentData.contact_no}
            </p>
            {studentData.internships && studentData.internships.length > 0 && (
              <div className="border-t pt-4 space-y-2">
                <h3 className="text-lg font-bold">Internship Details</h3>
                <p>
                  <strong>Company:</strong> {studentData.internships[0].company}
                </p>
                <p>
                  <strong>Job Description:</strong>{" "}
                  {studentData.internships[0].job_description}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(studentData.internships[0].startDate)
                    .toISOString()
                    .substring(0, 10)}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(studentData.internships[0].endDate)
                    .toISOString()
                    .substring(0, 10)}
                </p>
                <p>
                  <strong>Internship Type:</strong>{" "}
                  {studentData.internships[0].internship_type === "case1"
                    ? "Case 1"
                    : "Case 2"}
                </p>
                <p>
                  <strong>Stipend Status:</strong>{" "}
                  {studentData.internships[0].stipend_status === "paid"
                    ? "Paid"
                    : "Unpaid"}
                </p>
                {studentData.internships[0].stipend_status === "paid" && (
                  <p>
                    <strong>Stipend Amount:</strong> ₹
                    {studentData.internships[0].stipend_amount}
                  </p>
                )}
                {userRole === "ADMIN" && studentData.internships[0].offer_letter && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="font-bold text-blue-900 mb-2">Offer Letter:</p>
                    <p className="text-sm mb-2">
                      <strong>File:</strong>{" "}
                      {studentData.internships[0].offer_letter.filename ||
                        "offer_letter.pdf"}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        leftIcon={<ViewIcon />}
                        colorScheme="blue"
                        variant="outline"
                        onClick={handleViewOfferLetter}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        leftIcon={<DownloadIcon />}
                        colorScheme="blue"
                        variant="outline"
                        onClick={handleDownloadOfferLetter}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DrawerBody>

        <DrawerFooter>
          <Button
            variant="outline"
            mr={3}
            onClick={() => {
              const { date, time } = getCurrentIndianDateTime();
              const filename = `Student-${studentData.name || studentData.rollno}-${time}-${date}`;
              // Export student details (keep evaluation marks; filtering of unwanted fields
              // is handled centrally in exportUtils)
              const cloned = JSON.parse(JSON.stringify(studentData || {}));
              exportToExcel(`${filename}.xlsx`, [cloned]);
            }}
          >
            Export Excel
          </Button>
          <Button
            variant="outline"
            mr={3}
            onClick={() => {
              const { date, time } = getCurrentIndianDateTime();
              const filename = `Student-${studentData.name || studentData.rollno}-${time}-${date}`;
              exportToPDF(`${filename}.pdf`, studentData);
            }}
          >
            Export PDF
          </Button>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default StudentDrawer;
