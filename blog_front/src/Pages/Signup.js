import { React, useRef, useState } from 'react';

function Signup(props) {
    const NUserRef = useRef();
    const NPWRef = useRef();
    const NPW2Ref = useRef();
    const NDisplayRef = useRef();

    const [isPWValid, setPWState] = useState(true);
    const [isUserValid, setUserState] = useState(true);

    function onSubmit(event) {
        event.preventDefault(); //prevent form from refreshing upon submit

        //get form data
        const NUser = NUserRef.current.value
        const NPW = NPWRef.current.value
        const NPW2 = NPW2Ref.current.value
        const NDisplay = NDisplayRef.current.value

        //validity check for PW
        if (NPW !== NPW2) {
            setPWState(false) //set the state of isPWValid to false such that error message is displayed after re-render
        } else {
            if (!isPWValid) {
                setPWState(true) //set the state of isPWValid to true such that page is re-rendered to update the error information accordingly
            }
        }

        //validity check for Username
        fetch('http://localhost:3001/signup', { //send POST request to the backend with the new account credentials to check if the username already exists, and adds the account to DB if it is
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({NUsername: NUser, NPassword: NPW, NDisplay: NDisplay, isPWValid: isPWValid})
        }).then(
            res => {
                return res.json()
            }
        ).then(
            response => {
                const Response = response.res
                if (Response) { //if Reponse is not null, username is valid
                    if (isPWValid) { //check if the password inputted is valid, if it is,
                        props.Login(NUser, NDisplay) //login to the newly-created account
                    } else {
                        setUserState(true) //if password is not valid, just set the isUserValid to true state such that page is re-rendered to update the error information accordingly
                    }
                } else {
                    setUserState(false) //if reponse is null, username is invalid, thus set the isUserValid state to false such that page is re-rendered to update the error information accordingly
                }
            }
        )
    }

    return (
        <div>
            Welcome to the Signup page! <br />
            { isUserValid ? null : <div>The Username is unavailable!</div> } {/* displays only if isUserValid is false-Username is invalid, otherwise displays null */}
            { isPWValid ? null : <div>The Passwords do not match!</div> } {/* displays only if isPWValid is false-Password is invalid, otherwise displays null */}
            <form onSubmit={onSubmit}> {/* form calls method obSubmit() on submittion of form */}
                New Username: <input type='text' required ref={NUserRef} /> <br />
                New Password: <input type='text' required ref={NPWRef} /> <br />
                Confirm Password: <input type='text' required ref={NPW2Ref} /> <br />
                Display Name: <input type='text' required ref={NDisplayRef} /> <br />
                <input type='submit' value='signup' />
            </form>
        </div>
    )
}

export default Signup;