import React, { useEffect, useState } from "react";
import Map from "../../../components/map/Map";
import { getUserName } from "../../../store/user/common";
import styles from "./QuestMain.module.css";
import QuestModal from "../../../components/modal/questModal/QuestModal";
import DetailModal from "../../../components/modal/questModal/DetailModal";
import PostModal from "../../../components/modal/questModal/PostModal";
import axiosService from "../../../store/axiosService";
const QuestMain = () => {
  const [count, setCount] = useState(0);
  const [makeFlag, setMakeFlag] = useState(false);
  const name = getUserName();
  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [questList, setQuestList] = useState(null);
  const [payload, setPayload] = useState(null);
  useEffect(() => {
    axiosService.get("/mission/quest").then((res) => {
      setQuestList(res.data.missions);
    });
  }, []);
  const [testDetail] = useState({
    userId: 1,
    missionId: 1,
    title: "공원 청소를 합시다!",
    content: "공원에 쓰레기가 너무 많아요 쓰레기를 치웁시다!",
    imgURL: process.env.PUBLIC_URL + "test.jpg",
  });

  const openCreateModal = () => {
    setCreateModal(true);
  };
  const closeCreateModal = () => {
    setCreateModal(false);
  };
  const openDetailModal = (id) => {
    setDetailModal(true);
  };
  const closeDetailModal = () => {
    setDetailModal(false);
  };
  const openPostModal = () => {
    setPostModal(true);
  };
  const closePostModal = () => {
    setPostModal(false);
  };
  return (
    <div>
      <div className={styles.titleGroup}>
        <p className={styles.title}>퀘스트 조회하기</p>
        <button
          className={styles.button}
          onClick={() => {
            openCreateModal();
          }}
        >
          {makeFlag ? "취소하기" : "생성하기"}
        </button>
      </div>
      <Map
        makeFlag={makeFlag}
        openCreateModal={openCreateModal}
        openDeatailModal={openDetailModal}
        setMakeFlag={setMakeFlag}
        payload={payload}
      />
      <div>
        <p className={styles.text}>
          {name}님 주변에는 현재 {count}개의 퀘스트가 있습니다.
        </p>
      </div>
      <QuestModal
        open={createModal}
        close={closeCreateModal}
        header="Modal heading"
        questList={questList}
        setPayload={setPayload}
        setMakeFlag={setMakeFlag}
      ></QuestModal>
      <DetailModal
        open={detailModal}
        close={closeDetailModal}
        openPost={openPostModal}
        content={testDetail}
      ></DetailModal>
      <PostModal open={postModal} close={closePostModal}></PostModal>
    </div>
  );
};

export default QuestMain;