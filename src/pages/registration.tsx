import React, { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/registration.css";

const RegistrationPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [totalIncome, setTotalIncome] = useState<string | number>("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const balance = totalIncome;
        try {
            const response = await fetch(`${API}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    totalIncome: totalIncome,
                    balance,
                }),
            });
            if (response.ok) {
                alert("User created succesfully");
                navigate('/dashboard');
            } else {
                alert("Error creating user");
            }
        } catch (e: any) {
            return `Error creaating User: ${e.message}`;
        }
    }

    return (
        <div className="container">
            <h1 className="heading">
                Welcome to FinGrow
            </h1>
            <h2 className="register-heading">Register</h2>
            <div className="form">

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Enter Income"
                    value={totalIncome}
                    onChange={(e) => setTotalIncome(e.target.value)}
                />
                <button
                    type="submit"
                    className="button"
                    onClick={() => {
                        handleSubmit();
                    }}
                >
                    Submit
                </button>

            </div>
            <h5>
                Already have an account?{" "}
                <span
                    onClick={() => {
                        navigate('/');
                    }}
                    className="spanContent"
                >
                    Login
                </span>
            </h5>
        </div>
    )
}

export default RegistrationPage