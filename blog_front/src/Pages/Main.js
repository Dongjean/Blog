import {React, useState, useEffect} from 'react';
import BlogPost from '../Components/BlogPost.js'

function Main(props) {
    const [Posts, setPosts] = useState(null)
    const [Cats, setCats] = useState(null)
    const CurrUser = props.CurrUser;

    //runs only on mount
    useEffect( () => {
        GetAllCats()
    }, [])

    function GetAllBlogs() {
        fetch('http://localhost:3001/getallblogs').then( //fetches all the blog posts from backend
            res => {
                return res.json()
            }
        ).then(
            response => {
                const Posts = response.res //response is an array of Posts if blog posts exists, and null otherwise
                setPosts(Posts) //sets the Posts state to the response
            }
        )
    }

    function GetAllCats() {
        fetch('http://localhost:3001/getallcats').then( //fetches all the blog posts from backend
            res => {
                return res.json()
            }
        ).then(
            response => {
                const AllCats = response.res //response is an array of Categories
                setCats(AllCats) //sets the Categories state to the response

                GetAllBlogs() //get all the blogs for all categories after the categories have been received
            }
        )
    }

    function onClick(Post) {
        props.OpenBlog(Post)
    }

    return (
        <div>
            {Cats ? Cats.map(Cat => {
                return (
                    <div key={Cat.categoryid}>
                        {Cat.category}
                    </div>
                )
            }) : null}
            
            {Posts ? Posts.map(Post => { {/* iterate through the Posts array if Posts is not null, and each post is Post */}
                return (
                    <div key={Post.PostID}>
                        <button onClick={() => onClick(Post)}> {/* Call the onClick method with parameter Post */}
                            <BlogPost Post={Post} CurrUser={CurrUser} /> {/* Display the specific Blog Post, passing in information of Post as a prop Post */}
                        </button>
                        <br />
                    </div>
                )
            }) : <div>There are no posts yet :(</div> } {/* If Posts is null-if there are no Posts */}
        </div>
    )
}

export default Main;