import { useState } from "react";
import { NavLink, Route } from "react-router-dom";
import classes from "../tasks.module.css";
import CreateWebTask from "./CreateWebTask";
import ReportWebAdmin from "./ReportWebAdmin";
import ReportWebTasks from "./ReportWebTasks";
import ReportMasterWeb from "./ReportMasterWeb";

import { userType } from "../../Dashboard";

const WebTask: React.FC<{ userData: userType }> = (props) => {
  const { userData } = props;
  return (
    <section className={classes.tasks}>
      <h1>تسک وب</h1>
      <div className={classes.links}>
        <NavLink
          activeClassName={classes.active}
          to="/dashboard/task-web/create"
        >
          ایجاد تسک وب
        </NavLink>
        <NavLink
          activeClassName={classes.active}
          to="/dashboard/task-web/reports"
        >
          تسک‌های شما
        </NavLink>
        {userData.user.role_id === "1" && (
          <NavLink
            activeClassName={classes.active}
            to="/dashboard/task-web/admin-reports"
          >
            گزارشات
          </NavLink>
        )}
        {userData.user.role_id === "3" && userData.user.is_master === "1" && (
          <NavLink
            activeClassName={classes.active}
            to="/dashboard/task-web/developer-reports"
          >
            گزارشات
          </NavLink>
        )}
      </div>
      <div className={classes.content}>
        <Route path="/dashboard/task-web/create">
          <CreateWebTask />
        </Route>
        <Route path="/dashboard/task-web/reports">
          <ReportWebTasks />
        </Route>
        {userData.user.role_id === "1" && (
          <Route path="/dashboard/task-web/admin-reports">
            <ReportWebAdmin />
          </Route>
        )}
        {userData.user.role_id === "3" && userData.user.is_master === "1" && (
          <Route path="/dashboard/task-web/developer-reports">
            <ReportMasterWeb />
          </Route>
        )}
      </div>
    </section>
  );
};

export default WebTask;
