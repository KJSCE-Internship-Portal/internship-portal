const Student = require('../models/student');
const Mentor = require('../models/mentor');
const Coordinator = require('../models/coordinator');
const Admin = require('../models/admin');

async function findPersonBySubId(email) {
  var person = await Student.findOne({ email }).exec();

  if (person){
    try{
      person._doc.role = "STUDENT";
    } catch (error) {
    }
    person = {...person, role: 'STUDENT'};
    return person
  }

  if (!person) {
    person = await Mentor.findOne({ email }).exec();
  }

  if (person){
    try{
      person._doc.role = "MENTOR";
    } catch (error) {
    }
    person.role = "MENTOR"
    return {...person, role: 'MENTOR'};
  }

  if (!person) {
    person = await Coordinator.findOne({ email }).exec();
  }

  if (person){
    try{
      person._doc.role = "COORDINATOR";
    } catch (error) {
    }
    person.role = "COORDINATOR"
    return {...person, role: 'COORDINATOR'};
  }

  if (!person) {
    person = await Admin.findOne({ email }).exec();
  }

  if (person){
    try{
      person._doc.role = "ADMIN";
    } catch (error) {
    }
    person.role = "ADMIN";
    return {...person, role: 'ADMIN'};
  }
  return person;
}

module.exports = findPersonBySubId;
