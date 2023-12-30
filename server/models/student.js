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
    contact_no: {
        type: String,
        required: [true, "Contact No is required"]
    },
    hasMentor: {
        type: Boolean,
        default: false
    },
    mentor: {
        email: {
            type: String,
            required: false,
            default: ''
        },
        contact_no: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: false,
            default: ''
        }
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
            company_mentor: {
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
            isCompleted: {
                type: Boolean,
                required: false,
                default: false
            },
            evaluation: [    // 0th index for ISE and 1st Index for ESE
                {
                    mentor_name: {
                        type: String,
                        required: [true, "Mentor Name is required"]
                    },
                    exam_date: {
                        type: Date,
                        required: [true, "date is required"]
                    },
                    exam_time: {
                        type: String,
                        required: [true, 'Time is required']
                    },
                    exam_venue: {
                        type: String,
                        required: false
                    },
                    project_title: {
                        type: String,
                        required: [true, 'Job title is required']
                    },
                   work_done: {
                        type: String,
                        required: [true, 'Work Done is required']
                    },
                    report_quality_marks: {
                        outOf: {
                            type: Number,
                            default: 20
                        },
                        scored: {
                            type: Number,
                            required: true,
                            default: 0
                        }
                    },
                    oral_presentation_marks: {
                        outOf: {
                            type: Number,
                            default: 20
                        },
                        scored: {
                            type: Number,
                            required: true,
                            default: 0
                        }
                    },
                    work_quality_marks: {
                        outOf: {
                            type: Number,
                            default: 15,
                        },
                        scored: {
                            type: Number,
                            required: true,
                            default: 0
                        }
                    },
                    work_understanding_marks: {
                        outOf: {
                            type: Number,
                            default: 15
                        },
                        scored: {
                            type: Number,
                            required: true,
                            default: 0
                        }
                    },
                    periodic_interaction_marks: {
                        outOf: {
                            type: Number,
                            default: 5
                        },
                        scored: {
                            type: Number,
                            required: true,
                            default: 0
                        }
                    },
                    total_marks: {
                        outOf: {
                            type: Number,
                            default: 75
                        },
                        scored: {
                            type: Number,
                            required: true,
                            default: 0
                        }
                    },
                    examiner_specific_remarks: {
                        type: String,
                        required: false
                    },
                    pdf_buffer: {
                        type: Buffer,
                        required: true
                    },
                    is_signed: {
                        type: Boolean,
                        required: false,
                        default: false
                    }
                }
            ],
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
                        required: false,
                        default: '',
                    },
                    submitted: {
                        type: Boolean,
                        default: false
                    },
                    isLateSubmission: {
                        type: Boolean,
                        default: true
                    },
                    edited: {
                        type: Boolean,
                        default: false
                    },
                    mentor_comment: {
                        type: String,
                        default: "No Comments Yet"
                    },
                    hasMentorCommented: {
                        type: Boolean,
                        default: false,
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
        default: true
    },

    isApproved: {
        type: Boolean,
        required: false,
        default: false
    }

});


const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
