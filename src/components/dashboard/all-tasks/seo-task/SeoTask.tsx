import React, { Suspense } from "react";

import { NavLink, Route } from "react-router-dom";
import LoadingSpinner from "../../../ui/LoadingSpinner";
import { userType } from "../../Dashboard";
import classes from "../tasks.module.css";

const CreateSeoTask = React.lazy(() => import("./CreateSeoTask"));
const ReportSeoAdmin = React.lazy(() => import("./ReportSeoAdmin"));
const ReportSeoTasks = React.lazy(() => import("./ReportSeoTasks"));

const SeoTask: React.FC<{ userData: userType }> = (props) => {
  const { userData } = props;

  return (
    <section className={classes.tasks}>
      <h1>تسک سئو</h1>
      <div className={classes.links}>
        {(userData.user.role_id === "1" || userData.user.role_id === "2") && (
          <NavLink
            activeClassName={classes.active}
            to="/dashboard/task-seo/create"
          >
            ایجاد تسک سئو
          </NavLink>
        )}
        <NavLink
          activeClassName={classes.active}
          to="/dashboard/task-seo/reports"
        >
          تسک‌های شما
        </NavLink>
        {(userData.user.role_id === "1" || userData.user.role_id === "2") && (
          <NavLink
            activeClassName={classes.active}
            to="/dashboard/task-seo/admin-reports"
          >
            گزارشات
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
          {(userData.user.role_id === "1" || userData.user.role_id === "2") && (
            <Route path="/dashboard/task-seo/create">
              <CreateSeoTask />
            </Route>
          )}
          <Route path="/dashboard/task-seo/reports">
            <ReportSeoTasks />
          </Route>
          {(userData.user.role_id === "1" || userData.user.role_id === "2") && (
            <Route path="/dashboard/task-seo/admin-reports">
              <ReportSeoAdmin userEmail={userData.user.email} />
            </Route>
          )}
        </Suspense>
      </div>
    </section>
  );
};

export default SeoTask;
