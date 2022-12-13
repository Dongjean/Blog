import {useState, useRef} from 'react';

function UpdateCategory(props) {
    const Cat = props.Cat;

    function UpdateCateSelection(CatID, CatName) {
        if (props.Checked == true) {
            props.DeselectCat(CatID, CatName)
        } else {
            props.SelectCat(CatID, CatName)
        }
    }

    return (
        <div key={Cat.categoryid}>
            <input type='checkbox' onClick={() => UpdateCateSelection(Cat.categoryid, Cat.category)} checked={props.Checked} />
            {Cat.category}
        </div>
    )
}

export default UpdateCategory;