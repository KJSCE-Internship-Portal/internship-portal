import React, { useState, useEffect } from "react";
import Loader from "../../../components/loader/Loader";
import { useTheme } from "../../../Global/ThemeContext";
import styles from "./Home.module.css";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "../../../Global/URL";
import { Link } from "react-router-dom";
import { getUserDetails } from "../../../Global/authUtils";
import RegisterMentor from "../Mentor/RegisterMentor/RegisterMentor";
import AddStudents from "../Mentor/RegisterMentor/AddStudents";
import { LinkIcon, SearchIcon, DownloadIcon } from "@chakra-ui/icons";
// Using Chakra UI icons instead of lucide-react
import { CloseIcon, EditIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  AbsoluteCenter,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { exportToExcel, exportToPDF } from "../../../Global/exportUtils";
import { getCurrentIndianDateTime } from "../../../Global/getTime";

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove non-word characters
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

// Helper to extract evaluation marks and status reliably
const getEvaluation = (student, evalName) => {
  try {
    const internship = (student.internships && student.internships[0]) || {};
    const evaluations = internship.evaluation || [];
    let entry = evaluations.find((e) => e && e.evaluation === evalName);
    if (!entry) {
      // fallback to positional: ISE -> 0, ESE -> 1
      entry = evalName === "ISE" ? evaluations[0] : evaluations[1] || evaluations[0];
    }
    if (!entry) return { marks: "", status: "Pending" };

    // Determine marks string
    let marks = "";
    if (entry.total_marks && typeof entry.total_marks === "object") {
      const scored = entry.total_marks.scored;
      const outOf = entry.total_marks.outOf || entry.total_marks.out_of || "";
      if (scored !== undefined && scored !== null) marks = `${scored}/${outOf}`;
    } else if (entry.marks !== undefined && entry.marks !== null) {
      marks = String(entry.marks);
    } else if (entry.total_marks_scored !== undefined) {
      marks = String(entry.total_marks_scored);
    }

    const hasAnyData = entry && Object.keys(entry).some((k) => {
      if (k === 'evaluation') return false;
      const v = entry[k];
      if (v === null || v === undefined || v === '') return false;
      if (Array.isArray(v) && v.length === 0) return false;
      if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) return false;
      return true;
    });
    const isDone = hasAnyData || entry.is_signed || entry.submitted || (marks && marks !== "");
    const status = isDone ? "Done" : "Pending";
    return { marks, status };
  } catch (e) {
    return { marks: "", status: "Pending" };
  }
};

// Student Search Modal Component //TESTING___________________________________________##########################_______________________________________###################_____________
const StudentSearchModal = ({ isOpen, onClose, colors, initialEmail = "" }) => {
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState(initialEmail);
  const [student, setStudent] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Auto-search when modal opens with initial email
  useEffect(() => {
    if (isOpen && initialEmail) {
      setSearchEmail(initialEmail);
      handleSearch(initialEmail);
    }
  }, [isOpen, initialEmail]); //will copy and paste the initially entered email into the search bar when the modal opens. pretty cool huh? :D

  const handleSearch = async (emailToSearch = searchEmail) => {
    //function that'll search for the student by email
    if (!emailToSearch.trim()) {
      setError("Please enter an email address"); //error for empty search bar
      return;
    }

    setIsSearching(true);
    setError("");
    setStudent(null);
    setIsEditing(false);

    try {
      const response = await axios.post(`${url}/student/find`, {
        email: emailToSearch,
      });

      if (response.data && response.data.email) {
        setStudent(response.data);
        // Initialize edit form with student data (NOT ALLOWED TO CHANGE THE email, isActive, isApproved, and department)
        setEditFormData({
          //will attributes with the data fetched from the serverrrrrrrr
          name: response.data.name || "",
          rollno: response.data.rollno || "",
          div: response.data.div || "",
          batch: response.data.batch || "",
          sem: response.data.sem || "",
          contact_no: response.data.contact_no || "",
          internships: response.data.internships || [],
        });
        
      } else {
        setError("Student not found");
      }
    } catch (err) {
      //fo handling errors
      if (err.response && err.response.status === 400) {
        setError("Student not found");
      } else {
        setError("Failed to search student. Please try again.");
      }
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEditToggle = () => {
    //function to enable editingggg
    setIsEditing(!isEditing);
    if (!isEditing && student) {
      // Reset form data when entering edit mode (excluding email, isActive, isApproved, and department)
      setEditFormData({
        name: student.name || "",
        rollno: student.rollno || "",
        div: student.div || "",
        batch: student.batch || "",
        sem: student.sem || "",
        contact_no: student.contact_no || "",
        internships: student.internships || [],
      });
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInternshipFieldChange = (index, field, value) => {
    setEditFormData((prev) => {
      const updatedInternships = [...prev.internships];
      updatedInternships[index] = {
        ...updatedInternships[index],
        [field]: value,
      };

      // If changing stipend_status from paid to unpaid, set stipend_amount to null
      if (field === "stipend_status" && value === "unpaid") {
        updatedInternships[index].stipend_amount = null;
      }

      return {
        ...prev,
        internships: updatedInternships,
      };
    });
  };

  const handleUpdateStudent = async () => {
    if (!student || !student._id) {
      setError("No student selected for update");
      return;
    }

    // Basic validation
    if (!editFormData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!editFormData.rollno.trim()) {
      setError("Roll number is required");
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      const response = await axios.put(
        `${url}/student/${student._id}`,
        editFormData
      );

      if (response.data.success) {
        // Update the student state with new data
        setStudent(response.data.data);
        setIsEditing(false);
        // Show success message (you can replace this with a toast notification)
        alert("Student updated successfully!");
        try {
          // Invalidate any mentor queries so assigned students lists update
          queryClient.invalidateQueries({
            predicate: (query) => {
              try {
                const k = query.queryKey && query.queryKey[0];
                return (
                  typeof k === "string" && k.startsWith("/mentors/all")
                );
              } catch (e) {
                return false;
              }
            },
          });
        } catch (e) {
          // ignore
        }
      } else {
        setError("Failed to update student");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update student. Please try again.");
      }
      console.error("Update error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setSearchEmail("");
    setStudent(null);
    setError("");
    setIsEditing(false);
    setEditFormData({});
    onClose();
  };

  const handleDownloadOfferLetter = async () => {
    try {
      const response = await fetch(
        `${url}/student/${student.sub_id}/offer-letter`
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
        `${student.name}_offer_letter.pdf` ||
        `${student.rollno}_offer_letter.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading offer letter:", error);
      alert("Failed to download offer letter");
    }
  };

  const handleViewOfferLetter = async () => {
    try {
      const response = await fetch(
        `${url}/student/${student.sub_id}/offer-letter`
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        style={{ backgroundColor: "white" }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.primary }}
        >
          <h2 className="text-2xl font-bold" style={{ color: colors.font }}>
            {isEditing
              ? "Edit Student Information"
              : "Search Student Information"}
          </h2>
          <button
            onClick={handleClose}
            className="transition-colors hover:opacity-70"
            style={{ color: colors.font }}
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Search Input - Hidden in edit mode */}
          {!isEditing && (
            <div className="mb-6">
              <InputGroup size="md">
                <InputLeftElement
                  pointerEvents="auto"
                  cursor="pointer"
                  onClick={() => handleSearch()}
                >
                  <SearchIcon color={colors.primary} />
                </InputLeftElement>
                <Input
                  placeholder="Enter student email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  style={{
                    backgroundColor: "white",
                    border: `1px solid ${colors.primary}`,
                    color: colors.font,
                    borderRadius: "6px",
                    fontSize: "16px",
                  }}
                  _placeholder={{ color: "black !important", opacity: 0.7 }}
                  _focus={{
                    borderColor: colors.primary,
                    boxShadow: `0 0 0 1px ${colors.primary}`,
                  }}
                />
              </InputGroup>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="mb-4 p-4 rounded-lg"
              style={{
                backgroundColor: colors.hover,
                border: `1px solid #ef4444`,
              }}
            >
              <p style={{ color: "#ef4444" }}>{error}</p>
            </div>
          )}

          {/* Loading State */}
          {(isSearching || isUpdating) && (
            <div className="text-center py-12">
              <div
                className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4"
                style={{ borderColor: colors.primary }}
              ></div>
              <p className="text-lg" style={{ color: colors.font }}>
                {isSearching
                  ? "Searching for student..."
                  : "Updating student..."}
              </p>
            </div>
          )}

          {/* Student Result */}
          {student && !isSearching && !isUpdating && (
            <div
              className="rounded-lg p-6"
              style={{ backgroundColor: colors.hover }}
            >
              {/* Student Header with Actions */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      student.profile_picture_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        student.name
                      )}&background=6366f1&color=fff&size=64`
                    }
                    alt={student.name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        student.name
                      )}&background=6366f1&color=fff&size=64`;
                    }}
                  />
                  <div>
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: colors.font }}
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="text-xl font-semibold bg-white border rounded px-2 py-1 w-full"
                          style={{
                            color: colors.font,
                            borderColor: colors.primary,
                          }}
                          placeholder="Enter full name"
                        />
                      ) : (
                        student.name
                      )}
                    </h3>
                    <p style={{ color: colors.font, opacity: 0.8 }}>
                      {student.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.isActive ? "Active" : "Inactive"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.isApproved
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {student.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={handleEditToggle}
                      className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 hover:opacity-90"
                      style={{ backgroundColor: "#3b82f6", color: "#fff" }}
                    >
                      <EditIcon className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleEditToggle}
                        className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 hover:opacity-90"
                        style={{ backgroundColor: "#6b7280", color: "#fff" }}
                      >
                        <CloseIcon className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleUpdateStudent}
                        className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 hover:opacity-90"
                        style={{ backgroundColor: "#10b981", color: "#fff" }}
                        disabled={isUpdating}
                      >
                        <CheckIcon className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Student Details Grid */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4"
                style={{ color: colors.font }}
              >
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <strong className="mb-1">Roll No:</strong>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.rollno}
                        onChange={(e) =>
                          handleInputChange("rollno", e.target.value)
                        }
                        className="bg-white border rounded px-2 py-1 text-sm"
                        style={{
                          borderColor: colors.primary,
                          color: colors.font,
                        }}
                        placeholder="Enter roll number"
                      />
                    ) : (
                      <span className="text-base">{student.rollno}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <strong className="mb-1">Department:</strong>
                    <span className="text-base">{student.department}</span>
                  </div>
                  <div className="flex flex-col">
                    <strong className="mb-1">Division:</strong>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.div}
                        onChange={(e) =>
                          handleInputChange("div", e.target.value)
                        }
                        className="bg-white border rounded px-2 py-1 text-sm"
                        style={{
                          borderColor: colors.primary,
                          color: colors.font,
                        }}
                        placeholder="Enter division"
                      />
                    ) : (
                      <span className="text-base">{student.div}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <strong className="mb-1">Batch:</strong>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.batch}
                        onChange={(e) =>
                          handleInputChange("batch", e.target.value)
                        }
                        className="bg-white border rounded px-2 py-1 text-sm"
                        style={{
                          borderColor: colors.primary,
                          color: colors.font,
                        }}
                        placeholder="Enter batch"
                      />
                    ) : (
                      <span className="text-base">{student.batch}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <strong className="mb-1">Semester:</strong>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.sem}
                        onChange={(e) =>
                          handleInputChange("sem", e.target.value)
                        }
                        className="bg-white border rounded px-2 py-1 text-sm"
                        style={{
                          borderColor: colors.primary,
                          color: colors.font,
                        }}
                        placeholder="Enter semester"
                      />
                    ) : (
                      <span className="text-base">{student.sem}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <strong className="mb-1">Contact:</strong>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.contact_no}
                        onChange={(e) =>
                          handleInputChange("contact_no", e.target.value)
                        }
                        className="bg-white border rounded px-2 py-1 text-sm"
                        style={{
                          borderColor: colors.primary,
                          color: colors.font,
                        }}
                        placeholder="Enter contact number"
                      />
                    ) : (
                      <span className="text-base">{student.contact_no}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <strong>Sub ID:</strong>{" "}
                    <span className="text-base">{student.sub_id}</span>
                  </div>
                  <div>
                    <strong>Has Mentor:</strong>{" "}
                    <span className="text-base">
                      {student.hasMentor ? "Yes" : "No"}
                    </span>
                  </div>
                  {student.hasMentor &&
                    student.mentor &&
                    student.mentor.name && (
                      <div>
                        <strong>Mentor:</strong>{" "}
                        <span className="text-base">{student.mentor.name}</span>
                      </div>
                    )}
                </div>
              </div>

              {/* Internships Section - Editable */}
              {student.internships && student.internships.length > 0 && (
                <div
                  className="pt-4"
                  style={{ borderTop: `1px solid ${colors.primary}` }}
                >
                  <h4
                    className="font-semibold mb-2"
                    style={{ color: colors.font }}
                  >
                    Internships
                  </h4>
                  <div className="space-y-2">
                    {student.internships.map((internship, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg"
                        style={{
                          backgroundColor: "white",
                          border: `1px solid ${colors.primary}`,
                        }}
                      >
                        <div
                          className="font-medium"
                          style={{ color: colors.font }}
                        >
                          {internship.company}
                        </div>
                        <div
                          className="text-sm"
                          style={{ color: colors.font, opacity: 0.8 }}
                        >
                          {internship.job_title} • {internship.duration_in_weeks} weeks
                        </div>
                        <div
                          className="text-sm mt-1"
                          style={{ color: colors.font, opacity: 0.7 }}
                        >
                          {new Date(internship.startDate).toLocaleDateString()} - {new Date(internship.endDate).toLocaleDateString()}
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center space-x-2 mt-2 mb-4 flex-wrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              internship.isCompleted
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {internship.isCompleted ? "Completed" : "In Progress"}
                          </span>
                        </div>

                        {/* Editable Fields */}
                        {isEditing && editFormData.internships && editFormData.internships[index] && (
                          <div className="space-y-4 mt-4 p-3 bg-gray-50 rounded">
                            {/* Internship Type - Radio Buttons */}
                            <div className="flex flex-col">
                              <strong className="mb-2" style={{ color: colors.font }}>
                                Internship Type:
                              </strong>
                              <div className="flex space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`internship_type_${index}`}
                                    value="case1"
                                    checked={editFormData.internships[index]?.internship_type === "case1"}
                                    onChange={(e) =>
                                      handleInternshipFieldChange(index, "internship_type", e.target.value)
                                    }
                                    style={{ accentColor: colors.primary }}
                                  />
                                  <span style={{ color: colors.font }}>Case 1</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`internship_type_${index}`}
                                    value="case2"
                                    checked={editFormData.internships[index]?.internship_type === "case2"}
                                    onChange={(e) =>
                                      handleInternshipFieldChange(index, "internship_type", e.target.value)
                                    }
                                    style={{ accentColor: colors.primary }}
                                  />
                                  <span style={{ color: colors.font }}>Case 2</span>
                                </label>
                              </div>
                            </div>

                            {/* Stipend Status - Radio Buttons */}
                            <div className="flex flex-col">
                              <strong className="mb-2" style={{ color: colors.font }}>
                                Stipend Status:
                              </strong>
                              <div className="flex space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`stipend_status_${index}`}
                                    value="paid"
                                    checked={editFormData.internships[index]?.stipend_status === "paid"}
                                    onChange={(e) =>
                                      handleInternshipFieldChange(index, "stipend_status", e.target.value)
                                    }
                                    style={{ accentColor: colors.primary }}
                                  />
                                  <span style={{ color: colors.font }}>Paid</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`stipend_status_${index}`}
                                    value="unpaid"
                                    checked={editFormData.internships[index]?.stipend_status === "unpaid"}
                                    onChange={(e) =>
                                      handleInternshipFieldChange(index, "stipend_status", e.target.value)
                                    }
                                    style={{ accentColor: colors.primary }}
                                  />
                                  <span style={{ color: colors.font }}>Unpaid</span>
                                </label>
                              </div>
                            </div>

                            {/* Stipend Amount - Conditional Field */}
                            {editFormData.internships[index]?.stipend_status === "paid" && (
                              <div className="flex flex-col">
                                <strong className="mb-2" style={{ color: colors.font }}>
                                  Stipend Amount (₹):
                                </strong>
                                <input
                                  type="number"
                                  value={editFormData.internships[index]?.stipend_amount || ""}
                                  onChange={(e) =>
                                    handleInternshipFieldChange(index, "stipend_amount", e.target.value)
                                  }
                                  className="bg-white border rounded px-3 py-2 text-sm"
                                  style={{
                                    borderColor: colors.primary,
                                    color: colors.font,
                                  }}
                                  placeholder="Enter stipend amount"
                                  min="0"
                                />
                                <p style={{ color: colors.font, opacity: 0.6, fontSize: "0.85rem", marginTop: "0.25rem" }}>
                                  Leave empty to set as unpaid
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Display Badges (Non-edit mode) */}
                        {!isEditing && (
                          <div className="flex items-center space-x-2 mt-2 flex-wrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                internship.internship_type === "case1"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-indigo-100 text-indigo-800"
                              }`}
                            >
                              {internship.internship_type === "case1" ? "Case 1" : "Case 2"}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                internship.stipend_status === "paid"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {internship.stipend_status === "paid"
                                ? `Paid${internship.stipend_amount ? ` (₹${internship.stipend_amount})` : ""}`
                                : "Unpaid"}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Offer Letter Section - Visible to Admin and Coordinator only */}
                  {student.internships && student.internships.length > 0 && student.internships[0].offer_letter && (
                    <div
                      className="mt-6 p-4 rounded-lg"
                      style={{
                        backgroundColor: colors.secondary,
                        borderLeft: `4px solid ${colors.primary}`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4
                            className="text-lg font-bold mb-2"
                            style={{ color: colors.font }}
                          >
                            Offer Letter
                          </h4>
                          <p style={{ color: colors.font, opacity: 0.8 }}>
                            <strong>File:</strong>{" "}
                            {student.internships[0].offer_letter.filename || "offer_letter.pdf"}
                          </p>
                          {student.internships[0].offer_letter.uploadDate && (
                            <p style={{ color: colors.font, opacity: 0.7, fontSize: "0.9rem" }}>
                              <strong>Uploaded:</strong>{" "}
                              {new Date(
                                student.internships[0].offer_letter.uploadDate
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Button
                            leftIcon={<SearchIcon />}
                            colorScheme="blue"
                            variant="outline"
                            onClick={handleViewOfferLetter}
                          >
                            View
                          </Button>
                          <Button
                            leftIcon={<DownloadIcon />}
                            colorScheme="blue"
                            variant="outline"
                            onClick={handleDownloadOfferLetter}
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* No Search Yet */}
          {!student && !error && !isSearching && !initialEmail && (
            <div className="text-center py-12">
              <SearchIcon
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: colors.primary, opacity: 0.5 }}
              />
              <p
                className="text-lg"
                style={{ color: colors.font, opacity: 0.7 }}
              >
                Enter student email to search...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { theme: colors } = useTheme();
    const { isOpen: isDownloadOpen, onOpen: onDownloadOpen, onClose: onDownloadClose } = useDisclosure();
  const [user, setUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isError, isLoading, data } = useQuery({
    queryKey: ["/mentors/all"],
    retryDelay: 5000,
    queryFn: async () => {
      if (!user) {
        var current_user = await getUserDetails();
        setUser(current_user);
      } else {
        var current_user = user;
      }
      console.log(current_user.department);
      const temp = await axios
        .get(
          url + `/mentors/all?department=${slugify(current_user.department)}`
        )
        .then((response) => response.data);
      console.log(temp);
      return temp;
    },
  });

  const navigateToStudentsList = (department) => {
    window.location.href = `/coordinator/${slugify(department)}/all-students`;
  };

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Handle Enter key press in search input - open modal with search term
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      setIsModalOpen(true);
    }
  };

  // Handle search icon click
  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      setIsModalOpen(true);
    }
  };

  // Handle modal close - clear the search term
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSearchTerm(""); // Clear the search term when modal closes
  };

  const MentorComponent = ({ name, profile_picture_url, sub_id, students }) => (
    <Link to={`/coordinator/mentor/${sub_id}/students`}>
      <div className={styles.mentorCard}>
        <span className={styles.profilePicContainer}>
          <img
            src={profile_picture_url}
            alt={`${name}'s photo`}
            className={styles.profilePic}
          />
        </span>
        <h1
          style={{
            color: colors.font,
            margin: "5px 8px",
            fontWeight: "bold",
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          {name}
        </h1>
        <h1
          style={{
            color: colors.primary,
            margin: "5px 8px",
            fontWeight: "bold",
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          {students.length > 0
            ? `Mentoring ${students.length} students`
            : "Faculty"}
        </h1>
      </div>
    </Link>
  );

  const MentorList = ({ mentors }) => {
    // Always show all mentors - no filtering based on search term
    const activeMentors = mentors.filter(
      (mentor) => mentor.students.length > 0
    );
    const faculties = mentors.filter((mentor) => mentor.students.length === 0);

    return (
      <>
        {activeMentors.length > 0 && (
          <div className={styles.mentorContainer}>
            {activeMentors.map((mentor) => (
              <MentorComponent key={mentor.sub_id} {...mentor} />
            ))}
          </div>
        )}

        {faculties.length > 0 && (
          <>
            <Box position="relative" padding="9">
              <Divider color={colors.heading1} />
              <AbsoluteCenter
                px="10"
                color={"#fff"}
                bg={colors.hover}
                py={"1"}
                style={{ borderRadius: "10px" }}
              >
                Faculties
              </AbsoluteCenter>
            </Box>
            <div className={styles.mentorContainer}>
              {faculties.map((mentor) => (
                <MentorComponent key={mentor.sub_id} {...mentor} />
              ))}
            </div>
          </>
        )}
      </>
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <h1 style={{ color: colors.font }}>Something Went Wrong</h1>;
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        minHeight: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
        overflowY: "hidden",
        padding: 10,
      }}
    >
      {/* Header with Search Bar in same line */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: 20,
          marginBottom: "15px",
          marginRight: 20,
        }}
      >
        <h1
          style={{
            color: colors.font,
            fontWeight: "bold",
            fontSize: 23,
            margin: 0,
          }}
        >
          <span
            onClick={() => navigateToStudentsList(user && user.department)}
            style={{ cursor: "pointer" }}
          >
            {user && user.department} <LinkIcon color={colors.primary} />
          </span>
        </h1>

        {/* Student search bar using email id */}
        <div style={{ width: "300px", marginLeft: "auto" }}>
          <InputGroup size="sm">
            <InputLeftElement
              pointerEvents="auto"
              cursor="pointer"
              onClick={handleSearchClick}
            >
              <SearchIcon color={colors.primary} />
            </InputLeftElement>
            <Input
              placeholder="Enter student email..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              style={{
                backgroundColor: "white",
                border: `1px solid ${colors.primary}`,
                color: colors.font,
                borderRadius: "6px",
                fontSize: "14px",
              }}
              _placeholder={{ color: "black !important", opacity: 0.7 }}
              _focus={{
                borderColor: colors.primary,
                boxShadow: `0 0 0 1px ${colors.primary}`,
              }}
              sx={{
                "&::placeholder": {
                  color: "black !important",
                  opacity: 0.7,
                },
              }}
            />
          </InputGroup>
        </div>
      </div>

      {/* Export buttons row (right under search) */}
      <div style={{ width: "100%", marginBottom: "8px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginRight: 20 }}>
          <Button leftIcon={<DownloadIcon />} colorScheme="red" variant="solid" size="sm" onClick={onDownloadOpen}>
            Downloadable Data
          </Button>
        </div>

        {/* Download Modal containing the four export buttons */}
        <Modal isOpen={isDownloadOpen} onClose={onDownloadClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Downloadable Data</ModalHeader>
            <ModalBody>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Button
                  leftIcon={<DownloadIcon />}
                  colorScheme="red"
                  variant="solid"
                  size="sm"
                  onClick={() => {
                    if (!data || !data.data) {
                      alert("No mentor data available to export");
                      return;
                    }
                    const temp = data.data.map((m) => ({
                      Name: m.name,
                      Email: m.email,
                      Contact: m.contact_no,
                      Department: m.department,
                      "Mentored Students": m.students ? m.students.length : 0,
                    }));
                    const { date, time } = getCurrentIndianDateTime();
                    exportToExcel(`Mentors-${time}-${date}.xlsx`, temp);
                    onDownloadClose();
                  }}
                >
                  Export Mentors (Excel)
                </Button>

                <Button
                  leftIcon={<DownloadIcon />}
                  colorScheme="red"
                  variant="solid"
                  size="sm"
                  onClick={() => {
                    if (!data || !data.data) {
                      alert("No mentor data available to export");
                      return;
                    }
                    const temp = data.data.map((m) => ({
                      Name: m.name,
                      Email: m.email,
                      Contact: m.contact_no,
                      Department: m.department,
                      "Mentored Students": m.students ? m.students.length : 0,
                    }));
                    const { date, time } = getCurrentIndianDateTime();
                    exportToPDF(`Mentors-${time}-${date}.pdf`, temp);
                    onDownloadClose();
                  }}
                >
                  Export Mentors (PDF)
                </Button>

                <Button
                  leftIcon={<DownloadIcon />}
                  colorScheme="red"
                  variant="solid"
                  size="sm"
                  onClick={async () => {
                    try {
                      const resp = await axios.get(
                        url + `/students/all?department=${slugify(user.department)}`
                      );
                      const students = resp.data.data || resp.data || [];
                      if (!students || students.length === 0) {
                        alert("No students found for export");
                        return;
                      }
                      const temp = students.map((student) => {
                        let c = 0;
                        try {
                          for (let i = 0; i < student.internships[0].progress.length; i++) {
                            if (student.internships[0].progress[i].submitted) c++;
                          }
                        } catch (e) {}
                        return {
                          Roll_no: student.rollno,
                          Department: student.department,
                          Name: student.name,
                          Batch: student.batch,
                          Email: student.email,
                          Internship_Type: student.internships?.[0]?.internship_type || student.internships?.[0]?.type || "",
                          Stipend_Status: student.internships?.[0]?.stipend_status || "",
                          Stipend_Amount: student.internships?.[0]?.stipend_amount || student.internships?.[0]?.stipend || "",
                          Contact_no: student.contact_no,
                          Mentor: student.hasMentor ? student.mentor.name : "-",
                          Company: student.internships?.[0]?.company || "",
                          Job_Description: student.internships?.[0]?.job_description || "",
                          Company_Mentor: student.internships?.[0]?.company_mentor || "",
                          Start_Date: student.internships?.[0]?.startDate || "",
                          End_Date: student.internships?.[0]?.endDate || "",
                          Total_Weeks: student.internships?.[0]?.duration_in_weeks?.toString() || "",
                          Submitted_Weeks:
                            c.toString() + "/" + (student.internships?.[0]?.duration_in_weeks?.toString() || "0"),
                          ISE_Marks: getEvaluation(student, "ISE").marks,
                          ISE_Status: getEvaluation(student, "ISE").status,
                          ESE_Marks: getEvaluation(student, "ESE").marks,
                          ESE_Status: getEvaluation(student, "ESE").status,
                        };
                      });
                      const { date, time } = getCurrentIndianDateTime();
                      exportToExcel(`Students-${time}-${date}.xlsx`, temp);
                      onDownloadClose();
                    } catch (err) {
                      console.error(err);
                      alert("Failed to fetch students for export");
                    }
                  }}
                >
                  Export Students (Excel)
                </Button>

                <Button
                  leftIcon={<DownloadIcon />}
                  colorScheme="red"
                  variant="solid"
                  size="sm"
                  onClick={async () => {
                    try {
                      const resp = await axios.get(
                        url + `/students/all?department=${slugify(user.department)}`
                      );
                      const students = resp.data.data || resp.data || [];
                      if (!students || students.length === 0) {
                        alert("No students found for export");
                        return;
                      }
                      const temp = students.map((student) => {
                        let c = 0;
                        try {
                          for (let i = 0; i < student.internships[0].progress.length; i++) {
                            if (student.internships[0].progress[i].submitted) c++;
                          }
                        } catch (e) {}
                        return {
                          Roll_no: student.rollno,
                          Department: student.department,
                          Name: student.name,
                          Batch: student.batch,
                          Email: student.email,
                          Contact_no: student.contact_no,
                          Mentor: student.hasMentor ? student.mentor.name : "-",
                          Internship_Type: student.internships?.[0]?.internship_type || student.internships?.[0]?.type || "",
                          Stipend_Status: student.internships?.[0]?.stipend_status || "",
                          Stipend_Amount: student.internships?.[0]?.stipend_amount || student.internships?.[0]?.stipend || "",
                          Company: student.internships?.[0]?.company || "",
                          Job_Description: student.internships?.[0]?.job_description || "",
                          Company_Mentor: student.internships?.[0]?.company_mentor || "",
                          Start_Date: student.internships?.[0]?.startDate || "",
                          End_Date: student.internships?.[0]?.endDate || "",
                          Total_Weeks: student.internships?.[0]?.duration_in_weeks?.toString() || "",
                          Submitted_Weeks:
                            c.toString() + "/" + (student.internships?.[0]?.duration_in_weeks?.toString() || "0"),
                          ISE_Marks: getEvaluation(student, "ISE").marks,
                          ISE_Status: getEvaluation(student, "ISE").status,
                          ESE_Marks: getEvaluation(student, "ESE").marks,
                          ESE_Status: getEvaluation(student, "ESE").status,
                        };
                      });
                      const { date, time } = getCurrentIndianDateTime();
                      exportToPDF(`Students-${time}-${date}.pdf`, temp);
                      onDownloadClose();
                    } catch (err) {
                      console.error(err);
                      alert("Failed to fetch students for export");
                    }
                  }}
                >
                  Export Students (PDF)
                </Button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onDownloadClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: 10, marginBottom: "20px" }}>
        <div style={{ color: colors.font }}>
          <RegisterMentor />
        </div>
        <div style={{ color: colors.font }}>
          <AddStudents />
        </div>
      </div>

      {data.data && (
        <MentorList
          mentors={data.data.filter((mentor) => mentor.sub_id !== "None")}
        />
      )}
      <div className={styles.mentorContainer}>
        {data.data.length <= 0 && (
          <div
            style={{
              backgroundColor: colors.hover,
              height: "150px",
              width: "95%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 15px",
            }}
          >
            <h1 style={{ color: colors.font, textAlign: "center" }}>
              No Mentors in your Department
            </h1>
          </div>
        )}
      </div>

      {/* Student Search Modal */}
      <StudentSearchModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        colors={colors}
        initialEmail={searchTerm}
      />
    </div>
  );
};

export default HomePage;
