import styles from "./App.module.css";
import React, { Routes, Route } from "react-router-dom";
import EcoName from "./pages/ecoName/EcoName";
import Login from "./pages/login/Login";
import FindPassword from "./pages/findPassword/FindPassword";
import Regist from "./pages/regist/Regist";
import MainFeed from "./pages/mainFeed/MainFeed";

/* DailyMission */
import MissionMain from "./pages/dailyMission/missionMain/missionMain";
import MissionDetail from "./pages/dailyMission/missionDetail/missionDetail";
import MissionCustom from "./pages/dailyMission/missionCustom/missionCustom";
import MissionUpdate from "./pages/dailyMission/missionUpdate/missionUpdate";
import { useEffect, useReducer, useRef } from "react";

function App() {
  const [data, dispatch] = useReducer(reducer, []);
  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then(res => res.json());

    const initData = res.slice(0, 20).map(it => {
      return {
        auth: it.email,
        content: it.body,
        id: dataId.current++,
      };
    });

    dispatch({ type: "INIT", data: initData });
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className={styles.App}>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/regist" element={<Regist />}></Route>
        <Route path="/findPassword" element={<FindPassword />}></Route>
        <Route path="/ecoName" element={<EcoName />}></Route>

        {/*DailyMission */}
        <Route path="/missionMain" element={<MissionMain />} />
        <Route path="/missionDetail" element={<MissionDetail />} />
        <Route path="/missionUpdate" element={<MissionUpdate />} />
        <Route path="/missionCustom" element={<MissionCustom />} />

        <Route path="/mainFeed" element={<MainFeed />}></Route>
      </Routes>
    </div>
  );
}

export default App;
