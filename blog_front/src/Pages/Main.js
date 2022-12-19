//Components imports
import BlogPost from '../Components/BlogPost.js'
import Category from '../Components/Category.js';

import {React, useState, useEffect, useRef} from 'react';

function Main(props) {
    const [Posts, setPosts] = useState(null)
    const [Cats, setCats] = useState(null)
    const nullCat = {categoryid: -1, category: 'null'}
    const SelectedCats = useRef([nullCat])

    const CurrUser = props.CurrUser;

    //runs only on mount
    useEffect( () => {
        GetAllCats()
    }, [])

    async function GetBlogs(Cats) {
        const StrCats = Cats.map(Cat => {return Cat.categoryid}).toString() //converts the array of Categories into a string format to be sent in GET request

        fetch('/getblogs/' + StrCats).then( //fetches the blog posts under the requested categories from backend
            res => {
                return res.json()
            }
        ).then(
            response => {
                const Posts = response.res //response is an array of Posts if blog posts exists, and null otherwise
                setPosts(Posts) //sets the Posts state to the response
            }
        )
    }

    function OpenBlog(Post) {
        props.OpenBlog(Post)
    }

    function GetAllCats() {
        fetch('/getallcats').then( //fetches all the categories from backend
            res => {
                return res.json()
            }
        ).then(
            response => {
                const AllCats = response.res //response is an array of Categories
                setCats(AllCats) //sets the Categories state to the response
            }
        )
    }

    function AddCatSelection(Cat) {
        SelectedCats.current = SelectedCats.current.filter(SelectedCat => SelectedCat.categoryid !== -1) //removes null category from SelectedCats.current
        SelectedCats.current.push(Cat) //adds Category Cat to SelectedCats.current
        GetBlogs(SelectedCats.current) //get all the blogs for all categories after the selected categories have been modified
    }

    function RemoveCatSelection(Cat) {
        SelectedCats.current = SelectedCats.current.filter(SelectedCat => SelectedCat.categoryid !== Cat.categoryid) //removes Category Cat from SelectdCats.current

        //if after removal SelectedCats.current is empty, add the nullCat
        if (SelectedCats.current.length == 0) {
            SelectedCats.current.push(nullCat)
        }
        GetBlogs(SelectedCats.current) //get all the blogs for all categories after the selected categories have been modified
    }

    return (
        <div>
            {/* Displays All Categories if it is not null */}
            {Cats ? Cats.map(Cat => {
                return (
                    <Category key={Cat.categoryid} Cat={Cat} AddCatSelection={AddCatSelection} RemoveCatSelection={RemoveCatSelection} />
                )
            }) : null}
            
            {Posts ? Posts.map(Post => { {/* iterate through the Posts array if Posts is not null, and each post is Post */}
                return (
                    <div key={Post.PostID}>
                        <button onClick={() => OpenBlog(Post)}> {/* Call the OpenBlog method with parameter Post */}
                            <BlogPost Post={Post} CurrUser={CurrUser} /> {/* Display the specific Blog Post, passing in information of Post as a prop Post */}
                        </button>
                        <br />
                    </div>
                )
            }) : <div>There are no posts yet :(</div> } {/* If Posts is null-if there are no Posts */}
        </div>
    )
}

export default Main;