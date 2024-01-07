const express = require("express");
const { readFile, writeFile } = require('fs/promises');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const Mentor = require('../models/mentor')
const Student = require('../models/student');

const loginMentor = async (req, res) => {

    try {
        res.status(200).json({ success: true, msg: "Mentor Login Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }

};

const viewAssignedStudents = async (req, res) => {

    try {
        res.status(200).json({ success: true, msg: "View Assigned Students Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }

};

const addPrivateComments = async (req, res) => {

    try {
        var taskUpdate = req.body;
        const { sub_id, week, mentor_comment } = taskUpdate;
        try{
            const updatedStudent = await Student.findOneAndUpdate(
                {
                  sub_id,
                  'internships.0.progress.week': week,
                },
                {
                  $set: {
                    'internships.0.progress.$.mentor_comment': mentor_comment.trim(),
                    'internships.0.progress.$.hasMentorCommented': true,
                  },
                },
                {
                  new: true,
                }
            );
            if(updatedStudent){
                return res.status(200).json({ success: true, msg: "Add Progress Route" });
            } else{
                return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
            }
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }

};

const editPrivateComments = async (req, res) => {
    try {
        res.status(200).json({ success: true, msg: "Edit Private Comments Route" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};

const studentEvaluation = async (req, res) => {
    try {
        const evaluateDetails = req.body;
        console.log(evaluateDetails);
        inputFilePath='./assets/SVU Sem Long Evaluation Scheme.pdf';
        // if(evaluateDetails.evaluation == 'ISE') {
        //     inputFilePath = './assets/ISE-Editable-Template.pdf';
        // }
        // else if(evaluateDetails.evaluation == 'ESE') {
        //     inputFilePath = './assets/ESE-Editable-Template.pdf';
        // }
        
        const pdfBytes = await readFile(inputFilePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        // const calibri = await pdfDoc.embedFont(StandardFonts.Calibri);
        const form = pdfDoc.getForm();

        form.getTextField('department_name').setText(evaluateDetails.department_name);
        form.getTextField('evaluation_name').setText(evaluateDetails.evaluation_name);
        form.getTextField('student_rollno').setText(evaluateDetails.student_rollno);
        form.getTextField('student_name').setText(evaluateDetails.student_name);
        form.getTextField('exam_date').setText(evaluateDetails.exam_date);
        form.getTextField('exam_time').setText(evaluateDetails.exam_time);
        form.getTextField('exam_venue').setText(evaluateDetails.exam_venue);
        form.getTextField('internship_title').setText(evaluateDetails.project_title);
        form.getTextField('work_done').setText(evaluateDetails.work_done);
        form.getTextField('report_quality_marks').setText(evaluateDetails.report_quality_marks.scored);
        form.getTextField('oral_presentation_marks').setText(evaluateDetails.oral_presentation_marks.scored);
        form.getTextField('work_quality_marks').setText(evaluateDetails.work_quality_marks.scored);
        form.getTextField('work_understanding_marks').setText(evaluateDetails.work_understanding_marks.scored);
        form.getTextField('periodic_interaction_marks').setText(evaluateDetails.periodic_interaction_marks.scored);

        const reportQualityMarks = parseInt(evaluateDetails.report_quality_marks.scored);
        const oralPresentationMarks = parseInt(evaluateDetails.oral_presentation_marks.scored);
        const workQualityMarks = parseInt(evaluateDetails.work_quality_marks.scored);
        const workUnderstandingMarks = parseInt(evaluateDetails.work_understanding_marks.scored);
        const periodicInteractionMarks = parseInt(evaluateDetails.periodic_interaction_marks.scored);

        const sumOfMarks = reportQualityMarks + oralPresentationMarks + workQualityMarks + workUnderstandingMarks + periodicInteractionMarks;
        form.getTextField('total_marks').setText(sumOfMarks.toString());
        const options = form.getRadioGroup('report_quality_radio').getOptions();

        function setRadioSelection(mark, maxValue, radioGroupName) {
            const percentage = (mark / maxValue) * 100;
            const radioGroup = form.getRadioGroup(radioGroupName);
          
            if (percentage >= 90) {
              radioGroup.select(options[0]); // >= 90%
            } else if (percentage >= 70 && percentage <= 89) {
              radioGroup.select(options[1]); // 70-89%
            } else if (percentage >= 50 && percentage <= 69) {
              radioGroup.select(options[2]); // 50-69%
            } else {
              radioGroup.select(options[3]); // <= 49%
            }
        }
        
        setRadioSelection(reportQualityMarks, 20, 'report_quality_radio');
        setRadioSelection(oralPresentationMarks, 20, 'oral_presentation_radio');
        setRadioSelection(workQualityMarks, 15, 'work_quality_radio');
        setRadioSelection(workUnderstandingMarks, 10, 'work_understanding_radio');
        setRadioSelection(periodicInteractionMarks, 10, 'periodic_interaction_radio');

        form.getTextField('examiner_specific_remarks').setText(evaluateDetails.examiner_specific_remarks);

        for (const field of form.getFields()) {
            field.enableReadOnly();
        }

        delete evaluateDetails.evaluation_name;
        delete evaluateDetails.department_name;
        const rollno = evaluateDetails.student_rollno;
        delete evaluateDetails.student_rollno;
        delete evaluateDetails.student_name;

        evaluateDetails.total_marks = sumOfMarks;

        // form.updateFieldAppearances(calibri);
        const modifiedPdfBytes = await pdfDoc.save();
        const finalPdfBuffer = Buffer.from(modifiedPdfBytes);
        evaluateDetails.pdf_buffer = finalPdfBuffer;

        // try {
        //     const updatedStudent = await Student.findOneAndUpdate(
        //         {
        //           rollno
        //         },
        //         {
        //           $push: {
        //             'internships.0.evaluation': evaluateDetails,
        //           },
        //         },
        //         {
        //           new: true,
        //         }
        //     );
        //     if (updatedStudent) {
                res.setHeader('Content-Type', 'application/pdf');
                const filename = `${evaluateDetails.student_rollno}_${evaluateDetails.evaluation}_Evaluation.pdf`;
                res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
                res.send(finalPdfBuffer);
        //     } else{
        //         return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
        //     }
        // } catch (error) {
        //     console.error(`Error: ${error.message}`);
        //     return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
        // }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
}

const uploadSignedDocument = async (req, res) => {

    try {
        if(!req.file) {
            return res.status(400).json({ success: false, msg: 'No file uploaded' });
        }
        const { rollno, evaluation } = req.body;
        const finalPdfBuffer = req.file.buffer;
        if(evaluation == 'ISE'){
            const updatedStudent = await Student.findOneAndUpdate(
                {
                rollno
                },
                {
                $set: {
                    'internships.0.evaluation.0.pdf_buffer': finalPdfBuffer,
                    'internships.0.evaluation.0.is_signed': true,
                },
                },
                {
                new: true,
                }
            );
            if (updatedStudent) {
                return res.status(200).json({ success: true, msg: "Uploaded Student Evaluation" });
            } else{
                return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
            }
        } else if(evaluation == 'ESE') {
            const updatedStudent = await Student.findOneAndUpdate(
                {
                rollno
                },
                {
                $set: {
                    'internships.0.evaluation.1.pdf_buffer': finalPdfBuffer,
                    'internships.0.evaluation.1.is_signed': true,
                },
                },
                {
                new: true,
                }
            );
            if (updatedStudent) {
                return res.status(200).json({ success: true, msg: "Uploaded Student Evaluation" });
            } else{
                return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
            }
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(400).json({ success: false, msg: `Something Went Wrong ${error.message}` });
    }
};

const deslugify = (slug) => {
    return slug
        .replace(/-/g, ' ') 
        .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};

const getAllMentors = async (req, res) => {

    try {

        const reqQuery = { ...req.query };
        if (reqQuery.department){
            reqQuery.department = deslugify(reqQuery.department);
        }
        const removeFields = ['select', 'sort', 'limit', 'page'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        query = Mentor.find(JSON.parse(queryStr));

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }
    
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 100;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Mentor.countDocuments(query);

        query = query.skip(startIndex).limit(limit);
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        const mentor = await query;
        if (!mentor) {
            return res.status(401).json({ success: false, msg: "There are no Students" });
        }
        return res.status(200).json({ success: true, count: total, pagination, data: mentor });

    } catch (error) {
        console.log(`${error.message} (error)`.red);
        return res.status(400).json({ success: false, msg: error.message });
    }

};

module.exports = {
    loginMentor,
    viewAssignedStudents,
    addPrivateComments,
    editPrivateComments,
    studentEvaluation,
    uploadSignedDocument,
    getAllMentors
};
