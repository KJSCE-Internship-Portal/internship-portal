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
    AvatarBadge,
} from "@chakra-ui/react";

function StudentDrawer({ isOpen, onClose, studentData }) {
    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Student Details</DrawerHeader>

                <DrawerBody maxH="80vh" overflowY="auto">
                    <div className="flex flex-col items-start space-y-4">
                        <div className="flex items-center space-x-4">
                            <Avatar size="md" bg='red.700' color="white" name={studentData.name} src={studentData.profile_picture_url} className="h-10 w-10 mr-2"></Avatar>
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
                                    <strong>Company:</strong>{" "}
                                    {studentData.internships[0].company}
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
                            </div>
                        )}
                    </div>
                </DrawerBody>

                <DrawerFooter>
                    <Button variant="outline" mr={3} onClick={onClose}>
                        Close
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

export default StudentDrawer;
