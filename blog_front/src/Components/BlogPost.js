import {useState, useEffect} from 'react';

function BlogPost(props) {
    const PostID = props.Post.PostID;
    const [LikesCount, setLikesCount] = useState(0);

    //only runs once on mount
    useEffect(() => {
        GetLikesCount()
    }, [])

    //method to get the number of likes for the post
    function GetLikesCount() {
        //send a GET request to /getlikes with PostID as a parameter
        fetch('http://localhost:3001/getlikes/' + PostID).then(
            res => res.json()
        ).then(
            response => {
                const LikesCount = response.res
                setLikesCount(LikesCount) //update the information stored in the LikesCount State
            }
        )
    }

    return (
        <div>
            <h1>Title: {props.Post.Title}</h1> <br />
            Author: {props.Post.DisplayName} <br />
            <img src={`data:image/jpeg;base64,${props.Post.Image}`} alt={props.Post.ImageName} /> <br /> {/* Display the image base64 image data as an image */}
            {props.Post.PostText} <br />

            {/* Displaying Post Likes Displayers and Mutator buttons */}
            Likes: {LikesCount} 
        </div>
    )
}

export default BlogPost;