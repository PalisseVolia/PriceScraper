import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import LoginPage from './pages/LoginPage.jsx'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
    Route,
} from "react-router-dom"

const Router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "Login",
        element: <LoginPage />,
    },
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={Router} />
    </React.StrictMode>,
)
