import {useLocation} from 'react-router-dom';

function OpenBlog(props) {
    const Data = useLocation().state; //get data about Post from App.js
    console.log(Data.CurrUser)
    const isViewerAuthor = (Data.CurrUser == Data.Username);

    //function called to delete the post
    async function DeletePost() {

        //append PostID into FormData object FD
        const FD = new FormData();
        FD.append('PostID', Data.PostID)

        //send a POST request to /deleteblog with FD in its body
        await fetch('http://localhost:3001/deleteblog',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({PostID: Data.PostID})
        })
        
        props.Login(Data.Username, Data.DisplayName); //go back to the HomePage still logged in as the user
    }

    return (
        <div> {/* diplaying the blog post itself first */}
            <h1>Title: {Data.Title}</h1> <br />
            Author: {Data.DisplayName} <br /><br />
            <img src={`data:image/jpeg;base64,${Data.Image}`} alt={Data.ImageName} /> <br /> {/* Display the image base64 image data as an image */}
            {Data.PostText} <br />

            {isViewerAuthor ? <button onClick={DeletePost}>Delete Post</button> : null} {/* Only Displays if isViewerAuthor is true-if the viewer of the post is the author themselves, otherwise displays null. This button deletes the post */}
        </div>
    )
}

export default OpenBlog;