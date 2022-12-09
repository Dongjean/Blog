import {useLocation} from 'react-router-dom';

function OpenBlog() {
    const Data = useLocation().state; //get data about Post from App.js

    return (
        <div> {/* diplaying the blog post itself first */}
            <h1>Title: {Data.Title}</h1> <br />
            Author: {Data.DisplayName} <br /><br />
            <img src={`data:image/jpeg;base64,${Data.Image}`} alt={Data.ImageName} /> <br /> {/* Display the image base64 image data as an image */}
            {Data.PostText} <br />
        </div>
    )
}

export default OpenBlog;