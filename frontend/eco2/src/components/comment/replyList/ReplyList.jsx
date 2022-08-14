import React from "react";
import { useSelector } from "react-redux";
import ReplyItem from "../replyItem/ReplyItem";
import styles from "./ReplyList.module.css";

const ReplyList = ({ id, commentId, replys, commentUserId, setTest }) => {
  return (
    <div className={styles.replyList}>
      {replys?.length > 0 &&
        replys.map(
          (reply) =>
            id === reply.commentId && (
              <ReplyItem
                key={reply.id}
                id={reply.id}
                content={reply.content}
                user={reply.userName}
                postId={reply.postId}
                commentUserId={commentUserId}
                setTest={setTest}
                userEmail={reply.userEmail}
                registTime={reply.registTime}
              />
            )
        )}
    </div>
  );
};

export default ReplyList;
