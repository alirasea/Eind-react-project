const { model, Error } = require('mongoose');
const users = require("../modules/user");
const crypto=require("crypto")
const bcrypt=require("bcrypt");
require('dotenv').config();
const nodemailer = require("nodemailer");
const PORT = process.env.PORT ;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { render } = require('ejs');
const { post } = require('../roots/roots');

const redirecttologin =( req,res) =>{
if(req.method==="GET"){
    res.redirect("/login")
}
}
///////////////////////////
const singup = async (req, res) => {
    try {
        let { UserName, Password, email, phoneNumber, IPAddress } = req.body;
        console.log(req.body);
        // Check if the email is already registered
        const usercheck =  await users.findOne({ email }).maxTimeMS(30000);;
        if (usercheck) {
            return res.status(400).send({ errors: { message: "the email has already registered" }});
        }

        // Generate an email token for verification
        const emailtoken = crypto.randomBytes(64).toString("hex");

        // Create a new user instance
        const NewUser = new users({ UserName, Password, email, phoneNumber, IPAddress, emailtoken });

        // Hash the password
        const hash = bcrypt.hashSync(Password, 15);
        NewUser.Password = hash;

        // Save the user to the database
        await NewUser.save();

        // Send confirmation email to the user
        sendEmailToClient(email, UserName, emailtoken, PORT);

        // Respond with success message
        return res.status(200).json({ redirect: '/info' });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ errors });
        } else {
            return res.status(500).json({ error: "Failed to register user" });
        }
    }
};

async function sendEmailToClient(email, UserName, emailtoken, PORT) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.Appemail,
            pass: process.env.AppPassword,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: '"registration-system 👻" <aboakhras4@gmail.com>',
            to: email,
            subject: "Hello ✔",
            text: `Hello ${UserName}`,
            html: `<b>Hello ${UserName}</b> <a href="http://localhost:${PORT}/VerificationEmail?emailtoken=${emailtoken}">Verification Link</a>`
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

// Function to send confirmation email
async function sendemailtoclient(email, UserName, emailtoken, PORT) {
    console.log(emailtoken);
    // Create transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.Appemail,
            pass: process.env.AppPassword,
        },
    });

    // Send email
    try {
        const info = await transporter.sendMail({
            from: '"registration-system 👻" <aboakhras4@gmail.com>',
            to: email,
            subject: "Hello ✔",
            text: `Hello ${UserName}`,
            html: `<b>Hello ${UserName}</b> <a href="http://localhost:${PORT}/VerificationEmail?emailtoken=${emailtoken}">Verification Link</a>`
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

/////////////////////


const tokenval = (req, res) => {
    const emailtoken = req.query.emailtoken;
    if (!emailtoken) return res.status(404).json("Token not found");
    users.findOneAndUpdate({ emailtoken }, { isValid: true, emailtoken: null },{ new:true }) 
        .then(newUser => {
            const payload = {
                userId: newUser._id,
                UserName: newUser.UserName
            };
            jwt.sign(payload, process.env.MY_SECRET, { algorithm: 'HS256',expiresIn: '4h' }, (err, token) => {
                if (err) {
                    res.clearCookie(token);
                    res.status(500).json({ error: "Failed to generate token" });
                } else {
                    res.cookie("token",token)
                    res.status(200).json({ redirect:`/user/${newUser._id}`});
                }
            })
        })
        .catch(error => {
           return res.status(404).json("deed token");
        })
};


async function sendemailtoclient(email,UserName,emailtoken,PORT){
    console.log(emailtoken)
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.Appemail,
            pass: process.env.AppPassword, 
        },
    });

    try {
        const info = await transporter.sendMail({
            from: '"registration-system 👻" <aboakhras4@gmail.com>',
            to: email,
            subject: "Hello ✔",
            text: `Hello ${UserName}`,
            html: `<b>Hello ${UserName}</b> <a href="http://localhost:${PORT}/VerificationEmail?emailtoken=${emailtoken}">Verification Link</a>`
        });
        HoldingUntileRedirect(email)
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

 function HoldingUntileRedirect(email){
                setTimeout(() => {
                users.findOne({email}) 
                    .then((newuser)=>{
                        if (newuser.isValid === false) {
                             newuser.deleteOne({ email })
                                .then(() =>{
                                     console.log("User deleted successfully")
                                      return
                                    })
                                .catch((err) => console.error("Error deleting user:", err));
                    }}) 
              }, 150000);           
}


const login = (req,res)=>{
    if(req.method==="GET"){ 
        res.json({ errors: null })
    }else if(req.method==="POST"){
       const{email,Password}=req.body;
       if(!email || !Password) return res.status(404).json( {errors:"passwords or username  uncorrect"})
       users.findOne({email})
            .then((discover)=>{
                if (!discover) {
                    return res.status(400).json( { errors: 'Passwords or username incorrect' });
                }
               console.log(discover)
               bcrypt.compare(Password, discover.Password, (err, result) => {
                if(err){
                    res.status(400).json({message:"err"})//.render("login")
                }
                if (result){
                    const payload = {
                    userId: discover._id,
                    UserName: discover.UserName
                };
                console.log(discover)
                jwt.sign(payload, process.env.MY_SECRET, { algorithm: 'HS256',expiresIn: '4h' }, (err, token) => {
                    if (err) {
                        res.clearCookie(token);
                        res.status(500).json({ error: "Failed to generate token" });
                    } else {
                        res.cookie("token",token)
                        res.status(200).json({redirect:`/user/${discover._id}`});
                    }
                });
               }else{
                return res.status(400).json({errors: 'passwords or username  uncorrect'})
               }})
            })
            .catch(error=>{
                console.error(error); 
                 res.status(500).json({message:"Internal Server Error"});
            })
    }
};


const cookieJWTAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.clearCookie("token");
        return res.json({ redirectTo:"/login"});
    }
    jwt.verify(token, process.env.MY_SECRET, { algorithm: 'HS256' }, (err, user) => {
        if (err) {
            res.clearCookie("token");
            return res.json({ redirectTo:"/login"});
        } else {
            req.user = user;
            console.log(user);
            next();
        }
    });
};


const logout=(req,res)=>{
    if(req.method==="GET"){
        res.clearCookie('token');
        res.json({ redirectTo:"/login"});
    }
}



const user=(req,res)=>{
if (req.method==="GET"){
    const UserName = req.query.UserName;
 return res.json({ UserName })
}
}

module.exports = {
    singup,
    tokenval,
    login,
    cookieJWTAuth,
    logout,
    user,
    redirecttologin,    
}






/* 
const singup = post("post_formData", async (req, res) => {
    if (req.method === "GET") {
        return res.json({ errors: null })
    } else if (req.method === "POST") {
        console.log(req.body)
        const { UserName, Password, email, phoneNumber, IPAddress } =req.body
        console.log(req.body)
        users.findOne({ email })
            .then((usercheck)=>{ if ( usercheck ){
             return res.status(400).send({ errors: { message: "the email has already registed" }})
            }else{
            let emailtoken = crypto.randomBytes(64).toString("hex")
            const NewUser = new users({UserName, Password, email, phoneNumber, IPAddress, emailtoken})
            NewUser.save()
            .then(() => {
                const hash = bcrypt.hashSync(Password, 15);
                NewUser.Password = hash;
                return NewUser.save();
            })
            .then(() => {
                sendemailtoclient(email, UserName, emailtoken, PORT);
                res.status(200).json({redirect: '/info'});
            })
            .catch((saveError) => {
                if (saveError.name === 'ValidationError') {
                    let errors = {};
                    Object.keys(saveError.errors).forEach((key) => {
                        errors[key] = saveError.errors[key].message;
                    });
                    return res.status(400).json( { errors: errors });
                } else {
                    handleSavingError(NewUser, email, res);
                }
            });
            function handleSavingError(user, email, res) {
                user.deleteOne({ email })
                    .then(() => {
                        return res.status(400).json( { errors: { message: "Failed to save user" }});
                    })
                    .catch((deleteError) => {
                        res.status(500).json({ error: "Error deleting user", deleteError });
                    });
            }
        
    }
})}
} ) */