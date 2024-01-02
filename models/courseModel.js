const mongoose = require('mongoose');

const course = new mongoose.Schema({
    name:{
        type:String,
        required:true
      },
      level:{
        type:String,
        required:true
      },
      description:{
        type:String,
        required:true
      },
      image:{
        type:String,
        // required:true
      },
      isDeleted:{
        type:Boolean,
        default:false
      },
    },{timestamps:true});

module.exports  = mongoose.model('course', course);