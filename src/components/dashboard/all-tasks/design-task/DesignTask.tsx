import React, { Suspense } from "react";

import { NavLink, Route } from "react-router-dom";
import LoadingSpinner from "../../../ui/LoadingSpinner";
import { userType } from "../../Dashboard";
import classes from "../tasks.module.css";

const CreateDesignTask = React.lazy(() => import("./CreateDesignTask"));
const ReportDesignAdmin = React.lazy(() => import("./ReportDesignAdmin"));
const ReportDesignTasks = React.lazy(() => import("./ReportDesignTasks"));

const DesignTask: React.FC<{ userData: userType }> = (props) => {
  const { userData } = props;

  return (
    <section className={classes.tasks}>
      <h1>تسک دیزاین</h1>
      <div className={classes.links}>
        {(userData.user.role_id === "1" || userData.user.role_id === "2") && (
          <NavLink
            activeClassName={classes.active}
            to="/dashboard/task-design/create"
          >
            ایجاد تسک دیزاین
          </NavLink>
        )}
        <NavLink
          activeClassName={classes.active}
          to="/dashboard/task-design/reports"
        >
          تسک‌های شما
        </NavLink>
        {(userData.user.role_id === "1" || userData.user.role_id === "2") && (
          <NavLink
            activeClassName={classes.active}
            to="/dashboard/task-design/admin-reports"
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
            <Route path="/dashboard/task-design/create">
              <CreateDesignTask />
            </Route>
          )}
          <Route path="/dashboard/task-design/reports">
            <ReportDesignTasks userEmail={userData.user.email} />
          </Route>
          {(userData.user.role_id === "1" || userData.user.role_id === "2") && (
            <Route path="/dashboard/task-design/admin-reports">
              <ReportDesignAdmin
                userEmail={userData.user.email}
                userRole={userData.user.role_id}
              />
            </Route>
          )}
        </Suspense>
      </div>
    </section>
  );
};

export default DesignTask;
