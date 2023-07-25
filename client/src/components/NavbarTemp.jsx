import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

function NavbarTemp() {
    return (
        <div className="NavbarTemp">
            <Link to="/">Home</Link>
            <Link to="/Login">Login</Link>
        </div>
    )
}

export default NavbarTemp