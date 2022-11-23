
# LAZY DEVS - OVERVIEW

Lazy Devs is an authentication tool for developers. It will create for you all the authentication backend and front-end forms that are necessary for a user to log in, register, and log out from your website.

## INTRODUCTION

Lazy Devs is an authentication tool for websites. Usually, developers spend 1 - 2 days on their authentication code, both on the front end and back end. This tool will create all the code for you. In our tool, we choose the most used packages and approaches by developers to create user authentication for their websites. In just a few clicks you can get it done, copy or download a zip folder, and you are all set! :D

## ADVANTAGES OF THE LAZY DEVS TOOL

- save time: usually, it takes 1-2 days of work to write an authentication backend and frontend code, with lazy devs you get it in less than a minute.
- Freedom to choose the best approach: As developers, we know that each and one of us has his own way of writing the code. After some research we’ve made, we chose the 3 most used approaches for authentication in a website and let you choose them.
- It's easy: instead of investing lots of time and energy in researching and implementing packages and methods, just a few clicks and you have it.
- Easy for beginners: Our tool is perfect for beginners. First, it will help them to get their website authentication fast and perfect, and also by doing that they can learn the most used methods of creating a user authentication and look deep into the code with small explanation comments that we added.

## GETTING STARTED
 
### Step One - create inputs

for registration or logging into a website we use inputs for getting the user data.

1. choose a name for your input.
2. select the input type you desire.
3. not mandatory, if you want the input to be unique or required turn the want validation switch to on and choose which one of them you want or all of them.
4. Click on Generate button, to generate your input.

### Step Two - choose which inputs to add for the login component

choose which inputs to add for the login component ( how will the user log in? Email & password ? Or email & username ? ) and select one of them to be the main input for the login component. automatically the first inputs you create will go to the registration component. in case you don't add any of them to login input our tool automatically will choose for you the first one you've created.

### Step Three - choose the auth method

when creating a user authentication there are many approaches. After some research, we've made we chose for you the 3 most used methods by developers for you to choose from. Just check one of them, and it will be implemented in your template.

- [SESSION](https://github.com/expressjs/session#readme)
- [JWT](https://jwt.io/introduction) & [COOKIE](https://github.com/jshttp/cookie) —> Token inside the cookie to authenticate the user.
- [JWT](https://jwt.io/introduction) & [AXIOS](https://axios-http.com/docs/intro) —> Token inside the header of the request.

### Step Four - Choose packages

Here you can choose if you want dotenv and nodemailer to be installed and implemented in your app.

- [DOTENV](https://www.npmjs.com/package/dotenv)
- [NODEMAILER](https://nodemailer.com/about/)

### Step five - Initializing your backend app

Usually when creating a nodeJS app we can initialize our app details, for example, author name, project description, and so on.. here you can fill up the form and get those details injected into your app.

### Step six - create the template

Click the CREATE TEMPLATE button and your finished template will appear on the right side of your screen.

### Step seven - NOT MANDATORY

If you want to save the template and get it whenever you need it you can register to our database and save your templates and review them whenever you need.

### Step eight - implementing your template in your code editor

Install dependencies in client and server repositories ( npm install in terminal in both repositories ) then npm start. For registered users, you can download a zip folder of your template.

1. Extract the project
2. Open terminal in project root folder(where you can see server folder and client folder)
3. Type ```npm install``` , enter, wait until installation finished
4. Type ```npm run install_both``` , enter, and wait till both installed. here you need to wait for both back-end & front-end to compile. front-end compile usually takes a little longer.
5. Type ```npm start``` , enter, now you can start your project

### Step nine - start your project based on the template you've created

## Some Template Logic

- When you want to use nodemailer, you must have an input with type == 'email'.
- Password will always get encrypted.
- Registration Inputs will be added to Schema, except type == 'button'
- If you put nothing in login inputs, the main input of registration inputs will be the login inputs (your first registration input will be the main input by default)

## Error Code For Running The Template

- {errCode: 0, data: error, path: 'encrypt.genSalt'}
- {errCode: 1, data: error, path: 'encrypt.hash'}
- {errCode: 2,data: error,path: 'compareEncryptData.compare',}
- {errCode: 3, data: error, path: 'jwtSign.sign.payload.obj'}
- {errCode: 4, data: error, path: 'jwtSign.sign.payload.str'}
- {errCode: 5, data: error, path: 'jwtVerify.verify'}
- {errCode: 20, data: error, path: 'mongodbSave.create'}
- {errCode: 21, data: error, path: 'mongodbUpdate.updateOne'}
- {errCode: 22, data: error, path: 'mongodbFindOne.findOne'}
- {errCode: 26, data: error, path: 'req.session.save'}
- {errCode: 11, data: { msg: 'email already used' }, path: 'create user'} // find the email address in DB
- { errCode: 12, data: error, path: 'nodemailer.sendEmail' }
- { errCode: 14, data: err, path: 'send verification email' }
- {errCode: 15, data: { msg: 'email not find' }, path: 'user login'}
- {errCode: 16, data: { msg: 'wrong password' }, path: 'user login'}
- {errCode: 17, data: { msg: 'wow something wrong' , ...err}, path: 'user logout'}
- {errCode: 18, data: { msg: 'wow something wrong' , ...err}, path: '/user/profile'}
- { errCode: 33, data: { msg: 'you need login first' }, path: 'middleware.auth' }
