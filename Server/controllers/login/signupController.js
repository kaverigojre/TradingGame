const userModelCtrl = require("../../models/userModel");
const organiserModelCtrl = require("../../models/organiserModel");
const bcrypt = require("bcrypt");
const cors= require("cors");
const crypto=require("crypto");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'saivishesh73@gmail.com',
    pass: 'fptizbzavlhzyysx',
  },
  tls:{
    rejectUnauthorized: false
  }
});
const signup=async(req,res)=>{
  
    const user=new userModelCtrl.userModel({
        name:req.body.name,
        password:req.body.password,
        email:req.body.email,
        wallet:0,
        contest:[],
        emailToken:crypto.randomBytes(64).toString('hex')
    });
  
      const foundUsers = await userModelCtrl.userModel.find({
        email: req.body.email,
      });
      if (foundUsers.length !== 0) {
        res.status(404).send("User already exists");
        return;
      }
      bcrypt.hash(user.password, 10, async function (err, hash) {
        // Store hash in your password DB.
        if (err) {
          res.status(404).send("Could not register user");
          return;
        }
        user.password = hash;
        const error = await user.save();
        // sending email verification  mail to user
        var mailOptions={
          from:`"Verify your mail" <saivishesh73@gmail.com>`,
          to :req.body.email,
          subject:`verify your mail `,
          html: `<h2> ${req.body.name} ! Thanks for Registering on our site </h2>
           <h4> Please verify your mail to continue.. </h4>
            <a href="http://${req.headers.host}/register/verify-email?token=${user.emailToken}"> Verify Your Email</a>`
        }
       
        transporter.sendMail(mailOptions,function(err,info){
           if(err)
           {
             console.log(error)
           }
           else
           {
             console.log("verfication mail is sent to your gmail account");
           }
        })
        res.status(201).send(user);
      });
  
}
const signupOrganiser=async(req,res)=>{
    const organiser=new organiserModelCtrl.organiserModel({
        name:req.body.name,
        password:req.body.password,
        email:req.body.email,
        wallet:0,
        contest:[]
    });
    const foundOrganiser = await organiserModelCtrl.organiserModel.find({
        email: req.body.email,
      });
      if (foundOrganiser.length !== 0) {
        res.status(404).send("Organiser already exists");
        return;
      }
      bcrypt.hash(organiser.password, 10, async function (err, hash) {
        // Store hash in your password DB.
        if (err) {
          res.status(404).send("Could not register organiser");
          return;
        }
        organiser.password = hash;
        const error = await organiser.save();
        res.status(201).send(organiser);
      });

}
const verify=async(req,res)=>{
  
   const token=req.query.token;
   const user=await  userModelCtrl.userModel.findOne({emailToken:token});
    if(user)
    {
       user.emailToken=null
       user.confirmed=true
       await user.save();
       res.redirect("https://tradebattle.in/Client/signin.html");
    }
    else
    {
       res.send("email is not verified");
    }
}
module.exports={signup,signupOrganiser,verify}