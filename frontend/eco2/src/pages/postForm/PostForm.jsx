import React, { useEffect, useState } from "react";
import styles from "./PostForm.module.css";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ShortGreenBtn } from "../../components/styled";
import { postCreate, postUpdate } from "../../store/post/postSlice";
import { getUserEmail, getUserId } from "../../store/user/common";
import { clearMission } from "../../store/mission/missionMainSlice";

const PostForm = () => {
  const [fileImage, setFileImage] = useState("");
  const [file, setFile] = useState("");
  const [editText, setEditText] = useState("");
  const [text, setText] = useState("");
  const [id, setUserId] = useState(0);
  const [publicFlag, setPublicFlag] = useState(false);
  const [commentFlag, setCommentFlag] = useState(false);
  const [imageCheck, setImageCheck] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.content) {
      setEditText(location.state?.content);
    }
  }, []);
  const saveFileImage = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files);
    setFileImage(URL.createObjectURL(e.target.files[0]));
    setImageCheck(true);
  };

  // const deleteFileImage = (e) => {
  //   URL.revokeObjectURL(fileImage);
  //   setFileImage("");
  // };

  const dispatch = useDispatch();
  const missionClear = () => {
    dispatch(
      clearMission({ id, missionId: location.state.missionIdTest })
    ).then((res) => {
      if (res.payload?.status === 200) {
        navigate("/mainTree");
      }
    });
  };
  // 글 작성 요청보내기
  const onSubmit = (e) => {
    console.log(location.state?.missionId);
    e.preventDefault();
    const formDataCreate = new FormData();
    const formDataUpdate = new FormData();
    const postUpdateDto = {
      content: editText,
      publicFlag: !publicFlag,
      commentFlag: !commentFlag,
    };

    if (location.state?.postId) {
      // 글 수정 시 해당 글 상세 페이지로 다시 이동
      const json = JSON.stringify(postUpdateDto);
      const blob = new Blob([json], {
        type: "application/json",
      });
      formDataUpdate.append("postImage", file);
      formDataUpdate.append("postUpdateDto", blob);

      dispatch(
        postUpdate({ postId: location.state?.postId, formData: formDataUpdate })
      ).then((res) => {
        if (res.payload?.status === 200) {
          navigate(`/post/${location.state?.postId}`);
        }
      });
    } else {
      if (location.state?.missionId) {
        const postCreateDto = {
          content: editText,
          user: {
            id: id,
          },
          mission: {
            id: location.state.missionId,
          },
          publicFlag: !publicFlag,
          commentFlag: !commentFlag,
        };
        const json = JSON.stringify(postCreateDto);
        const blob = new Blob([json], {
          type: "application/json",
        });
        formDataCreate.append("postImage", file);
        formDataCreate.append("postCreateDto", blob);
        dispatch(postCreate({ formData: formDataCreate }))
          .then((res) => {
            if (res.payload?.status === 200) {
              missionClear();
            }
          })

          .catch((err) => console.log(err));
      } else if (location.state?.customId) {
        const postCreateDto = {
          content: editText,
          user: {
            id: id,
          },
          customMission: {
            id: location.state.customId,
          },
          publicFlag: !publicFlag,
          commentFlag: !commentFlag,
        };
        const json = JSON.stringify(postCreateDto);
        const blob = new Blob([json], {
          type: "application/json",
        });
        formDataCreate.append("postImage", file);
        formDataCreate.append("postCreateDto", blob);
        dispatch(postCreate({ formData: formDataCreate }))
          .then((res) => {
            if (res.payload?.status === 200) {
              missionClear();
            }
          })

          .catch((err) => console.log(err));
      } else {
        const postCreateDto = {
          content: editText,
          user: {
            id: id,
          },
          quest: {
            id: location.state?.questId,
          },
          publicFlag: !publicFlag,
          commentFlag: !commentFlag,
        };
        const json = JSON.stringify(postCreateDto);
        const blob = new Blob([json], {
          type: "application/json",
        });
        formDataCreate.append("postImage", file);
        formDataCreate.append("postCreateDto", blob);
        dispatch(postCreate({ formData: formDataCreate }))
          .then((res) => {
            if (res.payload?.status === 200) {
              missionClear();
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };

  // 유저 아이디 가져오기
  useEffect(() => {
    setUserId(getUserId());
  }, []);
  return (
    <div>
      <div className={styles.titleGroup}>
        <i className={`fa-brands fa-pagelines ${styles.titleIcon}`}></i>
        <h2 className={styles.title}>인증하기</h2>
      </div>
      <hr className={styles.line} />
      <form onSubmit={(e) => onSubmit(e)}>
        <div>
          {fileImage ? (
            <img className={styles.img} alt="sample" src={fileImage} />
          ) : location.state?.postId ? (
            <img
              className={styles.img}
              alt="originalImg"
              src={`http://localhost:8002/img/post/${location.state.postId}`}
            />
          ) : null}
        </div>
        <div className={styles.fileInputGroup}>
          <input className={styles.fileInput} placeholder="첨부파일" />
          <label htmlFor="file" className={styles.imgLabel}>
            파일찾기
          </label>
          <input
            encType="multipart/form-data"
            type="file"
            id="file"
            name="post_file"
            onChange={saveFileImage}
            className={`${styles.fileInput} ${styles.baseFileInput}`}
          />
        </div>
        <div>
          <label htmlFor="post">게시물 비공개</label>
          <input
            type="checkbox"
            id="post"
            onChange={(e) => {
              setPublicFlag(e.target.checked);
            }}
          />
          <label htmlFor="comment">댓글 비공개</label>
          <input
            type="checkbox"
            id="comment"
            onChange={(e) => {
              setCommentFlag(e.target.checked);
            }}
          />
        </div>
        <p className={styles.missionTitle}>미션 제목</p>
        <textarea
          required
          className={styles.content}
          value={editText ? editText : text}
          onChange={(e) => {
            setText(e.target.value);
            setEditText(e.target.value);
          }}
        ></textarea>
        <ShortGreenBtn
          type="submit"
          disabled={!imageCheck}
          className={styles.button}
        >
          작성
        </ShortGreenBtn>
      </form>
    </div>
  );
};

export default PostForm;