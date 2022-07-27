import styles from "./App.module.css";
import { Routes, Route } from "react-router-dom";
import EcoName from "./pages/ecoName/EcoName";
import Login from "./pages/login/Login";
import FindPassword from "./pages/findPassword/FindPassword";
import Regist from "./pages/regist/Regist";
import Mission from "./pages/dailyMission/Mission";

function App() {
  return (
    <div className={styles.App}>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/regist" element={<Regist />}></Route>
        <Route path="/findPassword" element={<FindPassword />}></Route>
        <Route path="/ecoName" element={<EcoName />}></Route>
        <Route pate="/mission/mission" element={<Mission />} />
      </Routes>
    </div>
  );
}

export default App;