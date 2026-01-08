const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  department: {
    type: String,
    required: [true, "Department is Required"],
  },

  sender: {
    type: String,
    required: [true, "Sender's name is required"],
  },

  received_by: {
    department: {
      type: String,
      required: true,
    },
    only_for_faculties: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  recipientType: {
    type: String,
    enum: ["all_users", "all_coordinators", "all_mentors", "all_students"],
    required: false,
    default: "all_users",
  },
  content: {
    type: String,
    required: [true, "Announcement should not be Empty"],
  },
  postedAt: {
    type: Date,
    required: [true, "Date is required"],
  },
});

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
