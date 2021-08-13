import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  // init -> 초기화 완료 : ture / 초기화 미완료 : false
  const [init, setInit] = useState(false);
  // userObj -> 사용자 정보
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // 정보를 추출해낼 Object 크기가 너무 커서 필요한 정보만 빼오는 과정
      if (user) {
        setUserObj({
          displayName : user.displayName,
          uid : user.uid,
          updateProfile : (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);  // 어플리케이션이 시작되고 준비되면 setInit(ture)
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName : user.displayName,
      uid : user.uid,
      updateProfile : (args) => user.updateProfile(args),
    });
  }
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj = {userObj}
        />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;