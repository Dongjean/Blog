import React from 'react';

function UpdateCategory(props) {
    const Cat = props.Cat;

    function UpdateCateSelection(CatID, CatName) {
        if (props.Checked == true) {
            props.DeselectCat(CatID, CatName) //if Category was previously selected, it is now to be deselected
        } else {
            props.SelectCat(CatID, CatName) //if Category was previously not selected, it is now to be selected
        }
    }

    return (
        <div key={Cat.categoryid}>
            <input type='checkbox' onClick={() => UpdateCateSelection(Cat.categoryid, Cat.category)} checked={props.Checked} readOnly/> {/* made checkbox readonly for this method as we re-render each time it is clicked */}
            {Cat.category}
        </div>
    )
}

export default UpdateCategory;