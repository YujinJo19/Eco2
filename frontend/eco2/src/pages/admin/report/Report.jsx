import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReportList from "../../../components/admin/reportList/ReportList";
import { reportList } from "../../../store/admin/reportSlice";
import styles from "./Report.module.css";

const Report = () => {

  const [reports, setReports] = useState([]);
  const [commentReports, setCommentsReports] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reportList({})).then((res) => {
      if (res.payload.status === 200) {
        setReports(res.payload.reportList);
      }
    });
  }, []);

  return (
    <div className={styles.report}>
      <div className={styles.title}>신고 내역</div>
      <div className={styles.table}>
        <table>
          <tr>
            <th width="8%">유형</th>
            <th width="17%">신고내용</th>
            <th width="10%"></th>
            <th width="9%">내역</th>
          </tr>
        </table>
      </div>

      <div className={styles.post}>
        {reports.length > 0 ? (
          <ReportList reports={reports}
          />) : (
          <div className={styles.noPostList}>
            <span className={styles.noPostMessage}>신고 내역이 없습니다.</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default Report;
