import React from "react";
import { useSelector } from "react-redux";
import ReplyItem from "../replyItem/ReplyItem";
import styles from "./ReplyList.module.css";

const ReplyList = ({ id, replys }) => {
  console.log(replys);
  return (
    <ul className={styles.ul}>
      {replys?.length > 0 &&
        replys.map(
          (reply) =>
            id === reply.commentId && (
              <ReplyItem
                key={reply.id}
                id={reply.id}
                content={reply.content}
                user={reply.user}
                postId={reply.postId}
              />
            )
        )}
    </ul>
  );
};

export default ReplyList;
