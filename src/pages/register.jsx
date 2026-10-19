import {Link} from "react-router";
import { useState } from "react";
import axios from "axios";

function Register() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [message, setMessage] = useState("Fill information properly.");

     const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const password = form.get("password");
        const confirmedPassword = form.get("confirmedPassword");
        if (password !== confirmedPassword){
            setMessage("your confirmed password not match with password");
            e.target.elements.confirmedPassword.focus();
            return;
        }
        axios 
        .post(`${import.meta.env.VITE_API_URL}register.php`, {
            name: form.get("name"),
            username: form.get("username"),
            email: form.get("email"),
            contact: form.get("contact"),
            password: form.get("password"),
            role: form.get("role"),
        })
        .then(()=> {
            setMessage("Account created successfully. You can now sign in.");

        })
        .catch(()=> {
            setMessage("An error occurred while creating your account. Please try again.");
        })
    }

    return (
        <main>
            <div className="container">

                <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                    <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                        <div className="d-flex justify-content-center py-4">
                            <a href="index.html" className="logo d-flex align-items-center w-auto">
                            <img src="assets/img/logo.png" alt="" />
                            <span className="d-none d-lg-block">NiceAdmin</span>
                            </a>
                        </div>

                        <div className="card mb-3">

                            <div className="card-body">

                            <div className="pt-4 pb-2">
                                <h5 className="card-title text-center pb-0 fs-4">Create an Account</h5>
                                <p className="text-center small">Enter your personal details to create account</p>
                            </div>

                            <form onSubmit={handleSubmit} className="row g-3 needs-validation">
                                <input type="hidden" name="role" value="1" />

                                <div className="col-12">
                                <label htmlFor="yourName" className="form-label">Your Name</label>
                                <input type="text" name="name" className="form-control" id="yourName" required />
                                <div className="invalid-feedback">Please, enter your name!</div>
                                </div>

                                <div className="col-12">
                                <label htmlFor="yourUsername" className="form-label">Username</label>
                                <div className="input-group has-validation">
                                    <span className="input-group-text" id="inputGroupPrepend">@</span>
                                    <input type="text" name="username" className="form-control" id="yourUsername" required />
                                    <div className="invalid-feedback">Please choose a username.</div>
                                </div>
                                </div>

                                <div className="col-12">
                                <label htmlFor="yourEmail" className="form-label">Your Email</label>
                                <input type="email" name="email" className="form-control" id="yourEmail" required />
                                <div className="invalid-feedback">Please enter a valid Email adddress!</div>
                                </div>

                                <div className="col-12">
                                <label htmlFor="contact" className="form-label">Contact Number</label>
                                <input type="text" name="contact" className="form-control" id="contact" required />
                                <div className="invalid-feedback">Please enter your contact number!</div>
                                </div>

                                <div className="col-12">
                                <label htmlFor="yourPassword" className="form-label">Password</label>
                                <input type="password" name="password" className="form-control" id="yourPassword" required />
                                <div className="invalid-feedback">Please enter your password!</div>
                                </div>

                                <div className="col-12">
                                <label htmlFor="confirmedPassword" className="form-label">Confirm Password</label>
                                <input type="password" name="confirmedPassword" className="form-control" id="confirmedPassword" required />
                                <div className="invalid-feedback">Please confirm your password!</div>
                                </div>

                                <div className="col-12">
                                
                                    <p className="login-status" role="status" aria-live="polite">
                                        {message}
                                    </p>
                        
                                </div>
                                <div className="col-12">
                                <button className="btn btn-primary w-100" type="submit">Create Account</button>
                                </div>
                                <div className="col-12">
                                <p className="small mb-0">Already have an account? <Link to="/login">Log in</Link></p>
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

export default Register;