import { React, useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UpdateCategory from '../Components/UpdateCategory.js';

function UpdatePost() {
    const OGPost = useLocation().state;
    const TitleRef = useRef();
    const ImageRef = useRef();
    const PostTextRef = useRef();
    const OGCats = OGPost.Cats.filter(Cat => Cat.categoryid !== 0);

    const SelectedCatsRef = useRef(OGCats);
    const UnselectedCatsRef = useRef();
    const [UnselectedCats, setUnselectedCats] = useState();
    const [SelectedCats, setSelectedCats] = useState(SelectedCatsRef.current);

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
        const Author = OGPost.Username;

        //append form data in FormData object, FD
        const FD = new FormData();
        FD.append('Image', Image);
        FD.append('Title', Title);
        FD.append('PostText', PostText);
        FD.append('AuthorUsername', Author);
        FD.append('Categories', JSON.stringify(SelectedCatsRef.current));
        FD.append('PostID', OGPost.PostID)

        //send a POST request to backend to post the blog with data FD
        fetch('http://localhost:3001/updateblog', {
            method: 'POST',
            body: FD
        })
    }

    //gets all categories
    function GetAllCats() {

        fetch('http://localhost:3001/getallcats').then( //fetches all the categories from backend
            res => {
                return res.json()
            }
        ).then(
            response => {
                const temp = response.res.filter(Cat => Cat.categoryid !== 0) //response.res is an array of Categories, and set temp to be all categories except All with CategoryID 0
                const tempOGCatIDs = OGCats.map(Cat => Cat.categoryid) //gets a temporary array of all of the originally selected categoryIDs
                const PostCats = temp.filter(Cat => !tempOGCatIDs.includes(Cat.categoryid)) //creates a new array storing all the initially unselected categories

                UnselectedCatsRef.current = PostCats
                setUnselectedCats(PostCats) //sets the Categories state to the response
            }
        )
    }

    //function for selecting a category
    function SelectCat(CatID, CatName) {
        //updating the useRef values
        SelectedCatsRef.current.push({categoryid: CatID, category: CatName}) 
        UnselectedCatsRef.current = UnselectedCatsRef.current.filter(UnselectedCat => UnselectedCat.categoryid !== CatID)

        //setting the states so components get re-rendered
        setUnselectedCats(UnselectedCatsRef.current)
        setSelectedCats(SelectedCatsRef.current)
    }

    //function for deselecting a category
    function DeselectCat(CatID, CatName) {
        //updating the useRef values
        SelectedCatsRef.current = SelectedCatsRef.current.filter(NPostCat => NPostCat.categoryid !== CatID)
        UnselectedCatsRef.current.push({categoryid: CatID, category: CatName})

        //setting the states so components get re-rendered
        setUnselectedCats(UnselectedCatsRef.current)
        setSelectedCats(SelectedCatsRef.current)
    }

    return(
        <div>
            Update your Blog! <br />
            <form onSubmit={addpost}> {/* form calls onSubmit() method on submittion of form */}
                Post Title: <input type='text' required ref={TitleRef} placeholder={OGPost.Title}/> <br />

                {/* Displays the Selectedcategories */}
                {SelectedCats ? SelectedCats.map(Cat => {
                    return (
                        <div>
                            <UpdateCategory SelectCat={SelectCat} DeselectCat={DeselectCat} Cat={Cat} Checked={true} />
                        </div>
                    )
                }) : null}

                {/* Displays the Selectedcategories */}
                {UnselectedCats ? UnselectedCats.map(Cat => {
                    return (
                        <div>
                            <UpdateCategory SelectCat={SelectCat} DeselectCat={DeselectCat} Cat={Cat} Checked={false} />
                        </div>
                    )
                }) : null}

                <img src={`data:image/jpeg;base64,${OGPost.Image}`} alt={OGPost.ImageName} /> <br /> {/* Display the image base64 image data as an image */} <br />
                New Image: <input type='file' required ref={ImageRef} /> <br />
                <textarea required ref={PostTextRef} rows='4' cols='50' placeholder={OGPost.PostText}></textarea> <br />
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default UpdatePost;