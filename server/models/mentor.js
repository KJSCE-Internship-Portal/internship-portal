const mongoose = require('mongoose');

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@somaiya\.edu$/;
    return emailRegex.test(email);
}

const mentorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Mentor Name is required"]
    },
    profile_picture_url: {
        type: String,
        required: false
    },
    contact_no: {
        type: String,
        required: [true, "Contact No is required"]
    },
    email: {
        type: String,
        unique: [true, "E-mail should be Unique"],
        required: [true, "E-mail is mandatory"],
        validate: {
            validator: validateEmail,
            message: "Email must be from @somaiya.edu domain"
        }
    },
    sub_id: {
        type: String,
        required: [true, "sub_id is Required"],
        default: "None"
    },
    department: {
        type: String,
        required: [true, "Department is Required"]
    },
    students: [
        {
            sub_id: {
                type: String,
                required: [true, "Student ID is required"]
            },
            rollno: {
                type: String,
                required: [true, "Roll no. is required"]
            },
            email: {
                type: String,
                required: [true, "Student Email is required"]
            }
        }
    ],
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },
    isApproved: {
        type: Boolean,
        required: false,
        default: true
    }

});

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;
