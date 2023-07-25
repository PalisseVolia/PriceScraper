import React from 'react'
import { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import NavbarTemp from '../components/NavbarTemp'

function LoginPage() {

    const [user, setUser] = useState({})

    function handleCallbackResponse(response) {
        console.log(response.credential)
        var userObject = jwt_decode(response.credential)
        console.log(userObject)
        setUser(userObject)
    }

    useEffect(() => {
        /* global google */
        const google = window.google
        google.accounts.id.initialize({
            client_id: "398400370314-dbnhr4bm5v9che8j1lpm1kflcd8ioopd.apps.googleusercontent.com",
            callback: handleCallbackResponse,
        })

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "filled_blue", size: "large", shape: "rectangular", text: "signIn" },
        )
    }, [])

    return (
        <>
            <div id='LoginContainer'>
                <div id='signInDiv'></div>
                {user &&
                    <div>
                        <img src={user.picture} alt="" />
                        <p>{user.name}</p>
                    </div>
                }
            </div>
            <div>TEST</div>
            <NavbarTemp></NavbarTemp>
        </>
    )
}

export default LoginPage