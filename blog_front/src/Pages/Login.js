import { React, useRef, useState } from 'react';

function Login(props) {
    const UsernameRef = useRef();
    const PasswordRef = useRef();
    const [isValid, setState] = useState(true); //isValid is initially set to true as error message is not displayed from the start

    function onSubmit(event){
        event.preventDefault(); //prevent form from refreshing upon submit
        
        //get form data
        const Username = UsernameRef.current.value;
        const Password = PasswordRef.current.value;

        //send post request with username and password in its body to check for username validity
        fetch('http://localhost:3001/login/' + Username + '/' + Password).then(
            res => {
                return res.json()
            }
        ).then(
            response => {

                //get data about user
                const Response = response.res
                const Display = response.Display

                if (Response) { //if Reponse is not null, there is a username, thus, allow login
                    props.Login(Username, Display)
                } else{ //otherwise username is not valid, set the validity state isValid to false to re-render and display error message
                    setState(false)
                }
            }
        )

    }

    return (
        <div>
            Welcome to the Login page! <br />
            { isValid ? null : <div>Incorrect Username or Password!</div> } {/* only displays error message if isValid is false-Username/Password is invalid, displays null otherwise */}
            <form onSubmit={onSubmit}> {/* form calls method onSubmit() on submittion of the form */}
                Username: <input type='text' required ref={UsernameRef}/> <br />
                Password: <input type='text' required ref={PasswordRef}/> <br />
                <input type='submit' value='login' />
            </form>
        </div>
    )
}

export default Login;