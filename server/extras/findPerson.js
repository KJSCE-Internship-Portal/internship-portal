const Student = require('../models/student');
const Mentor = require('../models/mentor');
const Coordinator = require('../models/coordinator');
const Admin = require('../models/admin');

async function findPersonBySubId(sub_id) {
  let person = await Student.findOne({ sub_id }).exec();

  if (!person) {
    person = await Mentor.findOne({ sub_id }).exec();
  }

  if (!person) {
    person = await Coordinator.findOne({ sub_id }).exec();
  }

  if (!person) {
    person = await Admin.findOne({ sub_id }).exec();
  }

  return person;
}

module.exports = findPersonBySubId;
