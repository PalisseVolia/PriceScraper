import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import './App.css'

function App() {

    const [backendData, setBackendData] = useState([{}])

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
        </>
    );
}

export default App;