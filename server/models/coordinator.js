const mongoose = require('mongoose');

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@somaiya\.edu$/;
    return emailRegex.test(email);
}

const coordinatorSchema = new mongoose.Schema({
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
    role: {
        type: String,
        required: false
    },
    sub_id: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: [true, "Department is Required"]
    }

});

const Coordinator = mongoose.model('Coordinator', coordinatorSchema);

module.exports = Coordinator;
