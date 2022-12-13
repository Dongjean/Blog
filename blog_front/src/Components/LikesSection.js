import { React, useState, useEffect } from 'react';

function LikesSection(props) {
    const CurrUser = props.CurrUser;
    const PostID = props.PostID;
    const [LikesCount, setLikesCount] = useState(0);
    const [isLiked, setLikedState] = useState(false);

    //this runs only once on mount
    useEffect(() => {
        GetLikesCount(); //get number of likes no matter what
        if (CurrUser) {
            GetLikeState(); //only run if user is logged in
        }
    }, [])

    //method to get the number of likes for the post
    function GetLikesCount() {
        //send a GET request to /getlikes with PostID as a parameter
        fetch('http://localhost:3001/getlikescount/' + PostID).then(
            res => res.json()
        ).then(
            response => {
                const LikesCount = response.res
                setLikesCount(LikesCount) //update the information stored in the LikesCount State
            }
        )
    }

    function Like(event) {
        event.stopPropagation() //prevents the onClick of the button in the parent class from interfering with this like/unlike button
        fetch('http://localhost:3001/addlike', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({PostID: PostID, CurrUser: CurrUser})
        }).then(
            res => {
            GetLikesCount()
            } //update the likes count shown only after the post request is successful
        )
        setLikedState(true) //post is now liked
    }

    function Unlike(event) {
        event.stopPropagation() //prevents the onClick of the button in the parent class from interfering with this like/unlike button
        fetch('http://localhost:3001/removelike', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({PostID: PostID, CurrUser: CurrUser})
        }).then(
            res => {
            GetLikesCount()
            } //update the likes count shown only after the post request is successful
        )
        setLikedState(false) //post is now unliked
    }

    //function called to get the state of whether or not the post is liked by user
    function GetLikeState() {
        fetch('http://localhost:3001/getlikestate/' + PostID + '/' + CurrUser).then(
            res => res.json()
        ).then(
            response => {
                setLikedState(response.res)
            }
        )
    }


    return (
        <div>
            {/* Displays the number of likes of the post no matter what */}
            Likes: {LikesCount} <br />

            {/* Only Display the option to like or unlike if loggedin-if CurrUser is not null */}
            {CurrUser ?

            //If client is logged in, then show Like button if post is not liked, and vice versa 
            (isLiked ? 
                <div>
                    <div onClick={Unlike}>Unlike!</div> <br />
                </div>: 
                <div>
                    <div onClick={Like}>Like!</div> <br />
                </div>
            ) : null}
        </div>
    )
}

export default LikesSection;