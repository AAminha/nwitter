import { authService } from "fbase";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default ({ refreshUser, userObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
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
            refreshUser();
        }
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