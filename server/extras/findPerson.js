const Student = require('../models/student');
const Mentor = require('../models/mentor');
const Coordinator = require('../models/coordinator');
const Admin = require('../models/admin');

async function findPersonBySubId(email) {
  let person = await Student.findOne({ email }).exec();

  if (person){
    person.role = "STUDENT"
    return {...person, role: 'STUDENT'};
  }

  if (!person) {
    person = await Mentor.findOne({ email }).exec();
  }

  if (person){
    person.role = "MENTOR"
    return {...person, role: 'MENTOR'};
  }

  if (!person) {
    person = await Coordinator.findOne({ email }).exec();
  }

  if (person){
    person.role = "COORDINATOR"
    return {...person, role: 'COORDINATOR'};
  }

  if (!person) {
    person = await Admin.findOne({ email }).exec();
  }

  if (person){
    person.role = "ADMIN";
    return {...person, role: 'ADMIN'};
  }
  return person;
}

module.exports = findPersonBySubId;
