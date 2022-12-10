import {React, useState, useEffect} from 'react';
import BlogPost from '../Components/BlogPost.js'

function Main(props) {
    const [Posts, setPosts] = useState(null)
    const CurrUser = props.CurrUser;

    //runs only on mount
    useEffect( () => {
        fetch('http://localhost:3001/allblogs').then( //fetches all the blog posts from backend
            res => {
                return res.json()
            }
        ).then(
            response => {
                const Posts = response.res //response is an array of Posts if blog posts exists, and null otherwise
                setPosts(Posts) //sets the Posts state to the response
            }
        )
    }, [])

    function onClick(Post) {
        props.OpenBlog(Post)
    }

    return (
        <div>
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