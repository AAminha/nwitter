import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";

// 로그인 여부 전달 (true : 로그인 상태 / false : 로그아웃 상태)
const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
    return (
        // 로그인 상태라면 기본 페이지는 Home. Home과 Profile로 들어가는 네비게이션 보여줌.
        // 로그아웃 상태라면 기본 페이지는 로그인 페이지.
        <Router>
            {isLoggedIn && <Navigation userObj = {userObj} />}
            <Switch>
                {isLoggedIn ? (
                    <div
                        style={{
                        maxWidth: 890,
                        width: "100%",
                        margin: "0 auto",
                        marginTop: 80,
                        display: "flex",
                        justifyContent: "center",
                        }}
                    >
                        <Route exact path = "/">
                            <Home userObj = {userObj} />
                        </Route>
                        <Route exact path = "/profile">
                            <Profile userObj = {userObj} refreshUser={refreshUser} />
                        </Route>
                    </div>
                ) : (
                    <>
                        <Route exact path = "/">
                            <Auth />
                        </Route>
                    </>
                )}
            </Switch>
        </Router>
    )
};

export default AppRouter;