const mongoose = require('mongoose');


function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@somaiya\.edu$/;
    return emailRegex.test(email);
}

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
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
    div: {
        type: String,
        required: false
    },
    department: {
        type: String,
        required: [true, "Department is Required"]
    },
    rollno: {
        type: String,
        required: [true, "Roll no is Mandatory"]
    },
    batch: {
        type: String,
        required: [true, "Batch is reqired"]     // Example: 2021, 2022
    },
    sem: {
        type: String,
        default: '8',
        required: false
    },
    mentor: {
        type: String,
        required: false
    },
    internships: [
        {
            company: {
                type: String,
                required: true
            },
            job_description: {
                type: String,
                required: true
            },
            startDate: {
                type: Date,
                required: [true, "Start Date is Required"]
            },
            endDate: {
                type: Date,
                required: [true, "End Date is Required"]
            },
            duration_in_weeks: {
                type: String,
                required: [true, "Duration in Weeks is Required"]
            },
            paid: {
                type: Boolean,
                default: false,
                required: false
            },
            stipend: {
                type: String,
                default: '0',
                required: false
            },
            completion: [
                {
                    document_type: {
                        type: String,
                        required: true
                    },
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            progress: [
                {
                    week: {
                        type: Number,
                        required: false
                    },
                    startDate: {
                        type: Date,
                        required: [false, "Start Date is Required"]
                    },
                    endDate: {
                        type: Date,
                        required: [false, "End Date is Required"]
                    },
                    description: {
                        type: String,
                        required: false
                    },
                    submitted: {
                        type: Boolean,
                        default: false
                    },
                    edited: {
                        type: Boolean,
                        default: false
                    },
                    mentor_comment: {
                        type: String,
                        default: "No Comments Yet"
                    },
                    grade: {
                        type: Number,
                        required: false
                    }
                }
            ]
        }
    ],

    isActive: {
        type: Boolean,
        required: false,
        default: false
    }


});


const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
