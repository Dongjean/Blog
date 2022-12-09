function Comment(props) {
    return (
        //Display the comment
        <div>
            User: {props.DisplayName} <br />
            Comment: {props.Comment} <br />
        </div>
    )
}

export default Comment;