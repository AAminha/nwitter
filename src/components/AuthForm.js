import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
    const [password, setPassword] = useState("");           // password를 저장할 예정
    const [error, setError] = useState("");                 // error 메세지 저장
    const [email, setEmail] = useState("");                 // mail 주소 저장할 예정
    const [newAccount, setNewAccount] = useState("false");  // 새로운 계정인 경우 : true / 기존 계정인 경우 : false
    const onChange = (event) => {
        const {
            target : { name, value },
        } = event;             // target 안에는 name과 value가 들어있다.
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);                             // input이 바뀌는 순간마다 state도 바뀌면서 저장.
        }                           
    };
    const onSubmit = async(event) => {                      // form을 submit하는 순간에 그 event를 가져다가
        event.preventDefault();                             // preventDefault를 시킴. (안하면 제출하는 순간 그냥 새로고침 되어버림)
        try {     
            let data;
            if (newAccount) {                               // 새로운 계정이면 계정 생성
                data = await authService.createUserWithEmailAndPassword(
                    email,
                    password
                );
            } else {                                        // 기존에 있는 계정이면 로그인 진행
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
                    // 내가 input을 변경할 때마다 onChange function 호출 (키 하나하나 누를 때마다)
                    // onChange 함수는 내가 input에 입력한 값들을 토대로 저장시킴
                    // 즉 input에는 무언가가 추가되는 것이 아니라 무언가가 추가되는 value를 받아오는 것 뿐.
                    // 내가 value = "email"로 정해버리면, 뭐라고 타이핑을 하던 무조건 email이 되어버림.
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