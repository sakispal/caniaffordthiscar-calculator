const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const fs = require("fs");
const ejs = require('ejs');


function sendMail(data, user){
	var template = fs.readFileSync("./views/templates/emailBudget.ejs", "utf-8");
	var options = {
  	rmWhitespace : true,
  }
	var html = ejs.render(template, data, options)

	nodemailer.createTestAccount((err, account) => {

    let transporter = nodemailer.createTransport({
        // sendmail:  true,
        host: 'mail.privateemail.com',
        port: 465,
        secure: true, 
        auth: {
            user: "admin@caniaffordthiscar.com", 
            pass: process.env.EMAIL_PASS 
        }
    });

    let mailOptions = {
      from: '"Admin" <admin@caniaffordthiscar.com>', 
      to: user.email, 
      subject : "New Car Query",        
      html: html
    };

    console.log("Email will be sent to " + mailOptions.to);
    console.log("Rendered html is" + mailOptions.html);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
  });
};


module.exports = sendMail;