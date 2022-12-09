import Comment from './Comment.js';
import { React, useRef } from 'react';

function CommentsSection(props) {
    const NewCommentRef = useRef();

    function AddComment(event) {
        event.preventDefault(); //prevent form from refreshing upon submit

        const NewComment = NewCommentRef.current.value; //get New comment from the form

        //POST request to /addcomment with information on the new comment in its body to be added into DB
        fetch('http://localhost:3001/addcomment', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({PostID: props.PostID, NewComment: NewComment, Username: props.CurrUser})
        })
    }
    return (
        <div>
            {/* Form to add a new Comment is only shown if user is logged in */}
            {props.CurrUser ?
                <form onSubmit={AddComment}>
                    <textarea required ref={NewCommentRef} rows='4' cols='50'></textarea><input type='submit' value='Comment!' />
                </form> : null
            }

            {/* The rest of the comments section */}
            <h1>Comments Section: </h1>
            {(props.Comments[0] ? props.Comments.map(CommentData => { //iterates through the Comments prop, getting the CommentData of every comment consisting of its comment and commentor displayname
                return <div key={CommentData.commentid}> <Comment DisplayName={CommentData.displayname} Comment={CommentData.comment} /> <br /> </div> //renders a Comment component for each CommentData
            }) : <div> sorry, but there are no comments </div>)} {/* if the Comments prop does have at least 1 entry, display a sorry, no comments message */}
        </div>
    )
}

export default CommentsSection;