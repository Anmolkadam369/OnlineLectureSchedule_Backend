const mongoose = require('mongoose');

const scheduled = new mongoose.Schema({
    name:{
        type:String,
        required:true
      },
      email:{
        type:String,
        required:true
      },
      time:{
        type:Number,
      },
      lecturerId:{
        type:String,
      },
      date:{
        type:Number,
    
      },
      topic:{
        type:String,
      },
      isDeleted:{
        type:Boolean,
        default:false
      },
    },{timestamps:true});

module.exports  = mongoose.model('scheduled', scheduled);