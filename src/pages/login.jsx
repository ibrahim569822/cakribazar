import {Link} from "react-router";
import { useState } from "react";
import axios from "axios";
function LogIn() {
    const [message, setMessage] = useState("");
     const [messageType, setMessageType] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
        // You can access the form data using event.target.elements
        const form = new FormData(event.target);
        axios
            .post(`${import.meta.env.VITE_API_URL}login.php`, {
                username: form.get("username"),
                password: form.get("password")
            })
           .then((response) => {
          if (response.data.status == false) {
            setMessage("Invalid email or password.");
            setMessageType('danger')
            
          } else {
            localStorage.setItem("access_token", response.data.jwt);
            localStorage.setItem("userdata", response.data.data);
        
            window.location.href = '/';
          }
      })
            .catch(() => {

                setMessage("Invalid username or password.");
            });
    };
    return (
        <main>
            <div className="container">

                <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                    <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                        <div className="d-flex justify-content-center py-4">
                            <a href="/" className="logo d-flex align-items-center w-auto">
                            <img src="assets/img/logo.png" alt="" />
                            <span className="d-none d-lg-block">NiceAdmin</span>
                            </a>
                        </div>

                        <div className="card mb-3">

                            <div className="card-body">

                            <div className="pt-4 pb-2">
                                <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                                <p className="text-center small">Enter your username & password to login</p>
                            </div>

                            <form className="row g-3 needs-validation" novalidate onSubmit={handleSubmit}>

                                <div className="col-12">
                                <label for="yourUsername" className="form-label">Username</label>
                                <div className="input-group has-validation">
                                    <span className="input-group-text" id="inputGroupPrepend">@</span>
                                    <input type="text" name="username" className="form-control" id="yourUsername" required />
                                    <div className="invalid-feedback">Please enter your username.</div>
                                </div>
                                </div>

                                <div className="col-12">
                                <label for="yourPassword" className="form-label">Password</label>
                                <input type="password" name="password" className="form-control" id="yourPassword" required />
                                <div className="invalid-feedback">Please enter your password!</div>
                                </div>

                                <div className="col-12">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe" />
                                    <label className="form-check-label" for="rememberMe">Remember me</label>
                                </div>
                                </div>
                                <div className="col-12">
                                <button className="btn btn-primary w-100" type="submit">Login</button>
                                </div>
                                {message && (
                                    <div className="col-12">
                                        <p className="text-danger">{message}</p>
                                    </div>
                                )}
                                <div className="col-12">
                                <p className="small mb-0">Don't have account? <Link to="/register">Create an account</Link></p>
                                </div>
                            </form>

                            </div>
                        </div>

                        <div className="credits">
                            Designed by <Link to="/">Cakribazar</Link>
                        </div>

                        </div>
                    </div>
                    </div>

                </section>

            </div>
        </main>
    );
}

export default LogIn;