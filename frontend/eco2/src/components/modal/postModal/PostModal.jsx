import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deletePost } from "../../../store/mainFeed/feedSlice";
import { postDelete } from "../../../store/post/postSlice";
import styles from "./PostModal.module.css";

const PostModal = ({
  title,
  content,
  type,
  postId,
  img,
  category,
  postContent,
  closeModal,
  noticeId,
  noticeContent,
  noticeTitle,
}) => {
  const [hidden, setHidden] = useState(false);
  const displayType = hidden ? styles.hidden : null;
  const colorType = type === "수정" ? styles.editButton : styles.warningButton;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClick = () => {
    if (type === "삭제") {
      dispatch(postDelete({ postId })).then((res) => {
        navigate("/mainFeed");
      });
    } else {
      window.location.replace(`/post/${postId}`);
    }
  };
  useEffect(() => {
    document.body.style = `overflow: hidden`;
    return () => (document.body.style = `overflow: auto`);
  }, []);
  return (
    <div className={`${displayType} ${styles.modal}`} onClick={closeModal}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalBody}>
        <div className={styles.modalTitle}>
          {type === "수정" ? (
            <i className={`fa-regular fa-circle-check ${styles.editIcon}`}></i>
          ) : type === "삭제" ? (
            <i className={`fa-regular fa-bell ${styles.deleteIcon}`}></i>
          ) : (
            <i
              className={`fa-solid fa-circle-exclamation ${styles.deleteIcon}`}
            ></i>
          )}
          <h2 className={styles.title}>{title}</h2>
        </div>
        <p className={styles.content}>{content}</p>
        <div className={styles.buttonGroup}>
          {type === "수정" ? (
            <Link
              to="/post"
              state={{ postId, img, category, content: postContent }}
            >
              <button className={`${colorType}`}>{type}</button>
            </Link>
          ) : (
            <button onClick={onClick} className={`${colorType}`}>
              {type}
            </button>
          )}
          <button
            onClick={() => {
              setHidden(true);
              document.body.style = `overflow: auto`;
            }}
            className={`${styles.cancleButton}`}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
