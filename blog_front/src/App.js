import LoginPage from './Pages/Login.js';
import MainPage from './Pages/Main.js';
import SignupPage from './Pages/Signup.js';
import PostBlogPage from './Pages/PostBlog.js';
import OpenBlogPage from './Pages/OpenBlog.js'
import {Routes, Route, useNavigate, Link} from 'react-router-dom';
import {React, useState} from 'react';

var CurrUser = null;
var Display = null;

function App() {
  const navigate = useNavigate();
  const [isLogin, setLoginState] = useState(false);

  //for when Client is to be rerouted back to the home page logged in to an account
  function Login(Username, DisplayName) {

    //set the current logged in user and its corresponding display name
    CurrUser = Username
    Display = DisplayName

    setLoginState(true) //set the Login State to true to rerender the page with updated login information
    navigate('/') //reroute to home page
  }

  //for when user wants to logout
  function Logout() {

    //set the current logged in user and its corresponding display name to null
    Display = null;
    CurrUser = null;

    setLoginState(false) //set the Login State to false to rerender the page with updated login information
    navigate('/') //reroute to home page
  }

  //for when user is opening up a specific blog from the home page
  function OpenBlog(Post) {
    var Data = Post;
    Data.CurrUser = CurrUser;
    console.log(Data)
    navigate('/openblog', {state: Data})
  }
  
  return (
    <div>
      { isLogin ? <div>Hello, {Display}!</div> : null } {/* display this only if isLogin is true-the user is logged in, display null otherwise */}
      <Link to='/'>Home</Link> {/* Link to Home Page */}
      <Link to='signup'>Singup</Link> {/* Link to Signup Page */}
      <Link to='/login'>Login</Link> {/* Link to Login Page */}
      { isLogin ? <Link to='/postblog'>Post</Link> : null } {/* Link to the Page to post a blog, this Link is only display if isLogin is true-if a user is logged in, displaying null otherwise */}
      { isLogin ? <button onClick={Logout}>Logout</button> : null } {/* Display the Logout button only if isLogin is true-if there is a user logged in */}

      <Routes>
        <Route path='/' exact element={<MainPage OpenBlog={OpenBlog} CurrUser={CurrUser} />} /> {/* Route to the Main Page*/}
        <Route path='/signup' exact element={<SignupPage Login={Login} />} /> {/* Route to the Signup Page*/}
        <Route path='/login' exact element={<LoginPage Login={Login} />} /> {/* Route to the Login Page */}
        <Route path='/postblog' exact element={<PostBlogPage Author={CurrUser}/>} /> {/* Route to the Page to post a blog*/}
        <Route path='/openblog' exact element={<OpenBlogPage Login={Login} />} /> {/* Route to the Page for an opened blog */}
      </Routes>
    </div>
  );
}

export default App;