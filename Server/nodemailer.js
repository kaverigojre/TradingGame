const nodemailer = require("nodemailer");
const jwt=require("jsonwebtoken");
require("dotenv").config(); 
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const models= require("../../models/userModel");
  

const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf';




const register=async (parent, args, { transporter, models, EMAIL_SECRET }) => {
    const hashedPassword = await bcrypt.hash(args.password, 12);
    const user = await models.user.create({
      ...args,
      password: hashedPassword,
    });

    // async email
    jwt.sign(
      {
        user: _.pick(user, 'id'),
      },
      EMAIL_SECRET,
      {
        expiresIn: '1d',
      },
      (err, emailToken) => {
        const url = `https://api.tradebattle.in/confirmation/${emailToken}`;

        transporter.sendMail({
          to: args.email,
          subject: 'Confirm Email',
          html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
        });
      },
    );
}
