import {useLocation} from 'react-router-dom';
import {useState} from 'react';
import CommentsSection from '../Components/CommentsSection';

function OpenBlog(props) {
    const Data = useLocation().state; //get data about Post from App.js
    const isViewerAuthor = (Data.CurrUser == Data.Username); //isViewerAuthor is true if Data.CurrUser = Data.Username, AKA the viewer is the author of the post
    const [isCommentsOpen, setCommentsOpenState] = useState(false); //comments are not open from the beginning by default
    const [Comments, setCommentsState] = useState(null);

    //function called to delete the post
    async function DeletePost() {
        const PostID = Data.PostID

        //send a POST request to /deleteblog with FD in its body
        await fetch('http://localhost:3001/deleteblog', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({PostID: PostID})
        })
        
        props.Login(Data.Username, Data.DisplayName); //go back to the HomePage still logged in as the user
    }

    async function getComments() {
        const PostID = Data.PostID

        //send a GET request to /getcomments with PostID as a parameter
        const result = await fetch('http://localhost:3001/getcomments/' + PostID)
        result.json().then(response => {
            const Comments = response.res
            setCommentsOpenState(true) //set the isCommentsOpen State to true to show comments
            setCommentsState(Comments) //update the information stored in the Comments State
        })
    }

    function closeComments() {
        setCommentsOpenState(false) //set the isCommentsOpen State to false to hide comments
    }

    return (
        <div> {/* diplaying the blog post itself first */}
            <h1>Title: {Data.Title}</h1> <br />
            Author: {Data.DisplayName} <br /><br />
            <img src={`data:image/jpeg;base64,${Data.Image}`} alt={Data.ImageName} /> <br /> {/* Display the image base64 image data as an image */}
            {Data.PostText} <br />

            {isViewerAuthor ? <button onClick={DeletePost}>Delete Post</button> : null} {/* Only Displays if isViewerAuthor is true-if the viewer of the post is the author themselves, otherwise displays null. This button deletes the post */}

            {/* Displays Button to open the Comments section if not already open, and a Button to close it if it already is open */}
            {isCommentsOpen ? 
            <div>
                <CommentsSection Comments={Comments} /> {/* Display the comments section */}
                <button onClick={closeComments}>Close Comments</button> {/* Display the close button */}
            </div> :
            <button onClick={getComments}>Comments</button>} {/* Display the open button */}
        </div>
    )
}

export default OpenBlog;