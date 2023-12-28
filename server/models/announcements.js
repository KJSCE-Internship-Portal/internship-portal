const mongoose = require('mongoose');


const announcementSchema = new mongoose.Schema({

    department: {
        type: String,
        required: [true, "Department is Required"]
    },

    sender: {
        type: String,
        required: [true, "Sender's name is required"]
    },

    receieved_by: 
        {
            department: {
                type: String,
                required: true
            },
            only_for_faculties: {
                type: Boolean,
                required: false,
                default: false
            }
        }
    ,

    content: {
        type: String,
        required: [true, "Announcement should not be Empty"]
    }

});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
