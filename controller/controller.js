let mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const adminModel = require("../models/adminModel");
const courseModel = require("../models/courseModel");
const instructorModel = require("../models/instructorModel");
const scheduledModel = require("../models/scheduledModel");

const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};
const validatePassword = (password) => {
  return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}/.test(password);
};
const validateName = (name) => {
  return /^[A-Za-z\s]+$/.test(name);
};


function convertMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMins = mins < 10 ? `0${mins}` : mins;
  return `${formattedHours}:${formattedMins}`;
}


const signup = async function (req, res) {
  try {
    console.log("some", req.body);
    let data = req.body;
    let { name, email, password } = data;

    name = data.name = name.trim();
    if (name === '') return res.status(400).send({ status: false, message: `empty name not possible` });
    if (!validateName(name)) {
      return res.status(400).send({ status: false, message: `invalid name format` });
    }
    email = data.email = email.trim().toLowerCase()
    if (email === "") return res.status(400).send({ status: false, message: `empty email not possible` });
    if (!validateEmail(email)) {
      return res.status(400).send({ status: false, message: `invalid email format` });
    }

    password = data.password = password.trim()
    if (password === "") return res.status(400).send({ status: false, message: `empty password not possible` });
    if (!validatePassword(password)) {
      return res.status(400).send({ status: false, message: `invalid password format` });
    }

    const foundEmail = await adminModel.findOne({ email: email });
    if (foundEmail) return res.status(400).send({ status: false, message: `email already in use` });

    let hashing = bcrypt.hashSync(password, 10);
    data.password = hashing;

    let createdData = await adminModel.create(data);
    return res.status(201).send({ status: true, data: createdData });
  } catch (error) {
    return res.status(500).send({ status: false, message: `error ${error.message}` })
  }
}

const signIn = async function (req, res) {

  try {
    console.log("some", req.body);
    let data = req.body;
    let { email, password } = data;

    email = data.email = email.trim().toLowerCase()
    if (email === "") return res.status(400).send({ status: false, message: `empty email not possible buddy` });
    if (!validateEmail(email)) {
      return res.status(400).send({ status: false, message: `invalid email format` });
    }
    password = data.password = password.trim()
    if (password === "") return res.status(400).send({ status: false, message: `empty password not possible buddy` });
    if (!validatePassword(password)) {
      return res.status(400).send({ status: false, message: `invalid password format` });
    }
    let foundUserName = await adminModel.findOne({ email: email });
    if (!foundUserName) return res.status(400).send({ status: false, message: `${email} isn't available !!!` });
    console.log(foundUserName, password)

    let passwordCompare = await bcrypt.compare(password, foundUserName.password);
    if (!passwordCompare) return res.status(400).send({ status: false, message: "Please enter valid password" })

    let token = jwt.sign(
      { userId: foundUserName._id, exp: Math.floor(Date.now() / 1000) + 86400 },
      "project"
    );

    let tokenInfo = { userId: foundUserName._id, token: token };

    res.setHeader('x-api-key', token)
    return res.status(200).send({ status: true, data: foundUserName, tokenData: tokenInfo });
  } catch (error) {
    return res.status(500).send({ status: false, message: `error ${error.message}` })
  }
}

const signupInstructor = async function (req, res) {
    try {
      console.log("some", req.body);
      let data = req.body;
      let { name, email, password } = data;
  
      name = data.name = name.trim();
      if (name === '') return res.status(400).send({ status: false, message: `empty name not possible` });
      if (!validateName(name)) {
        return res.status(400).send({ status: false, message: `invalid name format` });
      }
      email = data.email = email.trim().toLowerCase()
      if (email === "") return res.status(400).send({ status: false, message: `empty email not possible` });
      if (!validateEmail(email)) {
        return res.status(400).send({ status: false, message: `invalid email format` });
      }
  
      password = data.password = password.trim()
      if (password === "") return res.status(400).send({ status: false, message: `empty password not possible` });
      if (!validatePassword(password)) {
        return res.status(400).send({ status: false, message: `invalid password format` });
      }
  
      const foundEmail = await instructorModel.findOne({ email: email });
      if (foundEmail) return res.status(400).send({ status: false, message: `email already in use` });
  
      let hashing = bcrypt.hashSync(password, 10);
      data.password = hashing;
  
      let createdData = await instructorModel.create(data);
      return res.status(201).send({ status: true, data: createdData });
    } catch (error) {
      return res.status(500).send({ status: false, message: `error ${error.message}` })
    }
  }

const addCourse = async function (req,res){
    try {
        let data= req.body;
        console.log("data", data)
        let {name, level, description,image} = data;
        image= data.image = req.image;
        
        if (!name) return res.status(400).send({ status: false, message: `please send name` });
        if (!level) return res.status(400).send({ status: false, message: `please send level` });
        if (!description) return res.status(400).send({ status: false, message: `please send description` });
        let createCourse = await courseModel.create(data);
        return res.status(200).send({ status: true, data: createCourse });

    } catch (error) {
      return res.status(500).send({ status: false, message: `error ${error.message}` })
    } 
}
 
const getCourses = async function (req,res){
try {
    let data = await courseModel.find({ isDeleted: false });
    if (data.length == 0) return res.status(404).send({ status: false, message: "No Data found" });
    return res.status(200).send({ status: true, data: data });

  } catch (error) {
    return res.status(500).send({ status: false, message: `error ${error.message}` })
  }
}

const getInstructors = async function (req,res){
    try {
        let data = await instructorModel.find({ isDeleted: false });
        if (data.length == 0) return res.status(404).send({ status: false, message: "No Data found" });
        console.log(data)
        return res.status(200).send({ status: true, data: data });
    
      } catch (error) {
        return res.status(500).send({ status: false, message: `error ${error.message}` })
      }
    }


    const getAssignedLectures = async function (req,res){
      try {
          let data = await scheduledModel.find({ isDeleted: false });
          if (data.length == 0) return res.status(404).send({ status: false, message: "No Data found" });
          console.log(data)
          let newData=[];
          
          for (let i = 0; i < data.length; i++) {
            let newObj = {
              _id: `${data[i]._id}`,
              name: `${data[i].name}`,
              email: `${data[i].email}`,
              
            };
      
            if (data[i].date) {
              newObj.topic= `${data[i].topic}`,
              newObj.date = new Date(data[i].date).toLocaleDateString();
            }
      
            if (data[i].time) {
              newObj.time = convertMinutesToTime(data[i].time);
            }
      
            newData.push(newObj);
          }
          
      
          return res.status(200).send({ status: true, data: newData });
      
        } catch (error) {
          return res.status(500).send({ status: false, message: `error ${error.message}` })
        }
      }

const assignLectures = async function (req,res){
    try {
        let data = req.body;
       
        let lecturerId = req.params.lecturerId;
        console.log(lecturerId)
        let {name, email, password, time, date, topic} = data;
        let lecturerData = await instructorModel.findById(lecturerId);
        if(!lecturerData) return res.status(400).send({ status: false, message: `No data found of lecturer` });

        const [hours, minutes] = data.time.split(':').map(Number);

        const timeInMinutes = hours * 60 + minutes;
        const dateInMilliseconds = new Date(data.date).getTime();
        time = data.time = timeInMinutes;
        date = data.date = dateInMilliseconds;
        console.log(time, date, lecturerId)
        let overlappingDate = await scheduledModel.find({lecturerId:lecturerId, date:date});
        console.log("overlapping",overlappingDate)
        if(overlappingDate != 0 ) return res.status(400).send({ status: false, message: `this instructor is alredy assignd lecture on that date` });

        let updateData = await scheduledModel.create({lecturerId: lecturerId,name:lecturerData.name, email:lecturerData.email, time:time, date:date, topic:topic} );
        console.log("update", updateData);
        const formattedDate = new Date(updateData.date).toLocaleDateString();
      const formattedTime = convertMinutesToTime(updateData.time);
    
      console.log(formattedDate, formattedTime)
      const updatedDate = formattedDate;
      const updatedStartTime = formattedTime;

      console.log(updatedDate,updatedStartTime)

      const newObj = {
        _id:  `${updateData._id}`,
        name: `${updateData.name}`,
        email:`${updateData.email}`,
        topic:`${updateData.topic}`,
        time: updatedStartTime,
        date: updatedDate
      }
    console.log("newObj", newObj)


        return res.status(200).send({ status: true, data: newObj });


    } catch (error) {
        return res.status(500).send({ status: false, message: `error ${error.message}` }) 
    }
}
    
module.exports = {signup, signIn, signupInstructor, addCourse, getCourses, getInstructors,getAssignedLectures, assignLectures};