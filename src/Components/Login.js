import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {

    let history = useNavigate();

    const [cred, setCred] = useState({
        email: "",
        password: ""
    })

    const handleClick = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email: cred.email, password: cred.password })
        })
        const json = await response.json();
        console.log(json)

        if (json.success) {
            localStorage.setItem('token', json.authToken);
            props.showAlert("Logged in successfully", "success")
            history("/")
        }
        else {
            props.showAlert("Invalid details", "danger")
        }
    }

    const onChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value })
    }

    return (
        <div className="container">
            <h2>Login to use iNotebook</h2>
            <form onSubmit={handleClick}>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" value={cred.email} onChange={onChange} aria-describedby="emailHelp" placeholder="Enter email" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" value={cred.password} onChange={onChange} name="password" placeholder="Password" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login