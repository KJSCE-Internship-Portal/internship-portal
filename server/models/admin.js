const mongoose = require('mongoose');

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@somaiya\.edu$/;
    return emailRegex.test(email);
}

const adminSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Mentor Name is required"]
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
        default: "ADMIN"
    },
    sub_id: {
        type: String,
        required: true
    },
    profile_picture_url: {
        type: String,
        required: false
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
    }

});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
