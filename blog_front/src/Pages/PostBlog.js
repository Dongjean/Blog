import { React, useRef, useState, useEffect } from 'react';

function PostBlog(props) {
    const TitleRef = useRef();
    const ImageRef = useRef();
    const PostTextRef = useRef();
    const [Cats, setCats] = useState(null)
    const PostCats = useRef([]);

    //runs only on mount
    useEffect(() => {
        GetAllCats()
    }, [])

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
        FD.append('Categories', PostCats.current);

        //send a POST request to backend to post the blog with data FD
        fetch('http://localhost:3001/postblog', {
            method: 'POST',
            body: FD
        })
    }

    function GetAllCats() {
        fetch('http://localhost:3001/getallcats').then( //fetches all the categories from backend
            res => {
                return res.json()
            }
        ).then(
            response => {
                const PostCats = response.res.filter(Cat => Cat.categoryid !== 0) //response is an array of Categories, and set PostCats to be all categories except All with CategoryID 0
                
                setCats(PostCats) //sets the Categories state to the response
            }
        )
    }

    function AddCat(CatID) {
        PostCats.current.push(CatID)
    }

    return(
        <div>
            Create a Blog! <br />
            <form onSubmit={addpost}> {/* form calls onSubmit() method on submittion of form */}
                Post Title: <input type='text' required ref={TitleRef} /> <br />
                {/* Displays the categories once it is fetched */}
                Categories: {Cats ? Cats.map(Cat => {
                    return (
                        <div key={Cat.categoryid}>
                            <input type='checkbox' onClick={() => AddCat(Cat.categoryid)} readOnly/> {/* Checkbox for category, made checkbox readonly for this method as we re-render each time it is clicked */}
                            {Cat.category}
                        </div>
                    )
                }) : null} <br /> {/* If Cats has been fetched, display the category selection option */}
                Post Image: <input type='file' required ref={ImageRef} /> <br />
                <textarea required ref={PostTextRef} rows='4' cols='50'></textarea> <br />
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default PostBlog;