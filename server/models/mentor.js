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
    email: {
        type: String,
        required: [true, "E-mail is mandatory"],
        validate: {
            validator: validateEmail,
            message: "Email must be from @somaiya.edu domain"
        }
    },
    sub_id: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: [true, "Department is Required"]
    },
    students: [
        {
            id: {
                type: String,
                required: [true, "Student ID is required"]
            },
        }
    ]

});

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;
