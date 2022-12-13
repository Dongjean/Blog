//Components imports
import LikesSection from './LikesSection';

import React from 'react';

function BlogPost(props) {
    const PostID = props.Post.PostID;
    const CurrUser = props.CurrUser;

    return (
        <div>
            <h1>Title: {props.Post.Title}</h1> <br />
            Author: {props.Post.DisplayName} <br />
            <img src={`data:image/jpeg;base64,${props.Post.Image}`} alt={props.Post.ImageName} /> <br /> {/* Display the image base64 image data as an image */}
            {props.Post.PostText} <br />

            {/* Displaying Post's Likes and buttons to like and unlike */}
            <LikesSection CurrUser={CurrUser} PostID={PostID} />
        </div>
    )
}

export default BlogPost;