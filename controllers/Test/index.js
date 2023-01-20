"use strict";
const crypto = require("crypto");
const nodemailer = require("nodemailer");
let { users } = require("../fakeDb");
let fs = require("fs");

async function hash(password) {
  return new Promise((resolve, reject) => {
    // generate random 16 bytes long salt
    const salt = crypto.randomBytes(16).toString("hex");

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}

// verify password in case you need
async function verify(password, hash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key == derivedKey.toString("hex"));
    });
  });
}

//Add some details

exports.addDetails = async (req, res) => {
  try {
    const { name, email, password } = req.payload;

    let hashedPassword = password ? await hash(password) : "";

    let details = {
      id: Math.floor(Math.random() * 10),
      name,
      email,
      hashedPassword,
      message: "Details added successfully",
    };

    users.push({ id: details.id, name, email, hashedPassword });

    console.log(users);

    return details;
  } catch (error) {
    console.log(error);
  }
};

//Show All details

exports.showDetails = async (req, res) => {
  try {
    let details = {
      users, // Here 'users' is array of objects (static). One can get their dynamic data from DB.
      message: "Details fetched successfully",
    };

    return details;
  } catch (error) {
    console.log(error);
  }
};

//View details

exports.viewDetails = async (req, res) => {
  try {
    let { id } = req.params;

    let userDetails = users.filter((user) => user.id == id);

    let details = {
      userDetails,
      message: "Detail fetched successfully",
    };

    return details;
  } catch (error) {
    console.log(error);
  }
};

//update Details

exports.update = async (req, res) => {
  try {
    const { id, name, email } = req.payload;

    let updateusers = users.map((user) =>
      user.id === id ? { ...user, name: name, email: email } : user
    );

    users = updateusers;

    let details = {
      updateusers,
      name,
      email,
      message: "Details updated successfully",
    };

    console.log(updateusers);

    return details;
  } catch (error) {
    console.log(error);
  }
};
exports.delete = async(req,res)=>{
  try {
    const { id } = req.params;
    let deleteUser = users.splice(users.findIndex(item=>item.id===id),1);
    let details = {
      deleteUser,
      message: "Detail deleted successfully",
    };
    console.log(deleteUser);
    return details
  } catch (error) {
    console.log(error)
  }
}
exports.fileUpload = async (req, res) => {
  try {
    fs.createWriteStream(
      __dirname + "../../../uploads/" + req.payload.file.filename
    );

    let details = {
      msg: "File upload successfull",
    };
    return details;
  } catch (error) {
    console.log(error);
  }
};

exports.sendEmail = async (req, res) => {
  try {
    // let testAccount = await nodemailer.createTestAccount();
    let transporter = await nodemailer.createTransport({
      name:'ethereal.com',  
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "jennie.crist@ethereal.email", // generated ethereal user
        pass: "fpxBFWYmrWvdnqcd2h", // generated ethereal password
      },
    });
      let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "sddutta90@gmail.com", // list of receivers
        subject: "Appointed as a dev ✔", // Subject line
        text: "Hello Santanu, Welcome to CX", // plain text body
        html: "<b>Hello Santanu</b>", // html body
      });
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      return info;
  } catch (error) {
    console.log("error>", error);
  }
};
