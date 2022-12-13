import { React, useRef, useState, useEffect } from 'react';

function AddCategory(props) {
    const CategoryNameRef = useRef()

    function onSubmit(event) {
        event.preventDefault(); //prevent form from refreshing upon submit

        const CategoryName = CategoryNameRef.current.value
        const CurrUser = props.CurrUser
        const DisplayName = props.DisplayName

        fetch('http://localhost:3001/addcategory', { //Post request to add new category
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({CategoryName: CategoryName})
        }).then(
            res => {
                props.Login(CurrUser, DisplayName) //Login back to main page
            }
        )
    }
    return (
        <div>
            <h1>Add Category!</h1> <br />
            <form onSubmit={onSubmit}>
                Category Name: <input type='text' required ref={CategoryNameRef} />
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default AddCategory;