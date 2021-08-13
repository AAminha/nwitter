// 본격 트윗 올리기
// 홈에서 하는 일은 데이터베이스의 스냅샷을 얻어오는 것.

import Nweet from "components/Nweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
    // 이번 + 기존 nweet 내용을 저장하는 state
    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        // onSnapShot : 기본적으로 데이터베이스에서 어떤 무언가를 하게 되면 알 수 있도록 해줌.
        dbService
        .collection("nweets")
        .onSnapshot(snapshot => {
            // 새로운 snapshot을 받을 때 배열을 만듦.
            const nweetArray = snapshot.docs.map((doc) => ({
                id : doc.id,
                ...doc.data(),
            }));    // 모든 배열의 아이템들이 이렇게 생김.
            setNweets(nweetArray);  // state에 배열을 집어 넣음.
        });
    }, []);
    
    
    return (
        <div className="container">
            <NweetFactory userObj = {userObj} />
            <div style={{ marginTop: 30 }}>
                {nweets.map((nweet) => (
                    <Nweet
                        key = {nweet.id}
                        nweetObj = {nweet}  // nweeObj는 nweet의 모든 데이터
                        isOwner = {nweet.creatorId === userObj.uid}
                    />  // (nweet을 만들 사람 == userObj.uid면 true)
                ))}
            </div>
        </div>
    );
};

export default Home;