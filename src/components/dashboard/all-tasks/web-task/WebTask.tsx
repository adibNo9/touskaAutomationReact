import React, { Suspense } from "react";
import LoadingSpinner from "../../../ui/LoadingSpinner";
import { NavLink, Route } from "react-router-dom";
import classes from "../tasks.module.css";

import { userType } from "../../Dashboard";

const CreateWebTask = React.lazy(() => import("./CreateWebTask"));
const ReportWebAdmin = React.lazy(() => import("./ReportWebAdmin"));
const ReportWebTasks = React.lazy(() => import("./ReportWebTasks"));
const ReportMasterWeb = React.lazy(() => import("./ReportMasterWeb"));
const ReportWebForAdmins = React.lazy(() => import("./ReportWebForAdmins"));

const WebTask: React.FC<{ userData: userType }> = (props) => {
  const { userData } = props;
  return (
    <section className={classes.tasks}>
      <h1>تسک وب</h1>
      <div className={classes.links}>
        {((userData.user.role_id === "3" && userData.user.is_master === "1") ||
          userData.user.role_id === "1" ||
          userData.user.role_id === "2") && (
          <NavLink
            activeClassName={classes.active}
            to="/dashboard/task-web/create"
          >
            ایجاد تسک وب
          </NavLink>
        )}
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
            گزارشات تایید شده
          </NavLink>
        )}
        {((userData.user.role_id === "3" && userData.user.is_master === "1") ||
          userData.user.role_id === "2") && (
          <NavLink
            activeClassName={classes.active}
            to="/dashboard/task-web/tasks-reports"
          >
            گزارشات تسک‌ها
          </NavLink>
        )}
      </div>
      <div className={classes.content}>
        <Suspense
          fallback={
            <div className="spinner">
              <LoadingSpinner />
            </div>
          }
        >
          {((userData.user.role_id === "3" &&
            userData.user.is_master === "1") ||
            userData.user.role_id === "1" ||
            userData.user.role_id === "2") && (
            <Route path="/dashboard/task-web/create">
              <CreateWebTask />
            </Route>
          )}

          <Route path="/dashboard/task-web/reports">
            <ReportWebTasks userEmail={userData.user.email} />
          </Route>
          {userData.user.role_id === "1" && (
            <Route path="/dashboard/task-web/admin-reports">
              <ReportWebAdmin userEmail={userData.user.email} />
            </Route>
          )}
          {userData.user.role_id === "3" && userData.user.is_master === "1" && (
            <Route path="/dashboard/task-web/developer-reports">
              <ReportMasterWeb userEmail={userData.user.email} />
            </Route>
          )}
          {((userData.user.role_id === "3" &&
            userData.user.is_master === "1") ||
            userData.user.role_id === "2") && (
            <Route path="/dashboard/task-web/tasks-reports">
              <ReportWebForAdmins userEmail={userData.user.email} />
            </Route>
          )}
        </Suspense>
      </div>
    </section>
  );
};

export default WebTask;
