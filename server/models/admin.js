const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Mentor Name is required"]
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
    profile_picture_url: {
        type: String,
        required: false
    }

});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
