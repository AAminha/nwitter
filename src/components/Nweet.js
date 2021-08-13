import React, { useState } from "react";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fbase";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);              // edit 모드인지 아닌지
    const [newNweet, setnewNweet] = useState(nweetObj.text);    // input에 입력된 text 업데이트
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            // documentPath는 nweet안에 있어.
            await storageService.refFromURL(nweetObj.attachmentUrl).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text : newNweet         // newNweet은 input에 있는 text
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {
            target : { value },
        } = event;
        setnewNweet(value);
    };
    return (
        <div className = "nweet">
            {editing ? (
                <>
                    {isOwner && (
                        <>
                            <form className = "container nweetEdit" onSubmit = {onSubmit}>
                                <input
                                    className = "nweet__formInput"
                                    type = "text"
                                    placeholder = "Edit your nweet"
                                    value = {newNweet}
                                    required
                                    onChange = {onChange}
                                />
                                <input className = "formBtn" type = "submit" value = "Update Nweet" />
                            </form>
                            <span className = "formBtn cancelBtn" onClick = {toggleEditing}>
                                Cancel
                            </span>
                        </>
                    )}
                </>
            ) : (
                <>
                    <h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && <img src = {nweetObj.attachmentUrl} />}
                    {isOwner && (
                        <div class="nweet__actions">
                        <span onClick={toggleEditing}>
                          <FontAwesomeIcon icon={faPencilAlt} color="#499fe6"/>
                        </span>
                        <span onClick={onDeleteClick}>
                          <FontAwesomeIcon icon={faTrash} color="#e65b49" />
                        </span>
                      </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Nweet;