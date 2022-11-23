// importing dependencies
  const express = require('express');
  const bcrypt = require('bcrypt');
  const cors = require('cors');
  const mongoose = require('mongoose');
  const app = express();
  const secret = `secret_key` || process.env.SECRETKEY || "test";
  const nodemailer = require('nodemailer');
  // config dotenv
  require('dotenv').config();
  // importing Port
  const port = process.env.PORT || 5000;
  const dbLink = process.env.MONGODB || "mongodb://localhost:27017/new_projec"
  // Template - 1 session + proxy
  const session = require('express-session'); 
  // connect to database
  mongoose.connect(dbLink, err => {
      if (err) throw (err)
      console.log("MongoDB is connected")
  });
  // nodemailer settings with mailtrap
  // https://nodemailer.com/about/
  const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 25,
      auth: {
          user: "e0d191b54e8a81",
          pass: "892559adfce60c"
      }
  });
  // function to send email using transporter
  const nodeMailerOrigin = "http://localhost:5000/user"
  function sendEmail(mailTo, subject, message) {
      return new Promise((resolve, reject) => {
          transporter.sendMail({
              from: "info@lazydevs.com",
              to: mailTo,
              subject: subject,
              html: message // sending html formed code
          })
              .then(data => {
                  resolve(data);
              })
              .catch(error => {
                  reject({ errCode: 12, data: error, path: 'nodemailer.sendEmail' });
              })
      })
  };
  // middleware
  app.use(express.json())
  app.use(express.urlencoded({extended: false}))
  // Template - 1 session + proxy
  app.use(cors())
  app.use(session({ 
      secret: secret,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 2592000000 } // time period for session data(e.g. store data for 30 day)
  }))
  // Routers
  // index router
  const indexRouter = express.Router()
  indexRouter.get('/', home_controller)
  // user router
  const userRouter = express.Router()
  userRouter.post('/login', login_submit_controller)
  userRouter.post('/create', register_submit_controller)
  userRouter.get('/verify', verify_email_controller)
  userRouter.get("/profile", auth, profile_controller);
  userRouter.get("/logout", auth, logout_controller);
  userRouter.get("/loginStatus", auth, loginStatus_controller);
  // Router settings
  app.use('/', indexRouter)
  app.use('/user', userRouter)
  // server listen and connect to database
  app.listen(port, () => console.log("Server is running on port: " + port ));
  // mongoose Schema and model
  const { Schema, model } = require('mongoose');
  const userSchema = new Schema({
      verify: {
          email: {
          type: Boolean,
          default: false
          } 
      },
      secretKey: {
          type: String
      },
      email: {
              required: true,
              unique: true,
              type: String
          },
    password: {
              required: false,
              unique: false,
              type: String
          },
    age: {
              required: false,
              unique: false,
              type: Number
          },
    birthday: {
              required: false,
              unique: false,
              type: Date
          },
    newsletter: {
              required: false,
              unique: false,
              type: Boolean
          },
    phone: {
              required: false,
              unique: false,
              type: String
          }
  });
  // mongoose model
  const User_model = model('user', userSchema);
  // controllers
  function home_controller(req, res) {
      console.log("Front end say hi")
      res.json("Hello from Back end")
  } // Home Page
  // sign up controller-start
  async function register_submit_controller(req, res) {
      const { email } = req.body;
      const { password } = req.body;
      // for(let key in req.body){
      //   if(key.split('_')[1] == 'number'){
      //     req.body[key] = + req.body[key]
      //   }
      // }
      try {
        // check the email is already used or not
        const existUser = await mongodbFindOne(User_model, { email });
        if (existUser)
          return res.json({
            errCode: 11,
            data: { msg: "email already used" },
            path: "create user",
          });
        // email is ready to use
        // encrypt password
        const hashedPassword = await encrypt(password);
        //update the req.body.password
        req.body.password = hashedPassword;
        // save data in mongodb
        const userSaved = await mongodbSave(User_model, req.body);
        // get the _id of the user from mongodb
        const id = userSaved._id.toString();
        // send verification Emails to user by calling function sendEmail
        // create secretKey will send to user in verify email) based on id
        const nodemailerSecretKey = await encrypt(id);
        // save the secretKey to database
        await mongodbUpdate(
          User_model,
          { _id: id },
          { secretKey: nodemailerSecretKey }
        );
        // create the email message
        const message = `Hello,<br>
                 The Email "${req.body.email}" is used to register in new projec. To verify Your account please click on <a href="${nodeMailerOrigin}/verify?email=${req.body.email}&secretKey=${nodemailerSecretKey}">This Link</a>
                 Thanks
                 Auth-Code-Gen Team.`;
        await sendEmail(
          req.body.email,
          "Verification Email from new projec",
          message
        ); // end of nodemailer part
        // Template - 1 session + proxy
        // save user info in session
        req.session.user = userSaved;
        req.session.user.password = null;
        res.json({ signup: true, login: true, verificationEmailSended: true });
        req.user = { ...userSaved._doc, password: null, secretKey: null };
      } catch (error) {
        res.json(error);
      }
    } // controller-end
  // login controller-start
  async function login_submit_controller(req, res) {
      const { email } = req.body;
      const { password } = req.body;
      try {
        const user = await mongodbFindOne(User_model, { email });
        // check if user not exist, user should be null
        if (!user) {
          return res.json({
            errCode: 15,
            data: { msg: "email not find" },
            path: "user login",
          });
        } // end  if (!user)
        // user exist, compare the password => user.password, password
        const compareResult = await compareEncryptData(password, user.password);
        if (!compareResult) {
          return res.json({
            errCode: 16,
            data: { msg: "wrong password" },
            path: "user login",
          });
        } // end (!compareResult)
        // get the _id of the user from mongodb
        const id = user._id.toString();
        // Template - 1 session + proxy
        req.session.user = user;
        req.session.user.password = null; 
        res.json({ login: true });
        req.user = { ...user._doc, password: null, secretKey: null };
      } catch (error) {
        res.json(error);
      }
    } // controller-end
  async function verify_email_controller(req, res) {
      const { email, secretKey } = req.query;
      try {
        // use email and secretKey to find that user
        const user = await mongodbFindOne(User_model, { email, secretKey });
        // if user==null that means verify_email is unsuccessful
        if (!user) return res.json({ errCode: 13, data: err, path: "verify_email_controller.user_not_find" });
        // verify_email success update db
        await mongodbUpdate(User_model, {_id: user._id}, { "verify.email": true });
        res.json({ path: "emailVerification", verified_email: true });
      } catch (error) {
        res.json(error);
      }
  };
  function logout_controller(req, res) {
    // Template - 1 session + proxy
    req.session.destroy();
    res.json({ login: false, logout: true })
  };
  function profile_controller(req, res) {
      res.json(req.user);
  };
  function loginStatus_controller(req, res) {
    res.json({ login: true })
  }
  // middleware
  // auth check
  // this middleware is used to check if user is login or not
  // if user is login, save user data in req.user and call next()
  async function auth(req, res, next) {
    // Template - 1 session + proxy
    if(req.session.user) {
      req.user = { ...req.session.user, password: null, secretKey: null};
      next();
    }  else res.json({ errCode: 33, data: { msg: "you need login first" }, path: 'middleware.auth' })
  };
  // partial functions
  function encrypt(data, rounds = 10) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(rounds, (error, salt) => {
        if (error)
          return reject({ errCode: 0, data: error, path: "encrypt.genSalt" });
        else {
          bcrypt.hash(data, salt, (error, hashedData) => {
            if (error)
              return reject({ errCode: 1, data: error, path: "encrypt.hash" });
            else {
              return resolve(hashedData);
            }
          });
        }
      });
    });
  }
  function compareEncryptData(data, encryptData) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(data, encryptData, (error, result) => {
        if (error)
          return reject({
            errCode: 2,
            data: error,
            path: "compareEncryptData.compare",
          });
        else {
          resolve(result);
        }
      });
    });
  }
    function mongodbSave(model, data) {
      return new Promise((resolve, reject) => {
        model
          .create(data)
          .then((savedData) => resolve(savedData))
          .catch((error) =>
            reject({ errCode: 20, data: error, path: "mongodbSave.create" })
          );
      });
    }
    function mongodbUpdate(model, query, dataToUpdate) {
      return new Promise((resolve, reject) => {
        model
          .updateOne(query, dataToUpdate)
          .then((result) => resolve(result))
          .catch((error) =>
            reject({ errCode: 21, data: error, path: "mongodbUpdate.updateOne" })
          );
      });
    }
    function mongodbFindOne(model, query) {
      return new Promise((resolve, reject) => {
        model
          .findOne(query)
          .then((result) => {
            resolve(result);
          })
          .catch((error) =>
            reject({ errCode: 22, data: error, path: "mongodbFindOne.findOne" })
          );
      });
    }