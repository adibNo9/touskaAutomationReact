import { useState } from "react";
import classes from "../tasks.module.css";
import CreateWebTask from "./CreateWebTask";
import ReportWebTasks from "./ReportWebTasks";

const WebTask: React.FC = () => {
  const [showCreate, setShowCreate] = useState(true);
  const [showReports, setShowReports] = useState(false);

  const showCreateHandler = () => {
    setShowCreate(true);
    setShowReports(false);
  };

  const showReportsHandler = () => {
    setShowCreate(false);
    setShowReports(true);
  };

  return (
    <section className={classes.tasks}>
      <h1>تسک وب</h1>
      <div className={classes.links}>
        <button
          onClick={showCreateHandler}
          className={showCreate ? classes.active : classes.noActive}
        >
          ایجاد تسک وب
        </button>
        <button
          onClick={showReportsHandler}
          className={showReports ? classes.active : classes.noActive}
        >
          گزارشات
        </button>
      </div>
      <div className={classes.content}>
        {showCreate && <CreateWebTask />}
        {showReports && <ReportWebTasks />}
      </div>
    </section>
  );
};

export default WebTask;
