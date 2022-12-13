import LoginPage from './Pages/Login.js';
import MainPage from './Pages/Main.js';
import SignupPage from './Pages/Signup.js';
import PostBlogPage from './Pages/PostBlog.js';
import OpenBlogPage from './Pages/OpenBlog.js';
import AddCategory from './Components/AddCategory.js';
import UpdatePostPage from './Pages/UpdatePost.js';
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
    navigate('/openblog', {state: Data})
  }
  
  function UpdatePost(Post, Cats) {
    var Data = Post;
    Data.Cats = Cats;
    navigate('/updatepost', {state: Data})
  }
  
  return (
    <div>
      { isLogin ? <div>Hello, {Display}!</div> : null } {/* display this only if isLogin is true-the user is logged in, display null otherwise */}
      <Link to='/'>Home</Link> {/* Link to Home Page */}
      <Link to='signup'>Singup</Link> {/* Link to Signup Page */}
      <Link to='/login'>Login</Link> {/* Link to Login Page */}
      { isLogin ? <Link to='/postblog'>Post</Link> : null } {/* Link to the Page to post a blog, this Link is only display if isLogin is true-if a user is logged in, displaying null otherwise */}
      { isLogin ? <Link to='/createcategory'>Create-Category</Link> : null } {/* Display the Create Category button only if isLogin is true-if there is a user logged in */}
      { isLogin ? <button onClick={Logout}>Logout</button> : null } {/* Display the Logout button only if isLogin is true-if there is a user logged in */}

      <Routes>
        <Route path='/' exact element={<MainPage OpenBlog={OpenBlog} UpdatePost={UpdatePost} CurrUser={CurrUser} />} /> {/* Route to the Main Page*/}
        <Route path='/signup' exact element={<SignupPage Login={Login} />} /> {/* Route to the Signup Page*/}
        <Route path='/login' exact element={<LoginPage Login={Login} />} /> {/* Route to the Login Page */}
        <Route path='/postblog' exact element={<PostBlogPage Author={CurrUser}/>} /> {/* Route to the Page to post a blog*/}
        <Route path='/openblog' exact element={<OpenBlogPage Login={Login} UpdatePost={UpdatePost} />} /> {/* Route to the Page for an opened blog */}
        <Route path='/createcategory' exact element={<AddCategory CurrUser={CurrUser} DisplayName={Display} Login={Login} />} /> {/* Route to the Page to create a new category */}
        <Route path='/updatepost' exact element={<UpdatePostPage />} />
      </Routes>
    </div>
  );
}

export default App;