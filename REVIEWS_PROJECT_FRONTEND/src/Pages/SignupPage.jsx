import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import '../css/SignupPage.css';
// import NavBar from '../Components/NavBar.jsx';
import image1 from '../assets/SignupPageImage.avif';
import Navbar from '../Components/Navbar';

function SignupPage() {
    // const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [Data, SetData] = useState({
        name: "",
        password: "",
        email: "",
        address: "",
        role: "Normal User",
        storeName: ""
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleData = (e) => {
        const { name, value } = e.target;
        SetData({ ...Data, [name]: value });
    };

async function submitData(Data) {
        try {
            let url = "https://reviews-app-backend-023o.onrender.com/api/users/register";
            if (Data.role === "Store Owner") {
                url = "https://reviews-app-backend-023o.onrender.com/api/storeOwnerAuth/registerWithStore";
            }
            const response = await axios.post(url, Data);
            console.log("Signup successful", response.data);
            setSuccessMessage("User  registered successfully! Please login to the account"); // Set success message
            setErrorMessage(""); // Clear any previous error messages
            SetData({ name: "", password: "", email: "", address: "", role: "Normal User", storeName: "" }); // Clear form fields
        } catch (error) {
            console.log("Error:", error);
            if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors.map(e => `${e.param}: ${e.msg}`).join(', ');
                setErrorMessage(`Validation errors: ${validationErrors}`);
            } else if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("An error occurred during registration.");
            }
            setSuccessMessage(""); // Clear any previous success messages
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm(Data);
        console.log(newErrors);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log("Data is valid");
            submitData(Data);
            console.log(Data)
        }
    };

    const validateForm = (Data) => {
        const errors = {};
        if (!Data.name || Data.name.trim() === "") {
            errors.name = "Name should not be empty";
        } else if (Data.name.trim().length < 8) {
            errors.name = "Name should be minimum 8 characters length";
        }
        if (!Data.password || Data.password.trim() === "") {
            errors.password = "Password should not be empty";
        } else if (Data.password.trim().length < 8) {
            errors.password = "Password should be minimum 8 characters length";
        } else if (!/[A-Z]/.test(Data.password)) {
            errors.password = "Password should contain at least one uppercase letter";
        } else if (!/[^A-Za-z0-9]/.test(Data.password)) {
            errors.password = "Password should contain at least one special character";
        }
        if (!Data.email || Data.email.trim() === "") {
            errors.email = "Email should not be empty";
        }
        if (!Data.address || Data.address.trim() === "") {
            errors.address = "Address should not be empty";
        }
        if (Data.role === "Store Owner") {
            if (!Data.storeName || Data.storeName.trim() === "") {
                errors.storeName = "Store name should not be empty";
            } else if (Data.storeName.trim().length < 20) {
                errors.storeName = "Store name should be minimum 20 characters length";
            }
        }
        return errors;
    };

    return (
        <>  
            <Navbar/>
            {/* Main */}
            <main className="main-container signup-container">
                {/* Left Side: Form */}
                <div className="form-section">
                    <h1 className="form-title">Register here</h1>
                    <p className="form-subtitle">Post your review today</p>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={Data.name}
                                onChange={handleData}
                                className="input-field"
                            />
                            {errors.name && (
                                <span className='error-message'>
                                    {errors.name}
                                </span>
                            )}
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="xyz@gmail.com"
                                className="input-field"
                                value={Data.email}
                                onChange={handleData}
                            />
                            {errors.email && (
                                <span className='error-message'>
                                    {errors.email}
                                </span>
                            )}
                        </div>
                        <div>
                            <input
                                type="text"
                                name="address"
                                placeholder="type your address"
                                className="input-field"
                                value={Data.address}
                                onChange={handleData}
                            />
                            {errors.address && (
                                <span className='error-message'>
                                    {errors.address}
                                </span>
                            )}
                        </div>
                        <div>
                            <input
                                type="password" // Changed to password type for security
                                name="password"
                                placeholder="Enter your password"
                                className="input-field"
                                value={Data.password}
                                onChange={handleData}
                            />
                            {errors.password && (
                                <span className='error-message'>
                                    {errors.password}
                                </span>
                            )}
                        </div>
                        <div>
                        </div>
                        <div>
                            <label htmlFor="role">Register as:</label>
                    <select
                        id="role"
                        name="role"
                        value={Data.role}
                        onChange={handleData}
                        className="input-field2"
                    >
                        <option value="Normal User">Normal User</option>
                        {/* <option value="System Administrator">System Administrator</option> */}
                        <option value="Store Owner">Store Owner</option>
                    </select>
                    {Data.role === "Store Owner" && (
                        <div>
                            <input
                                type="text"
                                name="storeName"
                                placeholder="Enter your store name"
                                value={Data.storeName}
                                onChange={handleData}
                                className="input-field"
                            />
                            {errors.storeName && (
                                <span className='error-message'>
                                    {errors.storeName}
                                </span>
                            )}
                        </div>
                    )}
                        </div>
                        <button
                            type="submit"
                            className="submit-btn" style={{ backgroundColor: "#facc24" }}
                        >
                            Create Account
                        </button>
                    </form>
                    {successMessage && <p className='success-message'>{successMessage}</p>}
                    {errorMessage && <p className='error-message'>{errorMessage}</p>}
                </div>

                {/* Right Side Image */}
                <div className="image-section">
                    <img
                        src = {image1}
                        alt="image"
                        className="signup-image"
                    />
                </div>
            </main>
        </>
    );
}

export default SignupPage;
