import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import './App.css'

import NavbarTemp from "./components/NavbarTemp";

function App() {

    const [backendData, setBackendData] = useState([{}])

    // fetch data from backend api
    useEffect(() => {
        fetch("/api").then(
            response => response.json()
        ).then(
            data => {
                setBackendData(data)
            }
        )
    }, [])

    return (
        <>
            <div>
                <h1>React App</h1>
                {/* Display loading until data received */}
                {(typeof backendData.users === 'undefined') ? (
                    <p>Loading...</p>
                ) : (
                    backendData.users.map((user, index) => (
                        <p key={index}>{user}</p>
                    ))
                )}
            </div>
            <div>
                <button onclick="AddProduct()" >Add new</button>
                <input type="text" id="name" name="name" size="10" />
                <input type="url" id="url" name="url" size="10" />
            </div>
            <NavbarTemp></NavbarTemp>
        </>
    );
}

export default App;