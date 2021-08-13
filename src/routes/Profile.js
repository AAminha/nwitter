import { authService } from "fbase";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default ({ refreshUser, userObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const history = useHistory();
    // Authentication (사용자 계정 인증) 부분을 끝내고 싶기 때문에
    // auth service가 필요. onClick도 필요
    const onLogOutClick = () => {
        authService.signOut();
    // 지금 이 상태는 Profile에서 Log out을 클릭하면 로그아웃은 되지만
    // 여전히 url은 profile에 머무는 상황 (home으로 돌아가야 함.)
    // 즉, 우리는 redirect가 필요 -> react router dom으로 가보자.
        history.push("/");
    };
/*     const getMyNweets = async() => {
        // 해당 유저의 nweet 가져오기
        // where : 우리에게 필터링하는 방법을 알려줌
        const nweets = await dbService
            .collection("nweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt")
            .get();
        console.log(nweets.docs.map(doc => doc.data()));
    };
    useEffect(() => {
        getMyNweets();
    }, []); */
    const onChange = (event) => {
        const {
            target : { value },
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName : newDisplayName,
            });
            refreshUser();      // react.js에 있는 profile 새로고침
        }                       // 이론적으로는 refreshUser가 setUserObj도 실행 시켰을 것.
    };
    return (
        <div className="container">
            <form className="profileForm" onSubmit = {onSubmit}>
                <input
                    className="profile__formInput"
                    onChange = {onChange}
                    type = "text"
                    autoFocus
                    placeholder = "Display name"
                    value = {newDisplayName}
                />
                <input
                    className="formBtn"
                    type="submit"
                    value="Update Profile"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
}