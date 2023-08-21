import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {

    let history = useNavigate();

    const [cred, setCred] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: ""
    })

    const handleClick = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ name: cred.name, email: cred.email, password: cred.password })
        })
        const json = await response.json();
        console.log(json)

        if (json.success) {
            localStorage.setItem('token', json.authToken);
            history("/")
            props.showAlert("Account created successfully", "success")
        }
        else {
            props.showAlert("Invalid credentials", "danger")
        }
    }

    const onChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value })
    }

    return (
        <div className="container">
            <h2>Create an account to use iNotebook</h2>
            <form onSubmit={handleClick}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={cred.name} onChange={onChange} placeholder="Enter name" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" value={cred.email} onChange={onChange} aria-describedby="emailHelp" placeholder="Enter email" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" value={cred.password} onChange={onChange} name="password" placeholder="Password" required minLength={5} />
                </div>
                <div className="form-group">
                    <label htmlFor="cpassword">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" value={cred.cpassword} onChange={onChange} placeholder="Confirm password" required minLength={5} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup