import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/context";
import { API } from "../api";
import "../styles/registration.css"

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const userContext = useContext(UserContext);
    if (!userContext) {
        return <>Context not present</>;
    }

    const { setUser } = userContext;
    
    const handleLogin = async () => {
        try {
            const response = await fetch(`${API}/users/${username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });
            if (response.ok) {
                const result = await response.json();
                setUser(result)
                alert('Login successful!');
                navigate("/dashboard");
            } else {
                alert(`Error occured while logging in`);
            }
        } catch (e) {
            alert("Error occured while fetching user details");
        }
    };

    return (
        <div className="container">
            <h1 className="heading">
                Welcome to FinGrow
            </h1>
            <h2 className="login-heading">Login</h2>
            <div className="form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="button"
                    onClick={() => handleLogin()}
                >
                    Submit
                </button>
            </div>
            <h5>
                Don't have an account?{" "}
                <span
                    onClick={() => {
                        navigate("/register");
                    }}
                    className="spanContent"
                >
                    Register
                </span>
            </h5>
        </div>
    );
};

export default LoginPage;