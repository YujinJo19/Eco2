import React from "react";
import { Link } from "react-router-dom";
import { GreenBtn } from "../../../components/styled";

const missionDetail = () => {
  /* 더미객체  */
  const DummyDailyMission = [
    {
      id: 1,
      content: "텀블러 사용해서 지구 지키기",
    },
    {
      id: 2,
      content: "밖에 나갈때 멀티탭 뽑기",
    },
    {
      id: 3,
      content: "더운날 찬물 샤워 해보기",
    },
  ];
  return (
    <div>
      <div>
        <p>오늘은 어떤 도전을 해볼까?</p>
      </div>
      <div>
        <h3>텀블러 사용해서 지구 지키기</h3>
      </div>
      <div>
        <span>기본</span>
        <span>내 목록</span>
      </div>
      <div>
        {DummyDailyMission.map(it => (
          <div key={it.id}>
            <input type={"checkbox"}></input>
            <span>{it.content}</span>
            <i className={`${"fa-solid fa-trash-can"}`}></i>
          </div>
        ))}
      </div>
      <div>
        <i className={`${"fa-solid fa-circle-plus"} `}></i>
      </div>
      <div>
        <GreenBtn>선택한 미션 추가하기</GreenBtn>
      </div>
    </div>
  );
};

export default missionDetail;
