
function BlogPost(props) {
    return (
        <div>
            <h1>Title: {props.Post.Title}</h1> <br />
            Author: {props.Post.Username} <br />
            <img src={`data:image/jpeg;base64,${props.Post.Image}`} alt={props.Post.ImageName} /> <br /> {/* Display the image base64 image data as an image */}
            {props.Post.PostText} <br />
        </div>
    )
}

export default BlogPost;