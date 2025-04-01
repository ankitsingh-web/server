
import nodemailer from 'nodemailer'

// Create auth plain transport
const sendEmail =async function({email,subject,message}){
 // console.log(process.env.SMTP_HOST)
  console.log( 'send emial is -> ', email);
  let transport= nodemailer.createTransport({

  host: "smtp.gmail.com",
  port: 587,
  secure: false,//true for given port false fr other
  auth: {
    user: "singhamit18033@gmail.com",
    pass: "urix xeup vniw eyjg",
    // type: 'PLAIN',
  },
  
});
// Send email
const sent = await transport.sendMail({
  from :'"LMS"<singhamit18033@gmail.com>',
  to: email,
  subject: subject,
  text: 'Verification mail for reset-password',
  html: message,
});
}
export default sendEmail;









