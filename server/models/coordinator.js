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
    contact_no: {
        type: String,
        required: [true, "Contact no is required"],
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
    role: {
        type: String,
        required: false
    },
    sub_id: {
        type: String,
        required: false,
        default: "None"
    },
    department: {
        type: String,
        required: [true, "Department is Required"]
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },
    isApproved: {
        type: Boolean,
        required: false,
        default: true
    },
    createdAt: {
        type: Date,
        required: true
    }

});

const Coordinator = mongoose.model('Coordinator', coordinatorSchema);

module.exports = Coordinator;
