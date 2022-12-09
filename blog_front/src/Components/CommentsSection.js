import Comment from './Comment.js';

function CommentsSection(props) {
    return (
        <div>
            <h1>Comments Section: </h1>
            {(props.Comments[0] ? props.Comments.map(CommentData => { //iterates through the Comments prop, getting the CommentData of every comment consisting of its comment and commentor displayname
                return <div key={CommentData.commentid}> <Comment DisplayName={CommentData.displayname} Comment={CommentData.comment} /> <br /> </div> //renders a Comment component for each CommentData
            }) : <div> sorry, but there are no comments </div>)} {/* if the Comments prop does have at least 1 entry, display a sorry, no comments message */}
        </div>
    )
}

export default CommentsSection;