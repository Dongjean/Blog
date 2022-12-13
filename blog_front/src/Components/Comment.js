import React from 'react';

function Comment(props) {
    const isViewerAuthor = (props.CurrUser == props.CommentData.username); //isViewerAuthor is true if Data.CurrUser = Data.Username, AKA the viewer is the author of the post

    //function called to delete comment
    async function DeleteComment() {
        props.DeleteComment(props.CommentData.commentid) //passes on the data for deleting the comment to CommentsSection.js
    }

    return (
        //Display the comment
        <div>
            User: {props.CommentData.displayname} <br />
            Comment: {props.CommentData.comment} <br />

            {/* Delete Comment button that shows only if the logged in user is the person who made the comment */}
            {isViewerAuthor ? 
            <div>
                <button onClick={DeleteComment}>Delete Comment</button> <br />
            </div> : null}
        </div>
    )
}

export default Comment;