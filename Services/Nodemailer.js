import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false, // Use `true` for port 465, `false` for all other ports
//   auth: {
//     user: process.env.PASSMAIL,
//     pass: process.env.PASSKEY,
//   },
// });

// //async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: process.env.PASSMAIL, // sender address
//     to: {email}, // list of receivers
//     subject: "Reset Password", // Subject line
//     text: `A request is made to reset your password. If it is made by you click the following link to proceed http://localhost:5173/reset/${employee._id}/${token} If it is not done by you ignore the mail.`, // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

// main().catch(console.error);

export const sendLink = async (email, token, employeeId) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.PASSMAIL,
      pass: process.env.PASSKEY,
    },
  });
  async function main(req,res) {
    try {
      const info = await transporter.sendMail({
        from: process.env.PASSMAIL, 
        to: email, 
        subject: "Reset Password", 
        text: `http://localhost:5173/resetpw/${employeeId}/${token}`,
      html: `<p>A request is made to reset your password. If it is made by you click the following link to proceed: <a href="http://localhost:5173/resetpw/${employeeId}/${token}">Reset Password</a>. If it is not done by you, ignore the mail.</p>`, 
      });
    //   res.status(200).json({message:"Mail Sent Successfully"})
    console.log("Mail Sent Successfully")
    } catch (error) {
        console.log(error)
        // res.status(500).json({message:"Internal Server Error Unable to Sent Mail"})
        console.log("Internal Server Error Unable to Sent Mail")
    }
  }
  main()
};

