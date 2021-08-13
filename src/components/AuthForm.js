import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [newAccount, setNewAccount] = useState("false");
    const onChange = (event) => {
        const {
            target : { name, value },
        } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }                           
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        try {     
            let data;
            if (newAccount) {
                data = await authService.createUserWithEmailAndPassword(
                    email,
                    password
                );
            } else {
                data = await authService.signInWithEmailAndPassword(
                    email,
                    password
                );
            }
            console.log(data);
        } catch (error) {
            setError(error.message);
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);
    return (
        <>
            <form className = "container" onSubmit = {onSubmit}>
                <input
                    className = "authInput"
                    name="email"
                    type="email"
                    placeholder="Email"
                    requried
                    value={email}
                    onChange={onChange}
                />
                <input
                    className = "authInput"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                />
                <input
                    className = "authInput authSubmit"
                    type = "submit"
                    value = {newAccount ? "Create Account" : "Log In"}
                />
                <span className = "authError">
                    {error}
                </span>
            </form>
            <span className = "authSwitch" onClick = {toggleAccount}>
                {newAccount ? "Log In" : "Create Account" }
            </span>
        </>
    );
};

export default AuthForm;