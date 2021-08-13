import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
// 이 component가 nweets 생성을 담당하는 것.

const NweetFactory = ({ userObj }) => {
    // 이번에 올릴 nweet 내용을 저장하는 state
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        event.preventDefault();                       // 여기서 해야할 것은 submit할때마다 document 생성

        if (nweet === "") {
            return;
        }

        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = storageService
                .ref()
                .child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment,"data_url")
            attachmentUrl = (await response.ref.getDownloadURL());
        }
        const nweetObj = {
            text : nweet,                             // 여기서 nweet은 state의 nweet
            createdAt : Date.now(),
            creatorId : userObj.uid,                  // 우리는 nweet을 만들고 있는데, nweet이 createId를 가지게 됨. = 사용자 고유 ID
            attachmentUrl
        };
        await dbService.collection("nweets").add(nweetObj);
        setNweet("");   // submit를 하고 나면 setNweet를 통해서 입력창을 비워주는 것.
        setAttachment("");
    };
    const onChange = (event) => {
        const {
            target : {value}
        } = event;
        setNweet(value);
    };
    const onFileChange = (event) => {   // event listener 역할
        const {
            target : { files },
        } = event;      // event 안에서 target 안으로 가서 파일을 받아 오는 것을 의미
        const theFile = files[0];           // 파일을 가지고 (여러개 파일을 받을 수 있지만 input은 한 개만 받기 때문)
        const reader = new FileReader();    // reader를 만든 다음
        reader.onloadend = (finishedEvent) => { // readeAsDataURL에서 파일을 읽은 다음 여기서 finishedEvent로 받음.
            const {
                currentTarget : { result }
            } = finishedEvent;      // finishedEvent의 result를 setAttachment로 설정
            setAttachment(result);
        };
        if (Boolean(theFile)) {
            reader.readAsDataURL(theFile);  // readAsDataURL을 사용해서 파일을 읽는 것.
        }
    };

    const onClearAttachment = () => setAttachment(null);
    return (
        <form className="factoryForm" onSubmit={onSubmit}>
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input className="factoryInput__plus" type="submit" value="+" />
            </div>
            <label className="factoryInput__label" for="attach-file">
              <span>Add photos</span>
              <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src = {attachment}
                        style={{
                            backgroundImage: attachment,
                          }}
                        />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
};

export default NweetFactory;