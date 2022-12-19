//Components imports
import CommentsSection from '../Components/CommentsSection';
import LikesSection from '../Components/LikesSection';

import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';

function OpenBlog(props) {
    const Data = useLocation().state; //get data about Post from App.js
    const isViewerAuthor = (Data.CurrUser == Data.Username); //isViewerAuthor is true if Data.CurrUser = Data.Username, AKA the viewer is the author of the post
    const [isCommentsOpen, setCommentsOpenState] = useState(false); //comments are not open from the beginning by default
    const [Comments, setCommentsState] = useState(null);
    const [Cats, setCats] = useState([]);
    const PostID = Data.PostID;

    //runs only once on mount
    useEffect(() => {
        getCats()
    }, [])

    function getCats() {
        fetch('/getcategories/' + PostID).then(
            res => res.json()
        ).then(
            response => {
                setCats(response.res)
            }
        )
    }

    //function called to delete the post
    async function DeletePost() {

        //send a POST request to /deleteblog with PostID in its body
        await fetch('/deleteblog', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({PostID: PostID})
        })
        
        props.Login(Data.Username, Data.DisplayName); //go back to the HomePage still logged in as the user
    }

    function getComments() {

        //send a GET request to /getcomments with PostID as a parameter
        fetch('/getcomments/' + PostID).then(
            res => res.json()
        ).then(
            response => {
                const Comments = response.res
                setCommentsOpenState(true) //set the isCommentsOpen State to true to show comments
                setCommentsState(Comments) //update the information stored in the Comments State
            }
        )
    }

    function closeComments() {
        setCommentsOpenState(false) //set the isCommentsOpen State to false to hide comments
    }

    function UpdatePost(Post) {
        props.UpdatePost(Post, Cats)
    }

    return (
        <div> {/* diplaying the blog post itself first */}
            <h1>Title: {Data.Title}</h1> <br />
            Author: {Data.DisplayName} <br /><br />
            Categories: {Cats.filter(Cat => Cat.categoryid !== 0).map(Cat => { //Cats.filter..... returns the array of Categories Cats without the All Category
                return <div key={Cat.categoryid}>{Cat.category}</div> //Displays the Category
            })}
            <br />
            <img src={`data:image/jpeg;base64,${Data.Image}`} alt={Data.ImageName} /> <br /> {/* Display the image base64 image data as an image */}
            {Data.PostText} <br />

            {/* Displaying Post's Likes and buttons to like and unlike */}
            <LikesSection CurrUser={Data.CurrUser} PostID={Data.PostID} />

            {isViewerAuthor ? <div>
                <button onClick={DeletePost}>Delete Post</button>
                <button onClick={() => UpdatePost(Data)}>Update Post</button>
            </div> : null} {/* Only Displays if isViewerAuthor is true-if the viewer of the post is the author themselves, otherwise displays null. This button deletes the post */}

            {/* Displays Button to open the Comments section if not already open, and a Button to close it if it already is open */}
            {isCommentsOpen ? 
            <div>
                <CommentsSection Comments={Comments} PostID={Data.PostID} CurrUser={Data.CurrUser} getComments={getComments} /> {/* Display the comments section */}
                <button onClick={closeComments}>Close Comments</button> {/* Display the close button */}
            </div> :
            <button onClick={getComments}>See Comments</button>} {/* Display the open button */}
        </div>
    )
}

export default OpenBlog;