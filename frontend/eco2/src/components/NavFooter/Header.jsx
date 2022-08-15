import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAccessToken,
  getUserEmail,
  getUserId,
} from "../../store/user/common";
import styles from "./Header.module.css";

const Header = () => {
  const [userId, setUserId] = useState(getUserId());
  const [imgSrc, setImgSrc] = useState("");
  const [checkImg, setCheckImg] = useState(0);

  let navigate = useNavigate();

  useEffect(() => {
    setUserId(getUserId());
    if (!userId) {
      return;
    }
    // setImgSrc(`http://localhost:8002/img/profile/${userId}`);
  }, [userId, checkImg]);

  return (
    <header className={styles.Header}>
      <div
        onClick={() => {
          navigate("/mainTree");
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          className={styles.Img}
        ></img>
        <img
          src={`${process.env.PUBLIC_URL}/logoText.png`}
          className={styles.Img}
        ></img>
      </div>
      <nav>
        <button
          className={styles.profileButton}
          onClick={() => {
            navigate(`/profile/${getUserId()}`);
          }}
        >
          <i className="fa-solid fa-emergency">신고</i>
        </button>

        <button
          className={styles.profileButton}
          onClick={() => {
            navigate("/chatting");
          }}
        >
          <i className={`fa-solid fa-comments ${styles.headerIcon}`}></i>
        </button>
        <button
          className={styles.profileButton}
          onClick={() => {
            navigate(`/profile/${getUserId()}`, { state: { setCheckImg } });
          }}
        >
          <img
            src={`${process.env.REACT_APP_BE_HOST}img/profile/${userId}`}
            alt="profileImg"
            className={styles.profileImg}
          />
        </button>
      </nav>
    </header>
  );
};

export default Header;
