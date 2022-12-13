import {React, useState, useEffect, useRef} from 'react';

function Category(props) {
    const [isChecked, setChecked] = useState(false)
    const firstrender = useRef(true);

    //runs only on mount to check if the Category is All, since we want All to be initially selected
    useEffect(() => {
        if (props.Cat.categoryid == 0) {
            setChecked(true)
        }
    }, [])

    //update the categories whenever isChecked changes, making sure it doesnt run on the first render
    useEffect(() => {
        if (firstrender.current == true) {
            firstrender.current = false //update firstrender.current such that we now know that the first render had already passed
        } else {
            UpdateCat() //update categories
        }
    }, [isChecked])

    function CatClicked() {
        setChecked(!isChecked)
    }

    function UpdateCat() {
        if (isChecked) {
            props.AddCatSelection(props.Cat)
        }

        if (!isChecked) {
            props.RemoveCatSelection(props.Cat)
        }
    }

    return (
        <div>
            <input type='checkbox' onClick={CatClicked} checked={isChecked} readOnly/> {/* made checkbox readonly for this method as we re-render each time it is clicked */}
            {props.Cat.category}
        </div>
    )

}

export default Category;