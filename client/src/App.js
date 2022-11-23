// This is React Front end code 
   // how to use: 
   // copy and paste it in your react_folder/src/App.js
import { useState, useEffect } from "react";

// settings
const baseURL = '';
function App() {
  // to show/hide login form and signup from
  const [toggle, setToggle] = useState({
    showSignIn: false,
    showLogIn: false,
    logOut: true
  });
  const [userAuth, setUserAuth] = useState({
    login: false,
    signup: false,
  })
  const [display, setDisplay] = useState({
    msg: "",
    data: {},
    err: {}
  });
  // console.log(display)
  // userAuth is set to false bu default. That means if you refresh the page, userAuth = false even you already login and the auth is still valid
  // this useEffect is used to check auth status of the user
  useEffect(() => {
    // Template - 1 session + proxy
    fetch(baseURL + '/user/loginStatus')
    .then(response => response.json())
    .then(data => {
      if (data.login) {
        console.log(data)
        setUserAuth(data)
      }
    })
    .catch(err => {console.log(err)}) // Template end
  }, [])
  return (
    <div className="App" style={style.app}>
      <Header toggle={toggle} setToggle={setToggle} userAuth={userAuth} setUserAuth={setUserAuth} setDisplay={setDisplay}/>
      <Home display={display}  setDisplay={setDisplay}/>
      {/* modals */}
      {toggle.showSignIn && <SingUp setUserAuth={setUserAuth} setToggle={setToggle} setDisplay={setDisplay}/>}
      {toggle.showLogIn && <LogIn setUserAuth={setUserAuth} setToggle={setToggle} setDisplay={setDisplay}/>}
    </div>
  );
}
export default App;

// components

// Header
function Header({ toggle, setToggle, userAuth, setUserAuth, setDisplay }) {
  return (
    <div className="header m-4" style={style.header}>
      <h1>Welcome to new projec Project</h1>
      <Navbar toggle={toggle} setToggle={setToggle} userAuth={userAuth} setUserAuth={setUserAuth} setDisplay={setDisplay}/>
    </div>
  );
}

// Navbar
function Navbar({ toggle, setToggle, userAuth, setUserAuth, setDisplay }) {
  // switch turn and false for login form, signup form
  const toggleSwitch = e => setToggle(prev => ({ showSignIn: false,
    showLogIn: false, [e.target.className]: !prev[e.target.className] }));
  const profileHandler = e => {
    // touch the auth check api and display the result
    // Template - 1 session + proxy
    fetch(baseURL + "/user/profile" )
    .then(response => response.json())
    .then(data => setDisplay(pre=> ({ data: data})))
    .catch(err => setDisplay(pre=> ({ err: err}) )) // Template end
  };
  const logOutHandler = e => {
    fetch(baseURL + '/user/logout')
    .then(response => response.json())
    .then(data =>{
      if (data.logout) {
        setUserAuth(pre=>({...pre, login: false}))
      // navigate to another page to trigger rerender
      setDisplay({
        msg: "You logged out",
        data: {},
        err: {}
      })}
    })
    .catch(err => setDisplay(pre=> ({errCode: 17, data: { msg: "wow something wrong" , ...err}, path: 'user logout'}) ))
  }
  return (
    <div className="navbar">
      <ul style={style.navbar_ul}>
        {!userAuth.login && <>
          <li className="btn btn-light px-5" onClick={toggleSwitch}><span className="showSignIn">Sign up</span></li>
          <li className="btn btn-light px-5" onClick={toggleSwitch}><span className="showLogIn">Log In</span></li>
        </>}
        {userAuth.login && <li className="btn btn-light px-5" onClick={logOutHandler}><span className="logOut">Log Out</span></li>}
        <li className="btn btn-light px-5" onClick={profileHandler}><span>profile</span></li>
      </ul>
    </div>
  );
}

// Home
function Home({display, setDisplay}) {
  // touch the backend and display res.json (string)
  useEffect(()=>{
    fetch(baseURL)
    .then(response => response.json())
    .then(data=> {
      setDisplay(pre=>({...pre, msg:data}))
    })
    .catch(err=> setDisplay(pre=>({...pre, data:err})))
  }, [])
  return (
    <div className="home">
      {
        display && <div className="container">
        {display.msg && <h4 className="text-center m-4">{display.msg}</h4> }
        {display.data && <div><strong className="text-info">data: </strong> {
        Object.entries(display.data).map((x, i)=>{
          if(typeof x =="object") {
            return <p key={i}>{x[0]} : {JSON.stringify(x[1])}</p>
          } else return <p key={i}>{x[0]} : {x[1]}</p>
        })
        }</div> }
        {display.err && <div><strong className="text-danger">error: </strong> {
        Object.entries(display.err).map((x, i)=>{
          if(typeof x =="object") {
            return <p key={i}>{x[0]} : {JSON.stringify(x[1])}</p>
          } else return <p key={i}>{x[0]} : {x[1]}</p>
        })
        }</div> }
        </div>
      }
    </div>
  );
}

// SingUp

// import { useState } from "react";
function SingUp({setUserAuth, setToggle, setDisplay}) {
  const signUpHandler = e => {
    e.preventDefault()
    // data to send to backend
    const dataToSend = {
      email: e.target.email.value,
      password: e.target.password.value,
      age: e.target.age.value,
      birthday: e.target.birthday.value,
      newsletter: e.target.newsletter.checked,
      phone: e.target.phone.value
    };
    // fetch with post method
    // Template - 1 session + proxy
    fetch(baseURL+'/user/create', {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setUserAuth({login: data.login, signup: data.signup}) 
        setToggle({
          showSignIn: false,
          showLogIn: false,
          logOut: true
        })
        setDisplay(prev => {
                return data.errCode ? { ...prev, err: data, msg: data.data.msg } : { ...prev, data: data, msg: "Welcome Join Us" };
               })
        setDisplay(prev=>({...prev, msg: "Welcome Join Us", data: data}))
      })
      .catch(error => setDisplay(prev=>({...prev, msg: "WoW! Something wrong!", err: error}))); // template end here
  }
  return (
    <div className="signup container">
      <h3 className="text-center">Sign up</h3>
      <form onSubmit={signUpHandler}>
          <div className="form-floating mb-3">
            <input type="email" name="email" id="email" className="form-control my-1" placeholder=" "/>
            <label htmlFor="email">email</label>
            </div>
          <div className="form-floating mb-3">
            <input type="password" name="password" id="password" className="form-control my-1" placeholder=" "/>
            <label htmlFor="password">password</label>
            </div>
        <div className="form-floating mb-3"><input type="button" name="fullName" value="fullName" className="btn btn-light"/></div>
          <div className="form-floating mb-3">
            <input type="number" name="age" id="age" className="form-control my-1" placeholder=" "/>
            <label htmlFor="age">age</label>
            </div>
          <div className="form-floating mb-3">
            <input type="date" name="birthday" id="birthday" className="form-control my-1" placeholder=" "/>
            <label htmlFor="birthday">birthday</label>
            </div>
          <div className="form-check mb-3">
            <input type="checkbox" name="newsletter" id="newsletter" className="form-check-input my-1"/>
            <label htmlFor="newsletter" className="form-check-label">newsletter</label>
            </div>
          <div className="form-floating mb-3">
            <input type="tel" name="phone" id="phone" className="form-control my-1" placeholder=" "/>
            <label htmlFor="phone">phone</label>
            </div>
        <div>
          <button type="submit" className="btn btn-primary m-3 px-5 py-2">Sign up</button>
        </div>
      </form>
    </div>
  );
}

// LogIn

// import { useState } from "react";
function LogIn({setUserAuth, setToggle, setDisplay}) {
  const loginHandler = e => {
    e.preventDefault()
    // data to send to backend
    const dataToSend = {
      email: e.target.email.value,
      password: e.target.password.value
    };
    // fetch with post method
    // Template - 1 session + proxy
    fetch(baseURL + '/user/login', {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
      .then((response) => response.json())
      .then((result) => {
        setDisplay(prev => {
          return result.errCode ? { ...prev, err: result, msg: result.data.msg } : { ...prev, data: result, msg: "Welcome Join Us" };
        });
        setUserAuth({login: result.login });
        setToggle({
          showSignIn: false,
          showLogIn: false,
          logOut: true
        });
      })
      .catch(error => setDisplay(prev => ({ ...prev, msg: "WoW! Something wrong!", err: error }))); // template end here
  }
  return (
    <div className="login container">
      <h3 className="text-center">Log in</h3>
      <form onSubmit={loginHandler}>
          <div className="form-floating mb-3">   
            <input type="email" name="email" id="email" className="form-control my-1" placeholder=" "/>
            <label htmlFor="email">email</label>
            </div>
          <div className="form-floating mb-3">   
            <input type="password" name="password" id="password" className="form-control my-1" placeholder=" "/>
            <label htmlFor="password">password</label>
            </div>
        <div>
          <button type="submit" className="btn btn-primary m-3 px-5 py-2">Log In</button>
        </div>
      </form>
    </div>
  );
}

// styles
const style = {
  app: {
    width: '100vw',
    height: '100vh',
    backgroundColor: "white",
  },
  header: {
    textAlign: 'center'
  },
  navbar_ul: {
    width: '100vw',
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'space-evenly'
  }
}