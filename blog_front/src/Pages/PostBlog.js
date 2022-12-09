import { React, useRef, useState } from 'react';

function PostBlog(props) {
    const TitleRef = useRef();
    const ImageRef = useRef();
    const PostTextRef = useRef();

    function addpost (event) {
        event.preventDefault(); //prevent form from refreshing upon submit

        //get form data
        const Title = TitleRef.current.value;
        const Image = ImageRef.current.files[0];
        const PostText = PostTextRef.current.value;
        const Author = props.Author;

        //append form data in FormData object, FD
        const FD = new FormData();
        FD.append('Image', Image);
        FD.append('Title', Title);
        FD.append('PostText', PostText);
        FD.append('AuthorUsername', Author);

        //send a POST request to backend to post the blog with data FD
        fetch('http://localhost:3001/postblog', {
            method: 'POST',
            body: FD
        })
    }
    return(
        <div>
            Create a Blog! <br />
            <form onSubmit={addpost}> {/* form calls onSubmit() method on submittion of form */}
                Post Title: <input type='text' required ref={TitleRef} /> <br />
                Post Image: <input type='file' required ref={ImageRef} /> <br />
                <textarea required ref={PostTextRef} rows='4' cols='50'></textarea> <br />
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default PostBlog;