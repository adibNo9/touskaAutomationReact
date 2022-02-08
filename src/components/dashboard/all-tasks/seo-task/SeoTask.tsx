import { useState } from "react";
import { NavLink, Route } from "react-router-dom";
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
        <NavLink
          activeClassName={classes.active}
          to="/dashboard/task-seo/create"
        >
          ایجاد تسک سئو
        </NavLink>
        <NavLink
          activeClassName={classes.active}
          to="/dashboard/task-seo/reports"
        >
          تسک‌های شما
        </NavLink>
        <NavLink
          activeClassName={classes.active}
          to="/dashboard/task-seo/admin-reports"
        >
          گزارشات
        </NavLink>
      </div>
      <div className={classes.content}>
        <Route path="/dashboard/task-seo/create">
          <CreateSeoTask />
        </Route>
        <Route path="/dashboard/task-seo/reports">
          <ReportSeoTasks />
        </Route>
        <Route path="/dashboard/task-seo/admin-reports">
          <ReportSeoAdmin />
        </Route>
      </div>
    </section>
  );
};

export default SeoTask;
