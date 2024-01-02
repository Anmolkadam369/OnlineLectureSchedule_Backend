const express = require('express');
const router = express.Router();
const adminController = require("../controller/controller");
const auth = require("../middlewares/auth")
const aws = require('../middlewares/awsLink')


router.post("/signup", adminController.signup);
router.post('/signIn', adminController.signIn);

router.post('/signupInstructor/:userId',auth.authentication,auth.authorization, adminController.signupInstructor);

router.post('/course/:userId',auth.authentication,auth.authorization,aws.imageUpload, adminController.addCourse);
router.get('/course/:userId',auth.authentication,auth.authorization, adminController.getCourses);
router.get('/lectures/:userId',auth.authentication,auth.authorization, adminController.getAssignedLectures);


router.get('/instructors/:userId',auth.authentication,auth.authorization, adminController.getInstructors);
router.put('/assignLecture/:userId/:lecturerId',auth.authentication,auth.authorization, adminController.assignLectures);

router.all("/*", function(req,res){
    res.status(400).send({status:false, message:"invalid http request"});
})

module.exports = router; 