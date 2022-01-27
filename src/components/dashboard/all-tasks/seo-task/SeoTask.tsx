import { useState } from "react";
import classes from "../tasks.module.css";
import CreateSeoTask from "./CreateSeoTask";
import ReportSeoAdmin from "./ReportSeoAdmin";
import ReportSeoTasks from "./ReportSeoTasks";

const SeoTask: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showReports, setShowReports] = useState(true);
  const [showAdminReports, setShowAdminReports] = useState(false);

  const showCreateHandler = () => {
    setShowCreate(true);
    setShowReports(false);
    setShowAdminReports(false);
  };

  const showReportsHandler = () => {
    setShowCreate(false);
    setShowAdminReports(false);
    setShowReports(true);
  };

  const showAdminReportsHandler = () => {
    setShowCreate(false);
    setShowAdminReports(true);
    setShowReports(false);
  };

  return (
    <section className={classes.tasks}>
      <h1>تسک سئو</h1>
      <div className={classes.links}>
        <button
          onClick={showCreateHandler}
          className={showCreate ? classes.active : classes.noActive}
        >
          ایجاد تسک سئو
        </button>
        <button
          onClick={showReportsHandler}
          className={showReports ? classes.active : classes.noActive}
        >
          تسک‌های شما
        </button>
        <button
          onClick={showAdminReportsHandler}
          className={showAdminReports ? classes.active : classes.noActive}
        >
          گزارشات
        </button>
      </div>
      <div className={classes.content}>
        {showCreate && <CreateSeoTask />}
        {showReports && <ReportSeoTasks />}
        {showAdminReports && <ReportSeoAdmin />}
      </div>
    </section>
  );
};

export default SeoTask;
